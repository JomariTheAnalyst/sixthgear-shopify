import type { SanityShopByBrandsSection } from "@lib/cms/types"
import { montserrat } from "@lib/fonts"

import BrandCards, { type BrandCardItem } from "./brand-cards"
import BrandStatsStrip from "./brand-stats-strip"

const FALLBACK_SECTION_TITLE = "FEATURED BRAND"

interface FeaturedBrandProps {
  data?: SanityShopByBrandsSection | null
  sectionTitle?: string
  brands?: BrandCardItem[] | null
  showNavDesktop?: boolean
}

export type { BrandCardItem }

export default function FeaturedBrand({
  data,
  brands,
}: FeaturedBrandProps) {
  if (Array.isArray(brands) && brands.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <h2
          className={`${montserrat.className} mb-5 text-left text-[28px] font-black uppercase tracking-[0.035em] text-[#161616] sm:text-[34px] md:mb-8 md:text-[42px]`}
        >
          {FALLBACK_SECTION_TITLE}
        </h2>

        <BrandCards brands={brands} />
      </div>
    </section>
  )
}
