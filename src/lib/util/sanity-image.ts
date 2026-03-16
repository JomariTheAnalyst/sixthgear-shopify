import imageUrlBuilder from "@sanity/image-url"

import { client } from "@lib/cms/client"

const builder = imageUrlBuilder(client)

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
