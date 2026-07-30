import { expect, test } from "@playwright/test"

const serviceSlugs = [
  "preventive-maintenance",
  "repairs-diagnostics",
  "accessories-installation",
  "wheels-drivetrain",
  "detailing-protection",
  "performance-upgrades",
  "roadside-assistance",
  "rider-support",
]

test("generated sitemap is valid, unique, localized, and safely encoded", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml")
  const sitemap = await response.text()

  expect(response.ok()).toBe(true)
  expect(response.headers()["content-type"]).toContain("application/xml")
  expect(sitemap).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(sitemap).toContain(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  )
  expect(sitemap).toMatch(/<\/urlset>\s*$/)

  const locations = Array.from(
    sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
    (match) => match[1]
  )
  const openingUrlTags = sitemap.match(/<url>/g) ?? []
  const closingUrlTags = sitemap.match(/<\/url>/g) ?? []

  expect(locations.length).toBeGreaterThan(0)
  expect(openingUrlTags).toHaveLength(locations.length)
  expect(closingUrlTags).toHaveLength(locations.length)
  expect(new Set(locations).size).toBe(locations.length)

  for (const location of locations) {
    const url = new URL(location)
    expect(url.origin).toBe("https://www.sixthgearmoto.com")
    expect(url.search).toBe("")
    expect(url.pathname).not.toMatch(/\/ph\/ph(?:\/|$)/)
    expect(url.pathname).not.toMatch(/\/PH(?:\/|$)/)
    expect(url.pathname).not.toMatch(/\/collections\/helmets(?:\/|$)/)
    expect(location).not.toMatch(/[^\x00-\x7F]/)
  }

  for (const path of [
    "/ph",
    "/ph/store",
    "/ph/about",
    "/ph/services",
    "/ph/contact",
    "/ph/rider-stories",
    "/ph/first-gear",
    "/ph/collections/helmet",
  ]) {
    expect(locations).toContain(`https://www.sixthgearmoto.com${path}`)
  }

  for (const slug of serviceSlugs) {
    expect(locations).toContain(
      `https://www.sixthgearmoto.com/ph/services/${slug}`
    )
  }

  expect(sitemap).toContain("%E2%84%A2")
  expect(sitemap).not.toContain("™")
  expect(sitemap).not.toContain("%25E2%2584%25A2")
})
