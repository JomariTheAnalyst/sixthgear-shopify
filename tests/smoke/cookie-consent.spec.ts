import { expect, test, type Page } from "@playwright/test"

/**
 * Privacy / consent behaviour:
 * - No analytics or marketing tools are registered, so there is no banner.
 * - Nothing from Tidio, cal.com, Curator, Facebook or Google Maps loads until
 *   the visitor uses that feature; using it loads it.
 * - Cookie settings (footer) shows each category's status.
 */

const THIRD_PARTIES = {
  tidio: /code\.tidio\.co|widget-v4\.tidiochat\.com/,
  cal: /app\.cal\.com|cal\.com\/embed/,
  curator: /curator\.io/,
  facebook: /connect\.facebook\.net|facebook\.com\/(plugins|tr)/,
  googleMaps: /maps\.google\.|google\.com\/maps/,
}

// Settle time for afterInteractive scripts and lazy iframes on a dev server.
const SETTLE_MS = 5_000

function recordRequests(page: Page) {
  const urls: string[] = []
  page.on("request", (request) => urls.push(request.url()))
  return urls
}

const requested = (urls: string[], pattern: RegExp) =>
  urls.some((url) => pattern.test(url))

async function settle(page: Page) {
  // Scroll through the page so lazy content gets its chance to load.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
  })
  await page.waitForTimeout(SETTLE_MS)
}

test.describe("Privacy: third parties load only when used", () => {
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

  test("no banner while no analytics or marketing tools are registered", async ({ page }) => {
    await page.goto("/ph")
    await page.waitForTimeout(1_500)
    await expect(page.getByTestId("consent-banner")).toHaveCount(0)
  })

  test("browsing loads nothing from Tidio, cal.com, Curator, Facebook or Google Maps", async ({ page }) => {
    const urls = recordRequests(page)

    await page.goto("/ph")
    await expect(page.getByTestId("chat-launcher")).toBeVisible()
    await expect(page.getByTestId("social-feed-placeholder")).toBeVisible()
    await settle(page)

    await page.goto("/ph/contact")
    await expect(page.getByTestId("map-placeholder")).toBeVisible()
    await settle(page)

    for (const [name, pattern] of Object.entries(THIRD_PARTIES)) {
      expect(requested(urls, pattern), `${name} loaded without being used`).toBe(false)
    }
  })

  test("tapping the chat button loads Tidio", async ({ page }) => {
    await page.goto("/ph/contact")
    const launcher = page.getByTestId("chat-launcher")
    await expect(launcher).toBeVisible()

    const tidio = page.waitForRequest(THIRD_PARTIES.tidio)
    await launcher.click()
    await tidio
  })

  test("returning chat visitors get Tidio on page load", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("tidio_state_test", "{}")
    })

    const tidio = page.waitForRequest(THIRD_PARTIES.tidio)
    await page.goto("/ph/contact")
    await tidio
  })

  test("booking and map load when opened", async ({ page }) => {
    await page.goto("/ph/contact")

    const cal = page.waitForRequest(THIRD_PARTIES.cal)
    await page.getByRole("link", { name: /Book Service Online/ }).click()
    await cal

    await page.keyboard.press("Escape")
    await page.goto("/ph/contact")
    const maps = page.waitForRequest(THIRD_PARTIES.googleMaps)
    await page.getByRole("button", { name: "Open map" }).click()
    await maps
    await expect(page.locator('iframe[title="Sixthgear Store Location"]')).toBeVisible()
  })

  test("the social feed loads when the visitor asks for it", async ({ page }) => {
    await page.goto("/ph")
    const curator = page.waitForRequest(THIRD_PARTIES.curator)
    await page.getByRole("button", { name: "Show our social feed" }).click()
    await curator
  })

  test("Cookie settings in the footer shows each category's status", async ({ page }) => {
    await page.goto("/ph")

    await page.getByTestId("footer-cookie-settings").click()
    const panel = page.getByTestId("consent-settings")
    await expect(panel).toBeVisible()
    await expect(panel.getByText("Always on").first()).toBeVisible()
    await expect(panel.getByText("Loads when you use it", { exact: true }).last()).toBeVisible()
    await expect(panel.getByRole("switch")).toHaveCount(0)

    await panel.getByRole("button", { name: "Close", exact: true }).click()
    await expect(panel).toBeHidden()
  })

  test("the /cookies page lists the registry", async ({ page }) => {
    await page.goto("/ph/cookies")
    await expect(page.getByRole("heading", { name: "Cookie Policy", level: 1 })).toBeVisible()
    await expect(page.getByTestId("cookie-table-necessary")).toContainText("shopify_cart_id")
    await expect(page.getByTestId("cookie-table-onUse")).toContainText("Tidio")
    await expect(page.getByTestId("cookie-table-analytics")).toHaveCount(0)
  })
})
