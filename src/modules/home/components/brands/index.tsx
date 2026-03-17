"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { inter, lato, montserrat } from "@lib/fonts"

interface BrandItem {
  name: string
  logo: string
  link?: string | null
}

interface BrandsSectionProps {
  sectionTitle?: string | null
  sectionDescription?: string | null
  brands?: BrandItem[] | null
}

const brandImageMap: Record<string, string> = {
  Suzuki: "/images/brands/motorcycle-images/motosm.png",
  Yamaha: "/images/brands/motorcycle-images/yamaha.webp",
  KTM: "/images/brands/motorcycle-images/ktm.png",
  Kawasaki: "/images/brands/motorcycle-images/kawasaki.png",
  BMW: "/images/brands/motorcycle-images/BMW.png",
  "Royal Enfield": "/images/brands/motorcycle-images/royal-enfield.png",
}

const defaultBrands: BrandItem[] = [
  {
    name: "Suzuki",
    logo: "/images/brands/brand1.png",
    link: null,
  },
  { name: "Yamaha", logo: "/images/brands/brand2.png", link: null },
  { name: "KTM", logo: "/images/brands/brand3.png", link: null },
  { name: "Kawasaki", logo: "/images/brands/brand4.png", link: null },
  { name: "BMW", logo: "/images/brands/brand5.png", link: null },
  { name: "Royal Enfield", logo: "/images/brands/brand6.png", link: null },
]

const brandOverviewMap: Record<string, string> = {
  Suzuki:
    "Suzuki motorcycles are known for practical performance, reliability, and everyday rideability across commuter and sport platforms.",
  Yamaha:
    "Yamaha blends responsive engineering with rider-focused design, from urban commuters to high-performance machines.",
  KTM:
    "KTM brings aggressive styling, sharp handling, and performance-first engineering built for riders who want a more energetic machine.",
  Kawasaki:
    "Kawasaki motorcycles are recognized for strong road presence, balanced power delivery, and dependable versatility across segments.",
  BMW:
    "BMW motorcycles combine premium engineering, touring comfort, and advanced rider technology for long-distance confidence and everyday refinement.",
  "Royal Enfield":
    "Royal Enfield focuses on timeless styling, relaxed character, and mechanical simplicity that suits both city and open-road riding.",
}

export default function Brands({
  sectionTitle,
  sectionDescription,
  brands,
}: BrandsSectionProps) {
  const activeTitle = sectionTitle || "Motorcycle Brands We Service & Support"
  const activeDescription =
    sectionDescription ||
    "Experienced in servicing Japanese, American, and European motorcycles with proper tools, care, and attention to detail."
  const activeBrands = brands && brands.length > 0 ? brands : defaultBrands

  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const activeBrand = useMemo(
    () =>
      activeIndex !== null
        ? activeBrands[activeIndex] || activeBrands[0]
        : activeBrands[0],
    [activeBrands, activeIndex]
  )
  const activeBrandImage =
    brandImageMap[activeBrand?.name] ||
    activeBrand?.logo ||
    "/images/brands/brand1.png"

  if (!activeBrand) {
    return null
  }

  return (
    <section className="py-14 md:py-18 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-14">
          <h2
            className={`${montserrat.className} text-2xl md:text-4xl lg:text-5xl font-bold tracking-[0.02em] text-gray-900 mb-3 md:mb-4`}
          >
            {activeTitle}
          </h2>
          <p
            className={`${inter.className} text-base md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto`}
          >
            {activeDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] gap-8 lg:gap-12 items-start">
          <div className="order-2 lg:order-1 rounded-[28px] border border-gray-200 overflow-hidden bg-white">
            {activeBrands.map((brand, index) => {
              const isActive = index === activeIndex
              const overview =
                brandOverviewMap[brand.name] ||
                "We support this brand with careful servicing, diagnostics, maintenance, and workshop experience tailored to its platform."

              return (
                <div
                  key={`${brand.name}-${index}`}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === index ? null : index
                      )
                    }
                    className="w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 md:py-6 text-left transition-colors hover:bg-gray-50"
                  >
                    <span
                      className={`${lato.className} text-black text-xl md:text-2xl lg:text-[30px] leading-none tracking-[0.03em]`}
                    >
                      {brand.name}
                    </span>
                    <span
                      className={`flex items-center justify-center transition-colors ${
                        isActive ? "text-black" : "text-gray-700"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? "rotate-45" : ""
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 md:px-7 pb-5 md:pb-6">
                        <p
                          className={`${inter.className} text-sm md:text-base text-gray-600 leading-relaxed max-w-[52ch]`}
                        >
                          {overview}
                        </p>
                        {brand.link ? (
                          <Link
                            href={brand.link}
                            className={`${montserrat.className} inline-flex items-center mt-4 text-xs md:text-sm font-semibold uppercase tracking-[0.06em] text-black border-b border-black pb-1 hover:opacity-70 transition-opacity`}
                          >
                            Explore Brand
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/4.6] sm:aspect-[4/3] lg:aspect-[5/4] rounded-[28px] overflow-hidden bg-gray-50 border border-gray-200">
              <Image
                key={`${activeBrand.name}-${activeBrandImage}`}
                src={activeBrandImage}
                alt={activeBrand.name}
                fill
                className="object-contain p-6 md:p-8 lg:p-10 transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
