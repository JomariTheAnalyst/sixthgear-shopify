/**
 * Shop By Categories Section
 * Modern, professional grid layout with hover effects
 */

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import type { SanityCategoriesSection } from "@lib/cms/types"
import { inter, montserrat } from "@lib/fonts"

const FALLBACK_CATEGORIES_SECTION = {
  title: "Product Categories",
  watermarkText: "CATEGORIES",
  viewAllLabel: "VIEW ALL",
  viewAllLink: "/store",
  items: [
  {
    name: "BAGS AND LUGGAGE",
    slug: "bags-and-luggage",
    image: "/images/product-categories/bags-and-boxes (1).png",
    imageAlt: "Black motorcycle top box and luggage case",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/bags-and-luggages",
  },
  {
    name: "COMMUNICATIONS",
    slug: "communications",
    image: "/images/product-categories/intercom.png",
    imageAlt: "Motorcycle intercom communication device",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/communications",
  },
  {
    name: "HELMETS",
    slug: "helmets",
    image: "/images/product-categories/helmets.png",
    imageAlt: "Black off-road motorcycle helmet",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/helmet",
  },
  {
    name: "PARTS AND ACCESSORIES",
    slug: "parts-and-accessories",
    image: "/images/product-categories/exhaust.png", // Using the closest placeholder we have
    imageAlt: "Motorcycle exhaust accessory",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/parts-and-accessories",
  },
  {
    name: "RIDING GEAR",
    slug: "riding-gear",
    image: "/images/product-categories/shoes.png",
    imageAlt: "Pair of black riding boots",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/riding-gear",
  },
  {
    name: "APPAREL",
    slug: "apparel",
    image: "/images/product-categories/apparel.png",
    imageAlt: "Black motorcycle riding jacket",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/apparel",
  },
]
}

const normalizeCategoryHref = (buttonLink?: string | null, slug?: string) => {
  const rawHref = buttonLink?.trim()

  if (rawHref) {
    if (/^https?:\/\//i.test(rawHref)) {
      return rawHref
    }

    const withoutLocalePrefix = rawHref.replace(/^\/[a-z]{2}(?=\/)/i, "")
    return withoutLocalePrefix.startsWith("/")
      ? withoutLocalePrefix
      : `/${withoutLocalePrefix}`
  }

  if (slug) {
    return `/collections/${slug}`
  }

  return "#"
}

function CategoryCard({
  name,
  slug,
  image,
  imageAlt,
  buttonLabel,
  buttonLink,
}: {
  name: string
  slug: string
  image: string
  imageAlt?: string | null
  buttonLabel?: string | null
  buttonLink?: string | null
}) {
  const href = normalizeCategoryHref(buttonLink, slug)
  const ctaLabel = buttonLabel || "Shop Now"

  return (
    <div className="group relative block bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 w-full overflow-hidden h-[240px] md:h-[260px] shadow-sm rounded-md border border-gray-50">
      <div className="relative z-10 flex flex-col h-full w-full p-6 lg:p-8 text-black">
        {/* Top Header Block */}
        <div className="flex flex-col items-start gap-4 relative z-20 w-[60%] md:w-[52%]">
          <h3 className={`${montserrat.className} font-black uppercase tracking-[0.035em] text-[16px] sm:text-[17px] md:text-[19px] lg:text-[20px] text-black leading-[1.05] drop-shadow-sm`}>
            {name}
          </h3>
        </div>

        {/* Bottom-left CTA */}
        <div className="mt-auto relative z-20">
          <LocalizedClientLink
            href={href}
            className={`${montserrat.className} inline-flex items-center justify-center border border-black px-3 py-2 md:px-3.5 md:py-2 text-[10px] md:text-[11px] font-medium tracking-[0.08em] uppercase text-black transition-colors duration-300 hover:bg-black hover:text-white`}
          >
            {ctaLabel}
          </LocalizedClientLink>
        </div>

        {/* Floating Product Image - Increased width constraint and base scale for larger visual presence */}
        <div className="absolute top-0 right-0 bottom-0 w-[70%] lg:w-[65%] p-4 lg:pr-6 pointer-events-none z-10 flex items-center justify-end">
          <div className="relative w-full h-[100%]">
            <Image
              src={image}
              alt={imageAlt || name}
              fill
              className="object-contain object-right md:object-right-bottom origin-bottom-right transition-transform duration-700 ease-out group-hover:scale-[1.10] drop-shadow-[0_15px_20px_rgba(0,0,0,0.12)] scale-[1.05]"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ShopByCategoriesProps {
  data?: SanityCategoriesSection | null
}

export default function ShopByCategories({ data }: ShopByCategoriesProps) {
  // Determine if we should completely ignore CMS and force default
  const useCustom = data?.useCustomCategories !== false
  
  // Destructure with priority to CMS (if valid/enabled), otherwise fill from fallback
  const title = (useCustom && data?.title) || FALLBACK_CATEGORIES_SECTION.title
  const watermarkText = (useCustom && data?.watermarkText) || FALLBACK_CATEGORIES_SECTION.watermarkText
  const viewAllLabel = (useCustom && data?.viewAllLabel) || FALLBACK_CATEGORIES_SECTION.viewAllLabel
  const viewAllLink = (useCustom && data?.viewAllLink) || FALLBACK_CATEGORIES_SECTION.viewAllLink
  
  // Decide which items array to loop over
  const items = (useCustom && data?.items && data.items.length > 0) 
    ? data.items 
    : FALLBACK_CATEGORIES_SECTION.items

  return (
    <section className="relative w-full bg-[#fafafa] pt-12 pb-20 overflow-hidden">
      {/* Absolute Background Watermark Text - Fixed scale and opacity for legibility */}
      <div className="hidden md:flex absolute top-0 left-0 w-full h-full items-start justify-center pt-8 md:pt-12 pointer-events-none overflow-hidden select-none z-0">
        <h1 className="font-black italic text-[11vw] sm:text-[11vw] lg:text-[12vw] uppercase tracking-normal leading-none text-center transform whitespace-nowrap text-gray-200/60 drop-shadow-sm max-w-[100vw]">
          {watermarkText}
        </h1>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 mt-12 md:mt-24">
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className={`${montserrat.className} text-[#ff4e00] font-black uppercase text-[2.8rem] sm:text-[3.3rem] md:text-[4rem] lg:text-[4.65rem] tracking-[0.05em] leading-[0.92] drop-shadow-sm`}>
            {title}
          </h2>
        </div>

        {/* Uniform 3x2 Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-16 md:mt-20">
          <LocalizedClientLink
            href={viewAllLink}
            className={`${montserrat.className} group relative inline-flex items-center justify-center px-16 py-4 bg-[#ff4e00] text-white font-medium text-[13px] tracking-[0.1em] uppercase overflow-hidden shadow-[0_8px_20px_rgba(255,78,0,0.2)] hover:shadow-[0_12px_25px_rgba(255,78,0,0.3)] transition-all duration-300`}
          >
            {/* Dark triangle cutout on bottom right visual effect */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-[#fafafa] transform rotate-180 transition-transform group-hover:scale-110"
              style={{ clipPath: "polygon(100% 0, 0% 100%, 100% 100%)" }}
            />
            <span className="z-10 transition-transform duration-300">
              {viewAllLabel}
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
