import { expect, test, type Page } from "@playwright/test"

/**
 * Privacy / consent behaviour:
 * - The social media feed (Curator, loads Meta's code) is Marketing, so the
 *   banner asks on the first visit; the feed loads only with consent.
 * - Tidio, cal.com and Google Maps load only when the visitor uses them.
 * - Cookie settings (footer) reopens the panel; the choice persists.
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

  test("first visit shows the banner with three equal choices", async ({ page }) => {
    await page.goto("/ph")
    const bar = banner(page)
    await expect(bar).toBeVisible()
    await expect(bar).toContainText("social media feed")
    await expect(bar.getByRole("button", { name: "Accept all" })).toBeVisible()
    await expect(bar.getByRole("button", { name: "Reject non-essential" })).toBeVisible()
    await expect(bar.getByRole("button", { name: "Customize" })).toBeVisible()
  })

  test("before any choice, nothing third-party loads", async ({ page }) => {
    const urls = recordRequests(page)

    await page.goto("/ph")
    await expect(banner(page)).toBeVisible()
    await expect(page.getByTestId("chat-launcher")).toBeVisible()
    await expect(page.getByTestId("social-feed-placeholder")).toBeVisible()
    await settle(page)

    await page.goto("/ph/contact")
    await expect(page.getByTestId("map-placeholder")).toBeVisible()
    await settle(page)

    for (const [name, pattern] of Object.entries(THIRD_PARTIES)) {
      expect(requested(urls, pattern), `${name} loaded before a choice`).toBe(false)
    }
  })

  test("Reject keeps the social feed and Facebook off", async ({ page }) => {
    const urls = recordRequests(page)
    await page.goto("/ph")
    await banner(page).getByRole("button", { name: "Reject non-essential" }).click()
    await expect(banner(page)).toBeHidden()
    await settle(page)

    for (const [name, pattern] of Object.entries(THIRD_PARTIES)) {
      expect(requested(urls, pattern), `${name} loaded after Reject`).toBe(false)
    }
    await expect(page.getByTestId("social-feed-placeholder")).toBeVisible()
  })

  test("Accept all loads the social feed (Curator and Facebook)", async ({ page }) => {
    await page.goto("/ph")
    const curator = page.waitForRequest(THIRD_PARTIES.curator)
    const facebook = page.waitForRequest(THIRD_PARTIES.facebook)
    await banner(page).getByRole("button", { name: "Accept all" }).click()
    await Promise.all([curator, facebook])
    await expect(page.getByTestId("social-feed-placeholder")).toHaveCount(0)
  })

  test("the feed's own button accepts marketing and loads it", async ({ page }) => {
    await page.goto("/ph")
    const curator = page.waitForRequest(THIRD_PARTIES.curator)
    await page.getByRole("button", { name: "Show our social feed" }).click()
    await curator
    await expect(banner(page)).toBeHidden()
  })

  test("the choice persists after reload", async ({ page, context }) => {
    await page.goto("/ph")
    await banner(page).getByRole("button", { name: "Reject non-essential" }).click()

    const consentCookie = (await context.cookies()).find(
      (cookie) => cookie.name === "sg_consent"
    )
    expect(consentCookie).toBeDefined()
    expect(consentCookie!.expires).toBeGreaterThan(Date.now() / 1000 + 360 * 24 * 3600)

    await page.reload()
    await page.waitForTimeout(1_500)
    await expect(banner(page)).toBeHidden()
  })

  test("Customize starts with nothing ticked", async ({ page }) => {
    await page.goto("/ph")
    await banner(page).getByRole("button", { name: "Customize" }).click()
    const panel = settingsPanel(page)
    await expect(panel).toBeVisible()
    await expect(panel.getByRole("switch", { name: "Marketing" })).not.toBeChecked()
    await expect(panel.getByRole("switch", { name: "Analytics" })).toHaveCount(0)
    await expect(panel.getByText("Loads when you use it", { exact: true }).last()).toBeVisible()
  })

  test("Cookie settings in the footer reopens the panel", async ({ page }) => {
    await page.goto("/ph")
    await banner(page).getByRole("button", { name: "Accept all" }).click()

    await page.getByTestId("footer-cookie-settings").click()
    const panel = settingsPanel(page)
    await expect(panel).toBeVisible()
    await expect(panel.getByRole("switch", { name: "Marketing" })).toBeChecked()

    await page.keyboard.press("Escape")
    await expect(panel).toBeHidden()
  })

  test("Global Privacy Control keeps the feed off even after Accept all", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "globalPrivacyControl", {
        get: () => true,
      })
    })
    const urls = recordRequests(page)
    await page.goto("/ph")
    await banner(page).getByRole("button", { name: "Accept all" }).click()
    await settle(page)

    expect(requested(urls, THIRD_PARTIES.curator)).toBe(false)
    expect(requested(urls, THIRD_PARTIES.facebook)).toBe(false)
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
    await banner(page).getByRole("button", { name: "Reject non-essential" }).click()

    const cal = page.waitForRequest(THIRD_PARTIES.cal)
    await page.getByRole("link", { name: /Book Service Online/ }).click()
    await cal

    await page.goto("/ph/contact")
    const maps = page.waitForRequest(THIRD_PARTIES.googleMaps)
    await page.getByRole("button", { name: "Open map" }).click()
    await maps
    await expect(page.locator('iframe[title="Sixthgear Store Location"]')).toBeVisible()
  })

  test("the /cookies page lists the registry", async ({ page }) => {
    await page.goto("/ph/cookies")
    await expect(page.getByRole("heading", { name: "Cookie Policy", level: 1 })).toBeVisible()
    await expect(page.getByTestId("cookie-table-necessary")).toContainText("shopify_cart_id")
    await expect(page.getByTestId("cookie-table-onUse")).toContainText("Tidio")
    await expect(page.getByTestId("cookie-table-marketing")).toContainText("Curator")
    await expect(page.getByTestId("cookie-table-analytics")).toHaveCount(0)
  })
})
