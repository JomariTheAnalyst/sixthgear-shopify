import type { ShopifyMetafield } from "./types"

export function resolveWhatsInBox(
  shopifyMetafields: ShopifyMetafield[] | null | undefined
): string | null {
  const metafields = Array.isArray(shopifyMetafields) ? shopifyMetafields : []

  const whatsInBox = metafields.find(
    (field) =>
      field.namespace === "custom" &&
      field.key === "what_is_in_the_box" &&
      typeof field.value === "string" &&
      field.value.trim().length > 0
  )

  return whatsInBox?.value?.trim() || null
}
