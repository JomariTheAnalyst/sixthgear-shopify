import type { ShopifyImage, ShopifyMetafield } from "./types"

export function resolveShopifyImageMetafield(
  metafield: ShopifyMetafield | null | undefined
): ShopifyImage | null {
  if (
    metafield?.type !== "file_reference" ||
    metafield.reference?.__typename !== "MediaImage"
  ) {
    return null
  }

  const image = metafield.reference.image
  if (!image || typeof image.url !== "string" || image.url.trim() === "") {
    return null
  }

  const imageAlt = image.altText?.trim()
  const mediaAlt = metafield.reference.alt?.trim()

  return {
    ...image,
    url: image.url.trim(),
    altText: imageAlt || mediaAlt || null,
  }
}
