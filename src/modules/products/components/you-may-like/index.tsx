import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/home/components/product-sections/product-card"
import { getProductRecommendations, getProducts } from "@lib/shopify"

type YouMayLikeProps = {
  productId: string
  countryCode: string
  region: HttpTypes.StoreRegion
}

// Maps Shopify Product Card to the Medusa Shape expected by ProductCard component
function mapShopifyToMedusa(p: any) {
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.featuredImage?.url,
    images: p.featuredImage ? [{ url: p.featuredImage.url }] : [],
    collection: { title: p.vendor },
    tags: p.tags?.map((t: string) => ({ value: t })) || [],
    options: p.options?.map((opt: any) => ({
      id: opt.id,
      title: opt.name,
      values: opt.values?.map((v: string) => ({ id: v, value: v })) || []
    })) || [],
    variants: [
      {
        id: p.id,
        allow_backorder: false,
        manage_inventory: true,
        inventory_quantity: p.availableForSale ? 10 : 0,
        calculated_price: {
          calculated_amount: p.priceRange?.minVariantPrice ? parseFloat(p.priceRange.minVariantPrice.amount) : null,
          original_amount: p.compareAtPriceRange?.minVariantPrice ? parseFloat(p.compareAtPriceRange.minVariantPrice.amount) : null,
          currency_code: p.priceRange?.minVariantPrice?.currencyCode || "php"
        }
      }
    ]
  } as any;
}

export default async function YouMayLike({
  productId,
  countryCode,
  region,
}: YouMayLikeProps) {

  let shopifyProducts: any[] = []

  try {
    // 1. Try Shopify's AI recommendations
    shopifyProducts = await getProductRecommendations(productId)
    
    // 2. Fallback: If no recommendations generated yet by Shopify AI, fetch recent products
    if (!shopifyProducts || shopifyProducts.length === 0) {
      const fallback = await getProducts({ first: 4 })
      
      // Filter out the current product from the fallback list just in case
      shopifyProducts = fallback.products.filter(p => p.id !== productId).slice(0, 3) 
    } else {
      // Just keep top 3
      shopifyProducts = shopifyProducts.slice(0, 3)
    }

  } catch (error) {
    console.error(`[YouMayLike Component] Error fetching recommendations/fallback:`, error)
  }

  if (!shopifyProducts || shopifyProducts.length === 0) {
    return (
      <div className="w-full">
        <h2
          className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-8"
          style={{ fontFamily: "BRHendrix, sans-serif" }}
        >
          You May Like
        </h2>
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            No related products found at the moment.
          </p>
        </div>
      </div>
    )
  }

  // Map to the Medusa format expected by ProductCard
  const mappedProducts = shopifyProducts.map(mapShopifyToMedusa)

  // Provide an empty/default inventory map since Shopify variant inventory is stubbed at availableForSale
  const inventoryMap: Record<string, number> = {}

  return (
    <div className="w-full">
      {/* Section Header */}
      <h2
        className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-8"
        style={{ fontFamily: "BRHendrix, sans-serif" }}
      >
        You May Like
      </h2>

      {/* Product Grid - Wider cards (3 columns on desktop instead of 6) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-8">
        {mappedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            region={region}
            inventoryMap={inventoryMap}
          />
        ))}
      </div>
    </div>
  )
}