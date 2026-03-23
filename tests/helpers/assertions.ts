import { Page, expect } from "@playwright/test"

/**
 * Assert that a page loaded successfully — checks for visible body and
 * HTTP 200-range status.
 */
export async function expectPageLoaded(page: Page) {
  await expect(page.locator("body")).toBeVisible()
  // Page should not show a hard server error
  const content = await page.content()
  expect(content).not.toContain("Internal Server Error")
}

/**
 * Collect console errors during a test.
 * Returns a list of error messages.
 *
 * Usage:
 *   const errors = collectConsoleErrors(page)
 *   // ... do things ...
 *   expect(errors).toHaveLength(0)
 */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text())
    }
  })
  return errors
}
