import { HttpTypes } from "@medusajs/types"

import { mapShopifyToStoreProduct } from "@lib/shopify/map-to-store-product"
import { getRuleBasedRecommendations, type RecommendationSeed } from "@lib/shopify/recommendations"
import type { ShopifyProductCard } from "@lib/shopify/types"

import YouMayLikeClient from "./client"

type YouMayLikeProps = {
  currentProduct: RecommendationSeed
  countryCode: string
  region: HttpTypes.StoreRegion
}

export default async function YouMayLike({
  currentProduct,
  countryCode: _countryCode,
  region,
}: YouMayLikeProps) {
  let matchedProducts: ShopifyProductCard[] = []
  let fallbackProducts: ShopifyProductCard[] = []

  try {
    const recommendations = await getRuleBasedRecommendations(currentProduct)
    matchedProducts = recommendations.matched
    fallbackProducts = recommendations.fallback
  } catch (error) {
    console.error(error)
  }

  const mappedRecommendations = matchedProducts.map(mapShopifyToStoreProduct)
  const mappedFallbackProducts = fallbackProducts.map(mapShopifyToStoreProduct)

  return (
    <YouMayLikeClient
      recommendedProducts={mappedRecommendations}
      fallbackProducts={mappedFallbackProducts}
      currentProductHandle={currentProduct.handle}
      region={region}
    />
  )
}
