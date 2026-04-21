import Image from "next/image"

import type { SanityShopByBrandsSection } from "@lib/cms/types"
import { inter, montserrat } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FALLBACK_SHOP_BY_BRANDS: SanityShopByBrandsSection = {
  useCustomShopByBrands: false,
  sectionTitle: "BRANDS WE ARE PARTNER WITH",
  showNavDesktop: false,
  brands: [
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
  ],
  stats: [
    {
      title: "Rider-Built Experience",
      description: "Years of hands-on motorcycle expertise",
    },
    {
      title: "Trusted by Riders",
      description: "Preferred by riders and enthusiasts",
    },
    {
      title: "Fast Turnaround",
      description: "Efficient, reliable service delivery",
    },
    {
      title: "Genuine Parts & Accessories",
      description: "Trusted OEM and premium aftermarket",
    },
  ],
}

type BrandCardItem = {
  id?: number
  name?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  link?: string | null
  buttonText?: string | null
}

interface ShopByBrandsProps {
  data?: SanityShopByBrandsSection | null
  sectionTitle?: string
  brands?: BrandCardItem[]
  showNavDesktop?: boolean
}

function resolveBrand(brand: BrandCardItem, index: number) {
  const fallback = FALLBACK_SHOP_BY_BRANDS.brands?.[index]

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
        <div className="flex-1 flex items-center justify-center px-3 text-center">
          <h3 className={`${montserrat.className} text-white text-[22px] font-black uppercase tracking-[0.055em] sm:text-[26px] md:text-[28px] lg:text-[34px]`}>
            {brand.name}
          </h3>
        </div>

        <div className="flex justify-start">
          <span className={`${montserrat.className} inline-flex items-center gap-3 border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white sm:text-sm rounded-none`}>
            <span className={`${montserrat.className} font-bold tracking-[0.08em] uppercase`}>
              {brand.buttonText}
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

function StatGlyph({
  index,
  iconUrl,
  title,
}: {
  index: number
  iconUrl?: string
  title: string
}) {
  if (iconUrl) {
    return (
      <Image
        src={iconUrl}
        alt={title}
        width={20}
        height={20}
        className="h-5 w-5 object-contain brightness-0 saturate-0"
      />
    )
  }

  const glyphs = [
    (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l2.65 5.37L20.5 9.2l-4.25 4.14L17.3 20 12 17.2 6.7 20l1.05-6.66L3.5 9.2l5.85-.83L12 3z" />
      </svg>
    ),
    (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5v14M5 12h14" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7l10 10M17 7L7 17" />
      </svg>
    ),
    (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4v4h-4z" />
      </svg>
    ),
    (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 11a3 3 0 116 0 3 3 0 11-6 0zM3 18a5 5 0 0110 0M14 10a2 2 0 114 0 2 2 0 11-4 0zM15.5 18a4 4 0 017 0" />
      </svg>
    ),
  ]

  return glyphs[index % glyphs.length]
}

export default function ShopByBrands({
  data,
  ...legacyProps
}: ShopByBrandsProps) {
  const isCMSDisabled = !data || data.useCustomShopByBrands === false

  const resolvedSectionTitle = isCMSDisabled
    ? legacyProps.sectionTitle || FALLBACK_SHOP_BY_BRANDS.sectionTitle
    : data?.sectionTitle ||
      legacyProps.sectionTitle ||
      FALLBACK_SHOP_BY_BRANDS.sectionTitle

  const inputBrands = isCMSDisabled
    ? legacyProps.brands?.length
      ? legacyProps.brands
      : FALLBACK_SHOP_BY_BRANDS.brands
    : data?.brands?.length
      ? data.brands
      : legacyProps.brands?.length
        ? legacyProps.brands
        : FALLBACK_SHOP_BY_BRANDS.brands

  const resolvedBrands =
    inputBrands?.map((brand, index) => resolveBrand(brand, index)) || []

  const resolvedStats =
    (isCMSDisabled
      ? FALLBACK_SHOP_BY_BRANDS.stats
      : data?.stats?.length
        ? data.stats
        : FALLBACK_SHOP_BY_BRANDS.stats) || []

  if (resolvedBrands.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <h2 className={`${montserrat.className} mb-5 text-left text-[28px] font-black uppercase tracking-[0.035em] text-[#161616] sm:text-[34px] md:mb-8 md:text-[42px]`}>
          {resolvedSectionTitle}
        </h2>

        <div className="grid grid-cols-2 gap-3 md:hidden">
          {resolvedBrands.map((brand) => (
            <BrandCard
              key={`${brand.link}-${brand.name}`}
              brand={brand}
              mobile
            />
          ))}
        </div>

        <div className="hidden md:flex md:h-[360px] md:w-full md:items-stretch md:gap-2 lg:h-[420px] lg:gap-3">
          {resolvedBrands.map((brand) => (
            <BrandCard
              key={`${brand.link}-${brand.name}`}
              brand={brand}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 w-full border-y border-black/10 bg-[#efefef] md:mt-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {resolvedStats.map((stat, index) => (
              <div
                key={`${stat.title}-${index}`}
                className="border-b border-r border-black/10 p-4 last:border-r-0 even:border-r-0 md:border-b-0 md:even:border-r md:[&:nth-child(4)]:border-r-0 md:p-6"
              >
                <div className="mb-3 flex items-center gap-3 text-black">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-black/25" />
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-black/25" />
                    <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-black/25" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-black/25" />
                    <StatGlyph
                      index={index}
                      iconUrl={stat.iconUrl}
                      title={stat.title}
                    />
                  </div>
                </div>

                <h3 className={`${montserrat.className} text-sm font-black uppercase tracking-[0.05em] text-[#111111] md:text-[15px]`}>
                  {stat.title}
                </h3>
                <p className={`${inter.className} mt-1 text-sm leading-6 text-[#4f4b46]`}>
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
