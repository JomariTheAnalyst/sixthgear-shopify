import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright Configuration — SixthGearMoto E2E Smoke Tests
 *
 * Two environments:
 *   - local:      TEST_ENV unset  → http://localhost:7000
 *   - production: TEST_ENV=production → https://sixthgearmoto.com
 *
 * Chrome only (desktop + mobile).
 */

const isProduction = process.env.TEST_ENV === "production"
const isCI = !!process.env.CI

const BASE_URL = isProduction
  ? "https://sixthgearmoto.com"
  : "http://localhost:7000"

export default defineConfig({
  testDir: "./tests",

  /* Maximum time one test can run */
  timeout: 60_000,

  /* Expect timeout */
  expect: { timeout: 10_000 },

  /* Parallel execution */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source */
  forbidOnly: isCI,

  /* Retries */
  retries: isCI ? 2 : 0,

  /* Workers */
  workers: isCI ? 1 : undefined,

  /* Reporters */
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["list"],
  ],

  /* Shared settings */
  use: {
    baseURL: BASE_URL,
    locale: "en-PH",
    timezoneId: "Asia/Manila",

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  /* Chrome only */
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  /* Output folder for test artifacts */
  outputDir: "test-results/",

  /* Local dev server — only for non-production runs */
  ...(isProduction
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          port: 7000,
          timeout: 120_000,
          reuseExistingServer: !isCI,
        },
      }),
})
