import { test, expect } from "@playwright/test"
import { ROUTES } from "../helpers/navigation"
import { expectPageLoaded } from "../helpers/assertions"

test.describe("Smoke — Page loads", () => {
  test("Homepage loads", async ({ page }) => {
    await page.goto(ROUTES.home)
    await expectPageLoaded(page)
    await expect(page).toHaveTitle(/.+/)
  })

  test("Store page loads", async ({ page }) => {
    await page.goto(ROUTES.store)
    await expectPageLoaded(page)
  })

  test("Search with query loads", async ({ page }) => {
    await page.goto(`${ROUTES.store}?q=helmet`)
    await expectPageLoaded(page)
  })

  test("Login / Account page loads", async ({ page }) => {
    await page.goto(ROUTES.login)
    await expectPageLoaded(page)
  })

  test("About page loads", async ({ page }) => {
    await page.goto(ROUTES.about)
    await expectPageLoaded(page)
  })

  test("Services page loads", async ({ page }) => {
    await page.goto(ROUTES.services)
    await expectPageLoaded(page)
  })

  test("Contact page loads", async ({ page }) => {
    await page.goto(ROUTES.contact)
    await expectPageLoaded(page)
  })

  test("First Gear Coffee page loads", async ({ page }) => {
    await page.goto(ROUTES.firstGear)
    await expectPageLoaded(page)
  })

  test("Unknown route shows 404", async ({ page }) => {
    const response = await page.goto(ROUTES.notFound)
    // Either 404 status or a visible 404 indicator on the page
    const is404Status = response?.status() === 404
    const has404Content = await page
      .locator("text=/404|not found|page not found/i")
      .first()
      .isVisible()
      .catch(() => false)

    expect(is404Status || has404Content).toBeTruthy()
  })
})
