import { expect, test, type Page } from "@playwright/test"

const targetRouteMetadata = [
  { path: "/ph", title: "SixthGearMoto", canonicalPath: "/ph" },
  { path: "/ph/store", title: "Shop", canonicalPath: "/ph/store" },
  {
    path: "/ph/services",
    title: "Services",
    canonicalPath: "/ph/services",
  },
  {
    path: "/ph/collections/helmet",
    title: "Helmets",
    canonicalPath: "/ph/collections/helmet",
  },
  {
    path: "/ph/first-gear",
    title: "First Gear Coffee",
    canonicalPath: "/ph/first-gear",
  },
  {
    path: "/ph/contact",
    title: "Contact Us",
    canonicalPath: "/ph/contact",
  },
  { path: "/ph/about", title: "About Us", canonicalPath: "/ph/about" },
  {
    path: "/ph/rider-stories",
    title: "Rider Stories",
    canonicalPath: "/ph/rider-stories",
  },
]

function getTagAttribute(
  html: string,
  tagName: "link" | "meta",
  identifyingAttribute: string,
  identifyingValue: string,
  requestedAttribute: string
) {
  const tag = html.match(
    new RegExp(
      `<${tagName}(?=[^>]*${identifyingAttribute}=["']${identifyingValue}["'])[^>]*>`,
      "i"
    )
  )?.[0]

  return tag?.match(
    new RegExp(`${requestedAttribute}=["']([^"']*)["']`, "i")
  )?.[1]
}

function captureBrowserErrors(page: Page) {
  const errors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text())
    }
  })
  page.on("pageerror", (error) => {
    errors.push(error.message)
  })
  return errors
}

test.describe("SEO and sitelink readiness", () => {
  test("all approved routes render exact clean metadata", async ({ request }) => {
    for (const route of targetRouteMetadata) {
      const response = await request.get(route.path)
      const html = await response.text()

      expect(response.ok(), route.path).toBe(true)
      expect(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]).toBe(route.title)
      expect(
        getTagAttribute(html, "link", "rel", "canonical", "href"),
        `${route.path} canonical`
      ).toBe(`https://www.sixthgearmoto.com${route.canonicalPath}`)
      expect(
        getTagAttribute(html, "meta", "property", "og:title", "content"),
        `${route.path} og:title`
      ).toBe(route.title)
      expect(html).not.toContain(`${route.title} | SixthGearMoto`)
    }
  })

  test("homepage exposes consistent SEO and crawlable links", async ({ page }) => {
    const browserErrors = captureBrowserErrors(page)
    await page.goto("/ph")

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.sixthgearmoto.com/ph"
    )
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://www.sixthgearmoto.com/ph"
    )
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator("h1")).toHaveText("SIXTHGEAR MOTO")
    await expect(page.locator('a[href^="/ph/ph/"]')).toHaveCount(0)
    await expect(page.locator('a[href="/ph/collections/helmets"]')).toHaveCount(
      0
    )
    await expect(
      page.locator('a[href="/ph/store?tag=new-arrival"]')
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "View All Rider Stories" })
    ).toHaveAttribute("href", "/ph/rider-stories")

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    expect(jsonLd.length).toBeGreaterThan(0)
    expect(jsonLd.join("\n")).toContain("https://www.sixthgearmoto.com")
    const websiteSchema = jsonLd
      .map((value) => JSON.parse(value))
      .find((value) => value["@type"] === "WebSite")
    expect(websiteSchema).toMatchObject({
      name: "SixthGearMoto",
      alternateName: "Sixth Gear Moto",
    })

    for (const [label, href] of [
      ["Shop", "/ph/store"],
      ["Services", "/ph/services"],
      ["Helmets", "/ph/collections/helmet"],
      ["First Gear Coffee", "/ph/first-gear"],
      ["Contact Us", "/ph/contact"],
    ]) {
      expect(
        await page.locator(`a[href="${href}"]`, { hasText: label }).count(),
        `${label} crawlable link`
      ).toBeGreaterThan(0)
    }
    expect(browserErrors).toEqual([])
  })

  test("robots and sitemap expose only the preferred production host", async ({
    request,
  }) => {
    const robotsResponse = await request.get("/robots.txt")
    const robots = await robotsResponse.text()
    expect(robotsResponse.ok()).toBe(true)
    expect(robots).toContain(
      "Sitemap: https://www.sixthgearmoto.com/sitemap.xml"
    )

    const sitemapResponse = await request.get("/sitemap.xml")
    const sitemap = await sitemapResponse.text()
    expect(sitemapResponse.ok()).toBe(true)
    expect(sitemap).toContain("<loc>https://www.sixthgearmoto.com/")
    expect(sitemap).not.toContain("<loc>https://sixthgearmoto.com/")
  })

  test("plural Helmets URL redirects permanently to the singular handle", async ({
    request,
  }) => {
    const response = await request.get("/ph/collections/helmets", {
      maxRedirects: 0,
    })

    expect(response.status()).toBe(308)
    expect(response.headers().location).toBe("/ph/collections/helmet")
  })

  test("corrected internal destinations return valid pages", async ({
    request,
  }) => {
    const paths = [
      "/ph/collections/helmet",
      "/ph/store?tag=featured",
      "/ph/store?tag=best-seller",
      "/ph/store?tag=new-arrival",
      "/ph/store?tag=hot-deals",
      "/ph/rider-stories",
      "/ph/contact",
    ]

    for (const path of paths) {
      const response = await request.get(path)
      expect(response.status(), path).toBeLessThan(400)
    }
  })

  test("all six regular workshop services keep booking", async ({ page }) => {
    const browserErrors = captureBrowserErrors(page)
    const bookableSlugs = [
      "preventive-maintenance",
      "repairs-diagnostics",
      "accessories-installation",
      "wheels-drivetrain",
      "detailing-protection",
      "performance-upgrades",
    ]

    for (const slug of bookableSlugs) {
      await page.goto(`/ph/services/${slug}`)
      const hero = page.getByTestId("service-detail-hero")

      await expect(
        hero.getByRole("link", { name: "Book This Service" })
      ).toHaveAttribute(
        "href",
        "https://cal.com/sixthgear-moto-supply-wvfnxi/pms"
      )
      await expect(
        hero.getByRole("link", { name: "Contact Us", exact: true })
      ).toHaveCount(0)
    }
    expect(browserErrors).toEqual([])
  })

  for (const slug of ["roadside-assistance", "rider-support"]) {
    test(`${slug} remains Contact-only`, async ({ page }) => {
      const browserErrors = captureBrowserErrors(page)
      await page.goto(`/ph/services/${slug}`)
      const hero = page.getByTestId("service-detail-hero")

      await expect(
        hero.getByRole("link", { name: "Contact Us", exact: true })
      ).toHaveAttribute("href", "/ph/contact")
      await expect(
        hero.getByRole("link", { name: "Book This Service" })
      ).toHaveCount(0)
      expect(browserErrors).toEqual([])
    })
  }
})
