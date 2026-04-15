import type { JudgeMeReviewsResponse } from "@lib/shopify/types"

const JUDGEME_API_BASE = "https://judge.me/api/v1"
const REVIEWS_PER_PAGE = 10

const PRIVATE_TOKEN = process.env.JUDGEME_PRIVATE_TOKEN || ""
const SHOP_DOMAIN = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN || ""

/**
 * Convert a product handle to the internal Judge.me product ID.
 * Returns null on any error â€” never throws.
 */
export async function getJudgeMeProductId(
  handle: string
): Promise<number | null> {
  if (!PRIVATE_TOKEN || !SHOP_DOMAIN) return null

  try {
    const url = new URL(`${JUDGEME_API_BASE}/products/-1`)
    url.searchParams.set("shop_domain", SHOP_DOMAIN)
    url.searchParams.set("api_token", PRIVATE_TOKEN)
    url.searchParams.set("handle", handle)

    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 }, // cache product ID for 1 hour
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data?.product?.id ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Fetch published reviews for a product from Judge.me.
 * Returns null on any error â€” never throws.
 */
export async function getProductReviews(
  handle: string,
  page: number = 1
): Promise<JudgeMeReviewsResponse | null> {
  if (!PRIVATE_TOKEN || !SHOP_DOMAIN) return null

  try {
    const productId = await getJudgeMeProductId(handle)
    if (!productId) return null

    const url = new URL(`${JUDGEME_API_BASE}/reviews`)
    url.searchParams.set("api_token", PRIVATE_TOKEN)
    url.searchParams.set("shop_domain", SHOP_DOMAIN)
    url.searchParams.set("product_id", productId.toString())
    url.searchParams.set("page", page.toString())
    url.searchParams.set("per_page", REVIEWS_PER_PAGE.toString())

    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 }, // cache reviews for 5 minutes
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data as JudgeMeReviewsResponse
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Parse aggregate rating from Shopify metafields (already fetched with product query).
 * Synchronous â€” no API calls.
 */
export function parseRatingSummaryFromMetafields(
  metafields: Array<{ namespace: string; key: string; value: string; type?: string } | null> | undefined
): { average: number; count: number } | null {
  if (!metafields || !Array.isArray(metafields)) return null

  try {
    const ratingMetafield = metafields.find(
      (mf) => mf && mf.namespace === "reviews" && mf.key === "rating"
    )
    const countMetafield = metafields.find(
      (mf) => mf && mf.namespace === "reviews" && mf.key === "rating_count"
    )

    if (!ratingMetafield || !countMetafield) return null

    // rating value is a JSON string: '{"value":"4.3","scale_min":"1.0","scale_max":"5.0"}'
    const parsed = JSON.parse(ratingMetafield.value)
    const average = parseFloat(parsed.value)

    // count value is a plain number string: "47"
    const count = parseInt(countMetafield.value, 10)

    if (isNaN(average) || isNaN(count)) return null

    return { average, count }
  } catch {
    return null
  }
}

/**
 * Build the URL for Judge.me's hosted review submission form.
 */
export function buildWriteReviewUrl(productHandle: string): string {
  const shopDomain = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN!
  return `https://judge.me/reviews/new?shop_domain=${shopDomain}&handle=${productHandle}`
}
