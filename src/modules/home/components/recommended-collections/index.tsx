import { outfit } from "@lib/fonts"
import { getCollectionProductCount } from "@lib/shopify"

import { EDITORIAL_CARDS } from "./config"
import EditorialCards from "./editorial-cards"

/**
 * Homepage "Recommended Collections" editorial section: two full-bleed image
 * cards linking to their Shopify collections.
 *
 * Server component: resolves the cached product counts, then hands the cards to
 * the client component that owns the GSAP title reveal.
 *
 * SECTION_X_PADDING mirrors the About Us / Our Services / Our Team revamps and
 * only frames the heading; the cards span the full viewport width.
 */
const SECTION_X_PADDING =
  "px-5 xsmall:px-8 small:px-16 medium:px-24 large:px-[233px]"

const DEFAULT_HEADING = "Recommended Collections For You"
const DEFAULT_SUPPORTING_COPY =
  "Gear, parts, and riding essentials our Makati crew reaches for most."

type RecommendedCollectionsProps = {
  heading?: string
  supportingCopy?: string
}

export default async function RecommendedCollections({
  heading = DEFAULT_HEADING,
  supportingCopy = DEFAULT_SUPPORTING_COPY,
}: RecommendedCollectionsProps) {
  const counts = await Promise.all(
    EDITORIAL_CARDS.map((card) => getCollectionProductCount(card.handle))
  )
  const cards = EDITORIAL_CARDS.map((card, index) => ({
    ...card,
    count: counts[index],
  }))

  return (
    <section
      id="recommended-collections"
      aria-labelledby="homepage-recommended-collections-heading"
      className={`${outfit.className} overflow-hidden bg-white py-14 text-[#111111] antialiased small:py-20 medium:py-24`}
    >
      <div className={SECTION_X_PADDING}>
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
      </div>

      <div className="mt-12 small:mt-16 medium:mt-20">
        <EditorialCards cards={cards} />
      </div>
    </section>
  )
}
