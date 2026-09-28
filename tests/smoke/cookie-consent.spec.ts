import { expect, test, type Page } from "@playwright/test"

/**
 * Cookie consent: nothing non-essential loads before a choice, Reject keeps
 * third parties off, Accept loads them, and the choice persists.
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

function banner(page: Page) {
  return page.getByTestId("consent-banner")
}

function settingsPanel(page: Page) {
  return page.getByTestId("consent-settings")
}

test.describe("Cookie consent", () => {
  // The Next.js dev "Issues" badge (dev server only) can sit on top of the
  // banner's first button on phones; production has no such overlay.
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
    await expect(bar.getByRole("button", { name: "Accept all" })).toBeVisible()
    await expect(bar.getByRole("button", { name: "Reject non-essential" })).toBeVisible()
    await expect(bar.getByRole("button", { name: "Customize" })).toBeVisible()
  })

  test("before any choice, no third-party service loads", async ({ page }) => {
    const urls = recordRequests(page)
    await page.goto("/ph")
    await expect(banner(page)).toBeVisible()
    await settle(page)

    for (const [name, pattern] of Object.entries(THIRD_PARTIES)) {
      expect(requested(urls, pattern), `${name} loaded before a choice`).toBe(false)
    }
  })

  test("Reject makes no requests to Tidio, cal.com, Curator, Facebook or Google Maps", async ({ page }) => {
    const urls = recordRequests(page)
    await page.goto("/ph")
    await banner(page).getByRole("button", { name: "Reject non-essential" }).click()
    await expect(banner(page)).toBeHidden()
    await settle(page)

    await page.goto("/ph/contact")
    await settle(page)

    for (const [name, pattern] of Object.entries(THIRD_PARTIES)) {
      expect(requested(urls, pattern), `${name} loaded after Reject`).toBe(false)
    }

    await expect(page.getByTestId("map-placeholder")).toBeVisible()
    await expect(page.getByTestId("chat-launcher")).toBeVisible()
  })

  test("Accept loads Tidio, Curator and Facebook; booking and map load on click", async ({ page }) => {
    await page.goto("/ph")

    const tidio = page.waitForRequest(THIRD_PARTIES.tidio)
    const curator = page.waitForRequest(THIRD_PARTIES.curator)
    const facebook = page.waitForRequest(THIRD_PARTIES.facebook)
    await banner(page).getByRole("button", { name: "Accept all" }).click()
    await Promise.all([tidio, curator, facebook])

    await page.goto("/ph/contact")
    const cal = page.waitForRequest(THIRD_PARTIES.cal)
    await page.getByRole("link", { name: /Book Service Online/ }).click()
    await cal

    await page.keyboard.press("Escape")
    const maps = page.waitForRequest(THIRD_PARTIES.googleMaps)
    await page.getByRole("button", { name: "Open map" }).click()
    await maps
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

  test("Cookie settings in the footer reopens the panel", async ({ page }) => {
    await page.goto("/ph")
    await banner(page).getByRole("button", { name: "Accept all" }).click()

    await page.getByTestId("footer-cookie-settings").click()
    const panel = settingsPanel(page)
    await expect(panel).toBeVisible()
    await expect(page.getByRole("dialog", { name: "Cookie settings" })).toHaveCount(1)
    await expect(panel.getByRole("switch", { name: "Functional" })).toBeChecked()
    await expect(panel.getByRole("switch", { name: "Marketing" })).toBeChecked()

    await page.keyboard.press("Escape")
    await expect(panel).toBeHidden()
  })

  test("Customize starts with nothing ticked and saves a partial choice", async ({ page }) => {
    const urls = recordRequests(page)
    await page.goto("/ph")
    await banner(page).getByRole("button", { name: "Customize" }).click()

    const panel = settingsPanel(page)
    await expect(panel).toBeVisible()
    await expect(panel.getByRole("switch", { name: "Functional" })).not.toBeChecked()
    await expect(panel.getByRole("switch", { name: "Marketing" })).not.toBeChecked()
    await expect(panel.getByRole("switch", { name: "Analytics" })).toHaveCount(0)

    await panel.getByRole("switch", { name: "Functional" }).click()
    const tidio = page.waitForRequest(THIRD_PARTIES.tidio)
    await panel.getByRole("button", { name: "Save choices" }).click()
    await tidio
    await settle(page)

    expect(requested(urls, THIRD_PARTIES.curator)).toBe(false)
    expect(requested(urls, THIRD_PARTIES.facebook)).toBe(false)
  })

  test("Global Privacy Control keeps marketing off even after Accept all", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "globalPrivacyControl", {
        get: () => true,
      })
    })
    const urls = recordRequests(page)
    await page.goto("/ph")
    const tidio = page.waitForRequest(THIRD_PARTIES.tidio)
    await banner(page).getByRole("button", { name: "Accept all" }).click()
    await tidio
    await settle(page)

    expect(requested(urls, THIRD_PARTIES.curator)).toBe(false)
    expect(requested(urls, THIRD_PARTIES.facebook)).toBe(false)
  })
})
