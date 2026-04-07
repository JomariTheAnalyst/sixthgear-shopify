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

export function resolveSpecifications(
  shopifyMetafields: ShopifyMetafield[] | null | undefined
): string | null {
  const metafields = Array.isArray(shopifyMetafields) ? shopifyMetafields : []

  const spec = metafields.find(
    (field) =>
      field.namespace === "custom" &&
      field.key === "specifications" &&
      typeof field.value === "string" &&
      field.value.trim().length > 0
  )

  return spec?.value?.trim() || null
}

export function resolveShipping(
  shopifyMetafields: ShopifyMetafield[] | null | undefined
): string | null {
  const metafields = Array.isArray(shopifyMetafields) ? shopifyMetafields : []

  const shipping = metafields.find(
    (field) =>
      field.namespace === "custom" &&
      field.key === "shipping" &&
      typeof field.value === "string" &&
      field.value.trim().length > 0
  )

  return shipping?.value?.trim() || null
}

export function resolveProductVideoUrl(
  shopifyMetafields: ShopifyMetafield[] | null | undefined
): string | null {
  const metafields = Array.isArray(shopifyMetafields) ? shopifyMetafields : []

  const video = metafields.find(
    (field) =>
      field.namespace === "custom" &&
      field.key === "product_video_url" &&
      typeof field.value === "string" &&
      field.value.trim().length > 0
  )

  return video?.value?.trim() || null
}
