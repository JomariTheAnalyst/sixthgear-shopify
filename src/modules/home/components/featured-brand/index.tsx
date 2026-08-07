import { montserrat } from "@lib/fonts"

import BrandCards, { type BrandCardItem } from "./brand-cards"

const SECTION_TITLE = "Shop by Brand"

interface FeaturedBrandProps {
  brands?: BrandCardItem[] | null
}

export type { BrandCardItem }

export default function FeaturedBrand({ brands }: FeaturedBrandProps) {
  if (!brands?.length) return null

  return (
    <section
      aria-labelledby="featured-brands-heading"
      className="w-full overflow-hidden bg-white py-8 md:py-12"
    >
      <div className="w-full">
        <h2
          id="featured-brands-heading"
          className={`${montserrat.className} mb-1 text-left text-[28px] font-black uppercase leading-none tracking-[0.035em] text-[#161616] sm:text-[34px] md:text-[42px]`}
        >
          {SECTION_TITLE}
        </h2>
      </div>

      <BrandCards brands={brands} />
    </section>
  )
}
