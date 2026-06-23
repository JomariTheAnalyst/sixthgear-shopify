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
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: disallowedPaths,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
