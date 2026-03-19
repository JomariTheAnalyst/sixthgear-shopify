"use client"

import Image from "next/image"
import { SanityServicesBrandsWeService } from "@lib/cms/types"

export const FALLBACK_BRANDS_WE_SERVICE = {
  sectionHeading: "Brands We Service",
  brands: [
    { name: "BMW", logoUrl: "/images/brands/brands-logo/bmw-logo.svg" },
    { name: "KTM", logoUrl: "/images/brands/brands-logo/ktm-logo.svg" },
    { name: "Suzuki", logoUrl: "/images/brands/brands-logo/suzuki-logo.svg" },
    { name: "Kawasaki", logoUrl: "/images/brands/brands-logo/kawasaki-logo.svg" },
    {
      name: "Royal Enfield",
      logoUrl: "/images/brands/brands-logo/royal-enfield-logo.svg",
    },
    { name: "Yamaha", logoUrl: "/images/brands/brands-logo/yamaha.svg" },
  ],
} as const

interface BrandsWeServiceProps {
  data?: SanityServicesBrandsWeService | null
}

export default function BrandsWeService({ data }: BrandsWeServiceProps) {
  const activeHeading =
    data?.sectionHeading?.trim() || FALLBACK_BRANDS_WE_SERVICE.sectionHeading

  const fallbackBrands = FALLBACK_BRANDS_WE_SERVICE.brands
  const mergedBrands =
    data?.brands && data.brands.length > 0
      ? data.brands
          .map((brand, index) => {
            const fallbackBrand = fallbackBrands[index]
            const name = brand?.name?.trim() || fallbackBrand?.name || null
            const logoUrl = brand?.logoUrl || fallbackBrand?.logoUrl || null

            if (!name || !logoUrl) {
              return null
            }

            return { name, logoUrl }
          })
          .filter((brand): brand is { name: string; logoUrl: string } => !!brand)
      : fallbackBrands

  const activeBrands =
    mergedBrands.length > 0 ? mergedBrands : [...fallbackBrands]

  return (
    <section className="bg-white py-16 md:py-24 border-b border-[#F5F5F7] w-full overflow-hidden">
      <div className="w-full mx-auto px-6 md:px-12 lg:px-20 max-w-[1400px]">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h3 
            className="text-3xl md:text-4xl lg:text-5xl text-[#111] font-semibold tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            {activeHeading}
          </h3>
        </div>

        {/* Static One-Row Logo Layout */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {activeBrands.map((brand) => (
            <div 
              key={brand.name}
              className="w-24 md:w-28 lg:w-32 h-10 md:h-12 lg:h-16 relative grayscale opacity-40 cursor-default flex-shrink-0"
            >
              <Image 
                src={brand.logoUrl} 
                alt={brand.name} 
                fill 
                className="object-contain" 
                priority={brand.name === "BMW" || brand.name === "KTM" || brand.name === "Suzuki"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
