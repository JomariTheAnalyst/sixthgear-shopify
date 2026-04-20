const excludedPaths = ["/checkout", "/account/*"]
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  process.env.VERCEL_URL

const siteUrl = rawSiteUrl
  ? /^https?:\/\//i.test(rawSiteUrl)
    ? rawSiteUrl.replace(/\/+$/, "")
    : `https://${rawSiteUrl.replace(/\/+$/, "")}`
  : "http://localhost:7000"

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: excludedPaths.concat(["/[sitemap]"]),
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths,
      },
    ],
  },
}
