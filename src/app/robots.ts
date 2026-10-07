import type { MetadataRoute } from "next"

import { getBaseURL } from "@lib/util/env"

// No trailing slashes: robots rules are prefix matches, so "/cart" covers
// /cart and /cart/*. Utility pages (login, wishlist, track-order) stay
// crawlable so Google can see their noindex.
const disallowedPaths = [
  "/api/",
  "/studio",
  "/account",
  "/cart",
  "/checkout",
  "/payment-status",
  "/order/",
  "/orders/",
  "/maintenance",
  "/preview",
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
        disallow: ["/cart", "/checkout", "/account"],
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
