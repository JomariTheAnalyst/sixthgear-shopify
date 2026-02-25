/**
 * Maps a ShopifyCart to a shape compatible with the existing cart drawer
 * which expects HttpTypes.StoreCart-like interface (from Medusa).
 *
 * This is a migration bridge — eventually the drawer should use ShopifyCart directly.
 */

import { ShopifyCart, ShopifyCartLine } from "@lib/shopify/types"

export function mapShopifyCartToStoreCart(shopifyCart: ShopifyCart | null): any {
  if (!shopifyCart) return null

  const lines = shopifyCart.lines?.edges?.map((e) => e.node) || []

  const items = lines.map((line: ShopifyCartLine) => {
    const unitPrice = parseFloat(line.cost.totalAmount.amount) / (line.quantity || 1)

    return {
      id: line.id,
      quantity: line.quantity,
      title: line.merchandise?.product?.title || "Product",
      subtitle: line.merchandise?.title || "",
      product_handle: line.merchandise?.product?.handle || "",
      variant_id: line.merchandise?.id || "",
      unit_price: unitPrice,
      compare_at_unit_price: null,
      subtotal: parseFloat(line.cost.totalAmount.amount),
      total: parseFloat(line.cost.totalAmount.amount),
      thumbnail: line.merchandise?.product?.featuredImage?.url || null,
      created_at: null,
      variant: {
        id: line.merchandise?.id || "",
        title: line.merchandise?.title || "",
        inventory_quantity: 999, // Shopify doesn't expose this in cart
        product: {
          images: line.merchandise?.product?.featuredImage
            ? [line.merchandise.product.featuredImage]
            : [],
        },
        options: line.merchandise?.selectedOptions?.map((opt) => ({
          option: { title: opt.name },
          value: opt.value,
        })) || [],
      },
    }
  })

  return {
    id: shopifyCart.id,
    items,
    currency_code: shopifyCart.cost?.totalAmount?.currencyCode || "PHP",
    subtotal: parseFloat(shopifyCart.cost?.subtotalAmount?.amount || "0"),
    discount_total: 0,
    total: parseFloat(shopifyCart.cost?.totalAmount?.amount || "0"),
    checkoutUrl: shopifyCart.checkoutUrl,
  }
}
