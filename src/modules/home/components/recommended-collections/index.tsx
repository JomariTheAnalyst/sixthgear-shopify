import { outfit } from "@lib/fonts"

import CollectionBentoGroup, {
  type BentoGroupVariant,
} from "./collection-bento-group"
import { HOME_COLLECTION_ITEMS, type HomeCollectionItem } from "./data"

/**
 * Homepage "Recommended Collections" bento section.
 *
 * Server-rendered: hover and focus behavior is pure CSS, so nothing here needs
 * a client boundary. Only the tile links are client components, matching the
 * pattern already used by the product sections and social feed.
 *
 * Collection data is temporary and hardcoded (see `./data`). The future Shopify
 * migration should only need to change what is passed into `items`.
 *
 * SECTION_X_PADDING mirrors the About Us / Our Services / Our Team revamps:
 * exact 233px sides from `large:` (1440px+), responsive reduction below it,
 * and 20px on mobile.
 */
const SECTION_X_PADDING =
  "px-5 xsmall:px-8 small:px-16 medium:px-24 large:px-[233px]"

const GROUP_SIZE = 3

const DEFAULT_HEADING = "Recommended Collections For You"
const DEFAULT_SUPPORTING_COPY =
  "Gear, parts, and riding essentials our Makati crew reaches for most."

function chunkIntoGroups<T>(items: T[], size: number): T[][] {
  const groups: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size))
  }

  return groups
}

function variantForGroup(index: number): BentoGroupVariant {
  return index % 2 === 0 ? "large-left" : "large-right"
}

type RecommendedCollectionsProps = {
  items?: HomeCollectionItem[]
  heading?: string
  supportingCopy?: string
}

export default function RecommendedCollections({
  items = HOME_COLLECTION_ITEMS,
  heading = DEFAULT_HEADING,
  supportingCopy = DEFAULT_SUPPORTING_COPY,
}: RecommendedCollectionsProps) {
  if (items.length === 0) {
    return null
  }

  const groups = chunkIntoGroups(items, GROUP_SIZE)

  return (
    <section
      id="recommended-collections"
      aria-labelledby="homepage-recommended-collections-heading"
      className={`${outfit.className} overflow-hidden bg-white py-14 text-[#111111] antialiased small:py-20 medium:py-24 ${SECTION_X_PADDING}`}
    >
      <div className="mx-auto max-w-[1454px]">
        <header className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <h2
            id="homepage-recommended-collections-heading"
            className="text-[clamp(2.5rem,4.3vw,4.75rem)] font-black uppercase leading-[0.98] tracking-[-0.04em] text-[#241015] [text-wrap:balance]"
          >
            {heading}
          </h2>
          <p className="mt-4 max-w-[52ch] text-base font-light leading-[1.6] text-[#4b4b4b] small:mt-5 small:text-lg">
            {supportingCopy}
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-4 small:mt-16 small:gap-5 medium:mt-20">
          {groups.map((group, index) => (
            <CollectionBentoGroup
              key={group[0].key}
              items={group}
              variant={variantForGroup(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
