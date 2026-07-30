/**
 * Best Sellers Section
 * Fetches products tagged with "Best Seller"
 */

import { HttpTypes } from "@medusajs/types"
import { getProductsByTagValue } from "@lib/data/tags"
import ProductSection from "../product-section"

interface BestSellersSectionProps {
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function BestSellersSection({
  region,
  countryCode: _countryCode,
}: BestSellersSectionProps) {
  const products = await getProductsByTagValue("Best Seller", 4, region.id)

  if (!products || products.length === 0) {
    return null
  }

  return (
    <ProductSection
      title="Best Sellers"
      badges={["rank"]}
      products={products}
      region={region}
      viewAllLink="/store?tag=best-seller"
      maxItems={4}
    />
  )
}
