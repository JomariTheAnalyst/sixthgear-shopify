import type { MetadataRoute } from "next"

import { getBaseURL } from "@lib/util/env"

const disallowedPaths = [
  "/api/",
  "/studio/",
  "/ph/account/",
  "/ph/cart/",
  "/ph/checkout/",
  "/ph/maintenance/",
  "/ph/preview/",
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseURL()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "adsbot-google",
        disallow: ["/cart", "/ph/account"],
      },
      {
        userAgent: "AhrefsBot",
        crawlDelay: 10,
      },
      {
        userAgent: "AhrefsSiteAudit",
        crawlDelay: 10,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
