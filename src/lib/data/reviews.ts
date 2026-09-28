import { cacheKey, getCached } from "@lib/cache/redis"
import type { JudgeMeReview, JudgeMeReviewsResponse } from "@lib/shopify/types"

const JUDGEME_API_BASE = "https://judge.me/api/v1"
const REVIEWS_PER_PAGE = 10
const REVIEWS_CACHE_TTL = 300 // 5 minutes, as before

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
 * Keeps only what the product page shows. Judge.me also sends the reviewer's
 * email, phone and IP address; those never leave this function.
 */
function toPublicReviews(data: any): JudgeMeReviewsResponse {
  const reviews: JudgeMeReview[] = (Array.isArray(data?.reviews) ? data.reviews : []).map(
    (review: any) => ({
      id: review.id,
      title: review.title ?? "",
      body: review.body ?? "",
      rating: review.rating,
      reviewer: { name: review.reviewer?.name ?? "" },
      published: review.published === true,
      hidden: review.hidden === true,
      verified: review.verified ?? "",
      created_at: review.created_at,
      picture_urls: Array.isArray(review.picture_urls) ? review.picture_urls : [],
    })
  )

  return {
    reviews,
    current_page: data?.current_page ?? 1,
    total_pages: data?.total_pages ?? 1,
    per_page: data?.per_page ?? REVIEWS_PER_PAGE,
    total_count: data?.total_count ?? reviews.length,
  }
}

/**
 * Fetch published reviews for a product from Judge.me.
 * Returns null on any error — never throws. The raw response is not cached
 * (it contains reviewer contact data); only the trimmed result is, for 5 min.
 */
export async function getProductReviews(
  handle: string,
  page: number = 1
): Promise<JudgeMeReviewsResponse | null> {
  if (!PRIVATE_TOKEN || !SHOP_DOMAIN) return null

  try {
    const productId = await getJudgeMeProductId(handle)
    if (!productId) return null

    return await getCached(
      cacheKey("reviews", String(productId), String(page)),
      async () => {
        const url = new URL(`${JUDGEME_API_BASE}/reviews`)
        url.searchParams.set("api_token", PRIVATE_TOKEN)
        url.searchParams.set("shop_domain", SHOP_DOMAIN)
        url.searchParams.set("product_id", productId.toString())
        url.searchParams.set("page", page.toString())
        url.searchParams.set("per_page", REVIEWS_PER_PAGE.toString())

        const res = await fetch(url.toString(), {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error(`[reviews] Judge.me responded ${res.status}`)
        }

        return toPublicReviews(await res.json())
      },
      REVIEWS_CACHE_TTL
    )
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
