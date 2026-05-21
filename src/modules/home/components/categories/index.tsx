/**
 * Shop By Categories Section
 * Modern, professional grid layout with hover effects
 */

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import type { SanityCategoriesSection } from "@lib/cms/types"
import { montserrat } from "@lib/fonts"

type CmsCategoryItem = NonNullable<SanityCategoriesSection["items"]>[number]
type DisplayCategoryItem = CmsCategoryItem & {
  description?: string | null
  productCount?: string | number | null
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "bags-and-luggage":
    "Storage solutions for city errands, long rides, and everything you need to keep secure on the road.",
  communications:
    "Stay connected with rider-ready intercoms and accessories built for clear conversations in motion.",
  helmets:
    "Protective lids selected for fit, comfort, airflow, and confidence on every kind of ride.",
  "parts-and-accessories":
    "Practical upgrades and replacement essentials for cleaner builds, better utility, and everyday reliability.",
  "riding-gear":
    "Ride-focused footwear and gear made for grip, support, and long-wearing comfort.",
  apparel:
    "Moto-inspired layers that work at the shop, on the road, and everywhere between stops.",
}

const getCategoryDescription = (
  slug: string,
  name: string,
  description?: string | null
) =>
  description?.trim() ||
  CATEGORY_DESCRIPTIONS[slug] ||
  `Explore ${name.toLowerCase()} selected for the way Sixthgear riders actually use their gear.`

const FALLBACK_CATEGORIES_SECTION = {
  title: "Browse By Categories",
  watermarkText: "CATEGORIES",
  items: [
  {
    name: "BAGS AND LUGGAGE",
    slug: "bags-and-luggage",
    image: "/images/product-categories/bags-and-boxes (1).png",
    imageAlt: "Black motorcycle top box and luggage case",
    description:
      "Storage solutions for city errands, long rides, and everything you need to keep secure on the road.",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/bags-and-luggages",
  },
  {
    name: "COMMUNICATIONS",
    slug: "communications",
    image: "/images/product-categories/intercom.png",
    imageAlt: "Motorcycle intercom communication device",
    description:
      "Stay connected with rider-ready intercoms and accessories built for clear conversations in motion.",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/communications",
  },
  {
    name: "HELMETS",
    slug: "helmets",
    image: "/images/product-categories/helmets.png",
    imageAlt: "Black off-road motorcycle helmet",
    description:
      "Protective lids selected for fit, comfort, airflow, and confidence on every kind of ride.",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/helmet",
  },
  {
    name: "PARTS AND ACCESSORIES",
    slug: "parts-and-accessories",
    image: "/images/product-categories/exhaust.png", // Using the closest placeholder we have
    imageAlt: "Motorcycle exhaust accessory",
    description:
      "Practical upgrades and replacement essentials for cleaner builds, better utility, and everyday reliability.",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/parts-and-accessories",
  },
  {
    name: "RIDING GEAR",
    slug: "riding-gear",
    image: "/images/product-categories/shoes.png",
    imageAlt: "Pair of black riding boots",
    description:
      "Ride-focused footwear and gear made for grip, support, and long-wearing comfort.",
    buttonLabel: "Shop Now",
    buttonLink: "/collections/riding-gear",
  },
  {
    name: "APPAREL",
    slug: "apparel",
    image: "/images/product-categories/apparel.png",
    imageAlt: "Black motorcycle riding jacket",
    description:
      "Moto-inspired layers that work at the shop, on the road, and everywhere between stops.",
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
  description,
  productCount,
  buttonLabel,
  buttonLink,
}: {
  name: string
  slug: string
  image: string
  imageAlt?: string | null
  description?: string | null
  productCount?: string | number | null
  buttonLabel?: string | null
  buttonLink?: string | null
}) {
  const href = normalizeCategoryHref(buttonLink, slug)
  const ctaLabel = buttonLabel || "Shop Now"
  const productLabel =
    typeof productCount === "number"
      ? `${productCount} PRODUCTS`
      : productCount || "SHOP COLLECTION"
  const summary = getCategoryDescription(slug, name, description)

  return (
    <article className="group relative block min-h-[300px] w-full overflow-hidden rounded-[24px] bg-[#eeeeee] shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e9e9e9] hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)] md:min-h-[330px] lg:min-h-[350px]">
      <div className="relative z-10 flex h-full min-h-[300px] w-full flex-col p-5 text-black sm:p-6 md:min-h-[330px] lg:min-h-[350px] lg:p-7">
        <div className="relative z-20 max-w-[78%]">
          <h3 className={`${montserrat.className} text-[26px] font-black uppercase leading-[0.95] tracking-[-0.01em] text-black sm:text-[28px] lg:text-[31px]`}>
            {name}
          </h3>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            {productLabel}
          </p>
        </div>

        <div className="relative z-20 mt-auto max-w-[56%] translate-y-10 pb-1 transition-transform duration-500 ease-out group-hover:translate-y-0 sm:max-w-[58%] md:translate-y-9">
          <p className="mb-3 text-[11px] leading-[1.25] text-neutral-700 sm:text-xs">
            {summary}
          </p>
          <LocalizedClientLink
            href={href}
            className={`${montserrat.className} inline-flex translate-y-0 items-center justify-center rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-white opacity-100 transition-all duration-300 hover:bg-[#ff4e00] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100`}
          >
            {ctaLabel}
          </LocalizedClientLink>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 z-10 flex h-[62%] w-[58%] items-end justify-end sm:h-[66%] sm:w-[60%]">
          <div className="relative h-full w-full translate-x-[8%] translate-y-[8%] transition-transform duration-700 ease-out group-hover:translate-x-[4%] group-hover:translate-y-[4%] group-hover:scale-[1.04]">
            <Image
              src={image}
              alt={imageAlt || name}
              fill
              className="object-contain object-bottom grayscale contrast-[0.78] brightness-[0.84] saturate-0 opacity-75 mix-blend-multiply drop-shadow-[0_16px_22px_rgba(15,23,42,0.08)]"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </article>
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

  // Decide which items array to loop over
  const items: DisplayCategoryItem[] = (useCustom && data?.items && data.items.length > 0)
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
      </div>
    </section>
  )
}
