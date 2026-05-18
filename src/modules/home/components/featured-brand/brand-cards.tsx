import Image from "next/image"

import { montserrat } from "@lib/fonts"
import { TextRoll } from "components/ui/text-roll"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type BrandCardItem = {
  id?: number | string
  name?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  link?: string | null
  buttonText?: string | null
}

const FALLBACK_BRAND_CARDS: BrandCardItem[] = [
  {
    name: "AKRAPOVIC",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=1600&fit=crop",
    link: "/store?brand=akrapovic",
    buttonText: "SHOP NOW",
    imageAlt: "Akrapovic exhaust",
  },
  {
    name: "SEC MOTO",
    imageUrl:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&h=1600&fit=crop",
    link: "/store?brand=sec-moto",
    buttonText: "SHOP NOW",
    imageAlt: "SEC Moto gear",
  },
  {
    name: "MOTOHUB",
    imageUrl:
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&h=1600&fit=crop",
    link: "/store?brand=motohub",
    buttonText: "SHOP NOW",
    imageAlt: "Motohub store",
  },
  {
    name: "MOTUL",
    imageUrl:
      "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=1200&h=1600&fit=crop",
    link: "/store?brand=motul",
    buttonText: "SHOP NOW",
    imageAlt: "Motul oil",
  },
]

function resolveBrand(brand: BrandCardItem, index: number) {
  const fallback = FALLBACK_BRAND_CARDS[index]

  return {
    name: brand.name || fallback?.name || `Brand ${index + 1}`,
    imageUrl:
      brand.imageUrl ||
      fallback?.imageUrl ||
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=1600&fit=crop",
    imageAlt:
      brand.imageAlt ||
      fallback?.imageAlt ||
      `${brand.name || fallback?.name || "Brand"} collection image`,
    link: brand.link || fallback?.link || "/store",
    buttonText: brand.buttonText || fallback?.buttonText || "SHOP NOW",
  }
}

function BrandCard({
  brand,
  mobile = false,
}: {
  brand: ReturnType<typeof resolveBrand>
  mobile?: boolean
}) {
  return (
    <LocalizedClientLink
      href={brand.link}
      className={`group relative overflow-hidden bg-neutral-900 ${
        mobile
          ? "aspect-square rounded-[6px]"
          : "min-w-0 flex-[1_1_0%] rounded-[6px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[1.55_1_0%]"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={brand.imageUrl}
          alt={brand.imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={
            mobile
              ? "(max-width: 767px) 50vw"
              : "(min-width: 768px) 25vw, 100vw"
          }
        />
      </div>

      <div className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6 lg:p-8">
        <div className="flex flex-1 items-center justify-center px-3 text-center">
          <h3
            className={`${montserrat.className} text-[22px] font-black uppercase tracking-[0.055em] text-white sm:text-[26px] md:text-[28px] lg:text-[34px]`}
          >
            {brand.name}
          </h3>
        </div>

        <div className="flex justify-start">
          <span
            className={`${montserrat.className} inline-flex items-center gap-3 rounded-none border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white sm:text-sm`}
          >
            <span
              className={`${montserrat.className} font-bold uppercase tracking-[0.08em]`}
            >
              <TextRoll transition={{ duration: 0.35 }} className="whitespace-nowrap">
                {brand.buttonText}
              </TextRoll>
            </span>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M13 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default function BrandCards({
  brands,
}: {
  brands?: BrandCardItem[] | null
}) {
  const inputBrands = brands ?? FALLBACK_BRAND_CARDS
  const resolvedBrands = inputBrands
    .slice(0, 4)
    .map((brand, index) => resolveBrand(brand, index))

  if (resolvedBrands.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {resolvedBrands.map((brand) => (
          <BrandCard key={`${brand.link}-${brand.name}`} brand={brand} mobile />
        ))}
      </div>

      <div className="hidden md:flex md:h-[360px] md:w-full md:items-stretch md:gap-2 lg:h-[420px] lg:gap-3">
        {resolvedBrands.map((brand) => (
          <BrandCard key={`${brand.link}-${brand.name}`} brand={brand} />
        ))}
      </div>
    </>
  )
}
