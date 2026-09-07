import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import type { HomeCollectionItem } from "./data"

const DEFAULT_CTA_LABEL = "View collection"

/**
 * Both tile sizes resolve to roughly half of the 1454px content column on
 * desktop and only differ in height, so they share the desktop width
 * descriptor. Below `small` the large tile goes full width while the two small
 * tiles sit side by side.
 */
const IMAGE_SIZES = {
  large: "(max-width: 1023px) 100vw, (max-width: 1439px) 48vw, 715px",
  small:
    "(max-width: 511px) 100vw, (max-width: 1023px) 50vw, (max-width: 1439px) 48vw, 715px",
} as const

/**
 * Heights are intrinsic (aspect ratio) until `small`, where the group supplies
 * a fixed row height and both tiles simply fill their grid area.
 */
const TILE_SHAPE = {
  large: "aspect-[4/5] xsmall:aspect-[16/9] small:aspect-auto small:h-full",
  small: "aspect-[3/2] xsmall:aspect-[4/3] small:aspect-auto small:h-full",
} as const

const TITLE_SIZE = {
  large: "text-[clamp(1.75rem,2.6vw,2.75rem)]",
  small: "text-[clamp(1.5rem,2vw,2rem)]",
} as const

type CollectionBentoTileProps = {
  item: HomeCollectionItem
  size: keyof typeof TILE_SHAPE
  /** Grid placement supplied by the owning group. */
  className?: string
}

export default function CollectionBentoTile({
  item,
  size,
  className = "",
}: CollectionBentoTileProps) {
  return (
    <LocalizedClientLink
      href={item.href}
      aria-label={`${item.ctaLabel ?? DEFAULT_CTA_LABEL}: ${item.title}`}
      className={`group relative block overflow-hidden rounded-large bg-[#f1f1ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] ${TILE_SHAPE[size]} ${className}`}
    >
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        sizes={IMAGE_SIZES[size]}
        className="select-none object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
      />

      {/* Restrained scrim: the photography is busy, so the title and CTA need a
          contrast floor to sit on. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5 small:p-6">
        <h3
          className={`font-bold leading-[1.05] tracking-[-0.02em] text-white ${TITLE_SIZE[size]}`}
        >
          {item.title}
        </h3>

        {/* Rendered as a span, not a button: the whole tile is already the link. */}
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] transition-colors duration-300 group-hover:bg-[#f15a24] group-hover:text-white group-focus-visible:bg-[#f15a24] group-focus-visible:text-white motion-reduce:transition-none">
          {item.ctaLabel ?? DEFAULT_CTA_LABEL}
          <ArrowUpRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:rotate-45 group-focus-visible:rotate-45 motion-reduce:transform-none motion-reduce:transition-none"
          />
        </span>
      </div>
    </LocalizedClientLink>
  )
}
