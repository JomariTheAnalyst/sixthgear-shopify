import { test, expect } from "@playwright/test"
import { ROUTES } from "../helpers/navigation"

test.describe("Smoke — Navbar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home)
  })

  test("Header / navbar is visible", async ({ page }) => {
    const header = page.locator("header, nav, [role='banner']").first()
    await expect(header).toBeVisible()
  })

  test("Logo is visible and links to home", async ({ page }) => {
    const logoLink = page
      .locator("header a:visible, nav a:visible, [role='banner'] a:visible")

      .filter({ hasText: /sixthgear|sixth gear|logo/i })
      .first()

    await expect(logoLink).toBeVisible()

    const href = await logoLink.getAttribute("href")
    expect(href).toMatch(/^\/$|\/ph\/?$/)
  })

  test("Cart icon is visible", async ({ page }) => {
    const cartButton = page
      .locator(
        '[aria-label*="cart" i], [data-testid*="cart"], a[href*="/cart"], button:has(svg)'
      )
      .first()
    await expect(cartButton).toBeVisible()
  })

  test("Mobile menu opens on mobile viewport", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only test")

    // The hamburger button uses aria-label="Open menu" and is hidden on md+
    const menuButton = page.locator('button[aria-label="Open menu"]')
    await expect(menuButton).toBeVisible({ timeout: 5000 })
    
    // Give time for React hydration, otherwise the click event is swallowed
    await page.waitForTimeout(1000)
    await menuButton.click()

    // The mobile menu opens a HeadlessUI drawer.
    // The safest visible element to check is the close button.
    const closeButton = page.locator('button[aria-label="Close menu"]')
    await expect(closeButton).toBeVisible({ timeout: 5000 })
  })
})
