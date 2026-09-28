import { HttpTypes } from "@medusajs/types"

import type { ShopifyProductCard } from "@lib/shopify/types"

/**
 * Maps a Shopify product card onto the StoreProduct shape ProductCard and
 * QuickShopModal expect. Keeps real variant IDs (required by cartLinesAdd),
 * product options, and each variant's selected options so option-based
 * variant matching works.
 */
export function mapShopifyToStoreProduct(
  product: ShopifyProductCard
): HttpTypes.StoreProduct {
  const images =
    product.images?.edges?.map((edge) => ({ url: edge.node.url })) || []

  if (images.length === 0 && product.featuredImage) {
    images.push({ url: product.featuredImage.url })
  }

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.featuredImage?.url || images[0]?.url,
    images,
    collection: { title: product.vendor },
    tags: product.tags?.map((tag) => ({ value: tag })) || [],
    options:
      product.options?.map((option) => ({
        id: option.id,
        title: option.name,
        values:
          option.values?.map((value) => ({ id: value, value })) || [],
      })) || [],
    variants:
      product.variants?.edges?.map((edge) => {
        const node = edge.node

        return {
          id: node.id,
          title: node.title,
          image: node.image ?? null,
          options:
            node.selectedOptions?.map((selected) => ({
              value: selected.value,
              option: { title: selected.name },
            })) || [],
          allow_backorder: false,
          manage_inventory: true,
          inventory_quantity: node.availableForSale ? 10 : 0,
          calculated_price: {
            calculated_amount: node.price
              ? parseFloat(node.price.amount)
              : null,
            original_amount: node.compareAtPrice
              ? parseFloat(node.compareAtPrice.amount)
              : null,
            currency_code: node.price?.currencyCode || "php",
          },
        }
      }) || [
        {
          id: product.id,
          allow_backorder: false,
          manage_inventory: true,
          inventory_quantity: product.availableForSale ? 10 : 0,
          calculated_price: {
            calculated_amount: product.priceRange?.minVariantPrice
              ? parseFloat(product.priceRange.minVariantPrice.amount)
              : null,
            original_amount: product.compareAtPriceRange?.minVariantPrice
              ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
              : null,
            currency_code:
              product.priceRange?.minVariantPrice?.currencyCode || "php",
          },
        },
      ],
  } as any
}
