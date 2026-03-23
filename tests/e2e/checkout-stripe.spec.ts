import { test, expect } from "@playwright/test"
import {
  addProductToCart,
  goToCheckout,
  fillShippingAddress,
  selectShippingMethod,
  completeStripePayment,
  verifyOrderConfirmation,
  clearCart,
} from "../helpers/checkout-helpers"

/**
 * E2E Test: Checkout with Stripe Payment
 *
 * Tests the complete checkout flow using Stripe payment:
 * 1. Add product to cart
 * 2. Go to checkout
 * 3. Fill shipping address
 * 4. Select shipping method
 * 5. Pay with Stripe
 * 6. Verify order confirmation
 */

test.describe("Checkout with Stripe Payment", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cart before each test
    await clearCart(page)
  })

  test("should complete checkout with Stripe payment successfully", async ({
    page,
  }) => {
    // Step 1: Add product to cart
    await addProductToCart(page, "Medusa T-Shirt")

    // Take screenshot after adding to cart
    await page.screenshot({
      path: "test-results/screenshots/01-product-added.png",
      fullPage: true,
    })

    // Step 2: Go to checkout
    await goToCheckout(page)

    // Verify we're on checkout page
    await expect(page).toHaveURL(/\/checkout/)
    await page.screenshot({
      path: "test-results/screenshots/02-checkout-page.png",
      fullPage: true,
    })

    // Step 3: Fill shipping address
    await fillShippingAddress(page)

    await page.screenshot({
      path: "test-results/screenshots/03-shipping-filled.png",
      fullPage: true,
    })

    // Step 4: Select shipping method
    await selectShippingMethod(page)

    await page.screenshot({
      path: "test-results/screenshots/04-shipping-selected.png",
      fullPage: true,
    })

    // Step 5: Complete Stripe payment
    await completeStripePayment(page)

    // Step 6: Verify order confirmation
    await verifyOrderConfirmation(page)

    // Take final screenshot
    await page.screenshot({
      path: "test-results/screenshots/05-order-confirmed.png",
      fullPage: true,
    })

    // Additional assertions
    await expect(
      page.locator("text=Payment Confirmed").or(page.locator("text=Paid"))
    ).toBeVisible({ timeout: 5000 })

  })

  test("should display correct payment status for Stripe", async ({ page }) => {
    // Complete checkout
    await addProductToCart(page)
    await goToCheckout(page)
    await fillShippingAddress(page)
    await selectShippingMethod(page)
    await completeStripePayment(page)

    // Verify payment status shows as paid
    await expect(
      page.locator("text=Payment Confirmed").or(page.locator("text=Paid"))
    ).toBeVisible()

    // Verify NO COD warning is shown
    await expect(
      page.locator("text=Please prepare exact amount")
    ).not.toBeVisible()
  })

  test("should show order summary on confirmation page", async ({ page }) => {
    // Complete checkout
    await addProductToCart(page)
    await goToCheckout(page)
    await fillShippingAddress(page)
    await selectShippingMethod(page)
    await completeStripePayment(page)

    // Verify order summary elements
    await expect(
      page.locator("text=Order Summary").or(page.locator("text=Order Items"))
    ).toBeVisible()
    await expect(page.locator("text=Medusa T-Shirt")).toBeVisible()
    await expect(page.locator("text=Subtotal")).toBeVisible()
    await expect(page.locator("text=Shipping")).toBeVisible()
    await expect(page.locator("text=Total")).toBeVisible()
  })
})
