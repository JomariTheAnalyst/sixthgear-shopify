import { getProducts } from "./index"
import type { ShopifyProductCard } from "./types"

export type RecommendationSeed = {
  productId: string
  handle: string
  vendor: string
  productType: string
  tags: string[]
}

type ScoredRecommendation = {
  product: ShopifyProductCard
  score: number
  vendorMatch: boolean
  productTypeMatch: boolean
  tagOverlapCount: number
}

function quoteSearchValue(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase()
}

function scoreProduct(
  currentProduct: RecommendationSeed,
  candidate: ShopifyProductCard
): ScoredRecommendation | null {
  if (!candidate?.id || candidate.id === currentProduct.productId) {
    return null
  }

  if (!candidate.handle || candidate.handle === currentProduct.handle) {
    return null
  }

  const currentVendor = currentProduct.vendor.trim().toLowerCase()
  const currentProductType = currentProduct.productType.trim().toLowerCase()
  const currentTags = new Set(currentProduct.tags.map(normalizeTag))
  const candidateTags = Array.isArray(candidate.tags)
    ? candidate.tags.map(normalizeTag)
    : []

  const vendorMatch =
    Boolean(currentVendor) &&
    candidate.vendor?.trim().toLowerCase() === currentVendor
  const productTypeMatch =
    Boolean(currentProductType) &&
    candidate.productType?.trim().toLowerCase() === currentProductType
  const tagOverlapCount = candidateTags.filter((tag) => currentTags.has(tag)).length

  const score =
    (vendorMatch ? 1000 : 0) +
    (productTypeMatch ? 100 : 0) +
    tagOverlapCount * 10

  if (score === 0) {
    return null
  }

  return {
    product: candidate,
    score,
    vendorMatch,
    productTypeMatch,
    tagOverlapCount,
  }
}

function dedupeProducts(products: ShopifyProductCard[]): ShopifyProductCard[] {
  const seen = new Set<string>()

  return products.filter((product) => {
    const key = product.id || product.handle

    if (!key || seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

export async function getRuleBasedRecommendations(
  currentProduct: RecommendationSeed
): Promise<{
  matched: ShopifyProductCard[]
  fallback: ShopifyProductCard[]
}> {
  const requests: Promise<{ products: ShopifyProductCard[] }>[] = []

  if (currentProduct.vendor.trim()) {
    requests.push(
      getProducts({
        first: 24,
        query: `vendor:${quoteSearchValue(currentProduct.vendor.trim())}`,
      })
    )
  }

  if (currentProduct.productType.trim()) {
    requests.push(
      getProducts({
        first: 24,
        query: `product_type:${quoteSearchValue(
          currentProduct.productType.trim()
        )}`,
      })
    )
  }

  requests.push(
    getProducts({
      first: 24,
      sortKey: "CREATED_AT",
      reverse: true,
    })
  )

  const responses = await Promise.all(requests)
  const candidatePool = dedupeProducts(
    responses.flatMap((response) => response.products || [])
  )

  const scored = candidatePool
    .map((product) => scoreProduct(currentProduct, product))
    .filter((item): item is ScoredRecommendation => item !== null)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }

      if (b.tagOverlapCount !== a.tagOverlapCount) {
        return b.tagOverlapCount - a.tagOverlapCount
      }

      return a.product.title.localeCompare(b.product.title)
    })

  const matched = dedupeProducts(scored.map((item) => item.product))
  const matchedIds = new Set(matched.map((product) => product.id))

  const fallback = candidatePool.filter((product) => {
    return (
      product.id !== currentProduct.productId &&
      product.handle !== currentProduct.handle &&
      !matchedIds.has(product.id)
    )
  })

  return { matched, fallback }
}
