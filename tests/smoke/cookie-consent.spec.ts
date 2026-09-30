import { expect, test, type Page } from "@playwright/test"

/**
 * Privacy / consent behaviour:
 * - Nothing needs consent right now (no analytics or marketing of our own), so
 *   there is no banner.
 * - Every third-party service loads with the page, with no clicks, including
 *   for Global Privacy Control visitors: Tidio and cal.com on every page, the
 *   Google map on Home and Contact, and the Curator feed on Home.
 * - Cookie settings (footer) opens the panel, which lists what loads.
 */

const THIRD_PARTIES = {
  tidio: /code\.tidio\.co/,
  cal: /app\.cal\.com|cal\.com\/embed/,
  googleMaps: /maps\.google\.|google\.com\/maps/,
  curator: /curator\.io/,
}

type ThirdParty = keyof typeof THIRD_PARTIES

const EXPECTED_BY_PAGE: Record<string, ThirdParty[]> = {
  "/ph": ["tidio", "cal", "googleMaps", "curator"],
  "/ph/contact": ["tidio", "cal", "googleMaps"],
}

function recordRequests(page: Page) {
  const urls: string[] = []
  page.on("request", (request) => urls.push(request.url()))
  return urls
}

const requested = (urls: string[], pattern: RegExp) =>
  urls.some((url) => pattern.test(url))

// Scroll through the page (no clicks) so lazy iframes reach the viewport.
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
  })
}

async function expectAllLoadWithoutClicks(page: Page) {
  const urls = recordRequests(page)

  for (const [path, services] of Object.entries(EXPECTED_BY_PAGE)) {
    await page.goto(path)
    await scrollThrough(page)

    for (const name of services) {
      await expect
        .poll(() => requested(urls, THIRD_PARTIES[name]), {
          message: `${name} should load on ${path} without a click`,
          timeout: 30_000,
        })
        .toBe(true)
    }
  }
}

const banner = (page: Page) => page.getByTestId("consent-banner")
const settingsPanel = (page: Page) => page.getByTestId("consent-settings")

test.describe("Privacy and cookie consent", () => {
  // The Next.js dev "Issues" badge (dev server only) can sit on top of
  // bottom-left buttons on phones; production has no such overlay.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style")
        style.textContent = "nextjs-portal { display: none !important; }"
        document.head.appendChild(style)
      })
    })
  })

  test("first visit shows no banner", async ({ page }) => {
    await page.goto("/ph")
    await page.waitForTimeout(1_500)
    await expect(banner(page)).toHaveCount(0)
  })

  test("map, chat, booking and feed load with no clicks", async ({ page }) => {
    await expectAllLoadWithoutClicks(page)
  })

  test("they also load with Global Privacy Control on", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "globalPrivacyControl", {
        get: () => true,
      })
    })
    await expectAllLoadWithoutClicks(page)
  })

  test("the map iframe renders on Contact without a click", async ({ page }) => {
    await page.goto("/ph/contact")
    const map = page.locator('iframe[title="Sixthgear Store Location"]')
    await map.scrollIntoViewIfNeeded()
    await expect(map).toBeVisible()
    await expect(map).toHaveAttribute("loading", "lazy")
  })

  test("View Social Wall opens Instagram in a new tab", async ({ page }) => {
    await page.goto("/ph")
    const link = page.getByRole("link", { name: "View Social Wall" })
    await expect(link).toHaveAttribute("href", /instagram\.com/)
    await expect(link).toHaveAttribute("target", "_blank")
  })

  test("Cookie settings in the footer opens the panel", async ({ page }) => {
    await page.goto("/ph")

    await page.getByTestId("footer-cookie-settings").click()
    const panel = settingsPanel(page)
    await expect(panel).toBeVisible()
    await expect(panel.getByRole("switch")).toHaveCount(0)
    await expect(panel.getByText("Loads with the page", { exact: true }).last()).toBeVisible()
    await expect(panel).not.toContainText("Loads when you use it")

    await page.keyboard.press("Escape")
    await expect(panel).toBeHidden()
  })

  test("the /cookies page lists the registry", async ({ page }) => {
    await page.goto("/ph/cookies")
    await expect(page.getByRole("heading", { name: "Cookie Policy", level: 1 })).toBeVisible()
    await expect(page.getByTestId("cookie-table-necessary")).toContainText("shopify_cart_id")
    const withPage = page.getByTestId("cookie-table-withPage")
    for (const vendor of ["Tidio", "cal.com", "Google Maps", "YouTube", "Curator", "Meta"]) {
      await expect(withPage).toContainText(vendor)
    }
    await expect(page.getByTestId("cookie-table-onUse")).toHaveCount(0)
    await expect(page.getByTestId("cookie-table-marketing")).toHaveCount(0)
    await expect(page.getByTestId("cookie-table-analytics")).toHaveCount(0)
  })
})
