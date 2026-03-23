import { test, expect } from "@playwright/test"
import { ROUTES } from "../helpers/navigation"

test.describe("Smoke — Product flow", () => {
  test("Store page shows product links", async ({ page }) => {
    await page.goto(ROUTES.store)

    const productLink = page.locator('a[href*="/products/"]').first()
    await expect(productLink).toBeVisible({ timeout: 15_000 })
  })

  test("Clicking first product opens product page", async ({ page }) => {
    await page.goto(ROUTES.store)

    const productLink = page.locator('a[href*="/products/"]').first()
    await expect(productLink).toBeVisible({ timeout: 15_000 })
    await productLink.click()

    await page.waitForURL(/\/products\//, { timeout: 15_000 })
    await expect(page.locator("body")).toBeVisible()
  })

  test("Product page shows add-to-cart (add-to-bag) button", async ({ page, isMobile }) => {
    await page.goto(ROUTES.store)

    const productLink = page.locator('a[href*="/products/"]').first()
    await expect(productLink).toBeVisible({ timeout: 15_000 })
    await productLink.click()
    await page.waitForURL(/\/products\//, { timeout: 15_000 })

    // Look for add-to-bag/cart buttons using data-testids or flexible text
    const addToCart = page
      .locator(
        'button:has-text("Add to Bag"), button:has-text("Add to Cart"), [data-testid="add-product-button"], [data-testid="mobile-cart-button"]'
      )
      .first()

    await expect(addToCart).toBeVisible({ timeout: 15_000 })
  })
})
