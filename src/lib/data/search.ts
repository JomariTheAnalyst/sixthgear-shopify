"use server"

import {
  getPredictiveSearch as shopifyGetPredictiveSearch,
  getProducts,
  searchProducts as shopifySearchProducts,
} from "@lib/shopify"
import { cacheKey, getCached, TTL } from "@lib/cache/redis"
import { ShopifyPredictiveSearchResult, ShopifyProductCard, ShopifyPageInfo } from "@lib/shopify/types"

export async function getPredictiveSearch(
  query: string
): Promise<ShopifyPredictiveSearchResult> {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) {
    return { products: [], collections: [], pages: [] }
  }

  const key = cacheKey("search", "predictive", normalizedQuery)
  return getCached(
    key,
    async () => shopifyGetPredictiveSearch(normalizedQuery),
    TTL.SEARCH
  )
}

export async function getHotDeals(): Promise<ShopifyProductCard[]> {
  const key = cacheKey("search", "hot-deals")
  return getCached(
    key,
    async () => {
      const { products } = await getProducts({
        first: 12,
        query: "tag:hot-deals",
      })
      return products
    },
    TTL.HOMEPAGE
  )
}

export async function searchProducts(
  query: string,
  options?: {
    first?: number
    after?: string
    last?: number
    before?: string
    sortKey?: string
  }
): Promise<{ products: ShopifyProductCard[]; pageInfo: ShopifyPageInfo; totalCount: number }> {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) {
    return {
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: null,
        startCursor: null,
      },
      totalCount: 0,
    }
  }

  const key = cacheKey(
    "search",
    "products",
    normalizedQuery,
    String(options?.first ?? "null"),
    options?.after ?? "null",
    String(options?.last ?? "null"),
    options?.before ?? "null",
    options?.sortKey ?? "default"
  )

  return getCached(
    key,
    async () => shopifySearchProducts(normalizedQuery, options),
    TTL.SEARCH
  )
}
