import imageUrlBuilder from "@sanity/image-url"

import { sanityClient } from "../../../sanity/lib/client"

const builder = imageUrlBuilder(sanityClient)

export function buildSanityImageUrl(
  source:
    | {
        asset: { _ref: string }
        crop?: object | null
        hotspot?: object | null
      }
    | null
    | undefined,
  options?: {
    width?: number
    height?: number
  }
): string | null {
  if (!source?.asset?._ref) return null

  let image = builder.image(source)

  if (options?.width) image = image.width(options.width)
  if (options?.height) image = image.height(options.height)

  return image.fit("crop").crop("focalpoint").auto("format").url()
}

/**
 * Sanity image URL (hotspot-aware) plus the matching object-position. Falls back
 * to the plain asset URL when the source has no asset reference.
 */
export function resolveSanityImage(
  source:
    | {
        asset?: { _ref?: string | null } | null
        crop?: object | null
        hotspot?: { x: number; y: number } | null
      }
    | null
    | undefined,
  fallbackUrl: string
): { url: string; objectPosition: string } {
  const ref = source?.asset?._ref
  return {
    url:
      (ref &&
        buildSanityImageUrl({
          asset: { _ref: ref },
          crop: source?.crop,
          hotspot: source?.hotspot,
        })) ||
      fallbackUrl,
    objectPosition: getObjectPosition(source?.hotspot),
  }
}

export function getObjectPosition(
  hotspot?: {
    x: number
    y: number
  } | null
): string {
  if (!hotspot) return "center center"

  const x = Math.round(hotspot.x * 100)
  const y = Math.round(hotspot.y * 100)

  return `${x}% ${y}%`
}
