"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import type { SanityCategoriesSection } from "@lib/cms/types"
import { cleanSanityString } from "@lib/cms/visual-editing"
import { montserrat, nationalCompressed } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  createHorizontalLoop,
  type HorizontalLoop,
} from "../featured-brand/horizontal-loop"

gsap.registerPlugin(useGSAP)

type CmsCategoryItem = NonNullable<SanityCategoriesSection["items"]>[number]
type CategoryKey =
  | "helmets"
  | "bags-and-luggage"
  | "parts-and-accessories"
  | "communications"
  | "riding-gear"

type CategoryConfig = {
  key: CategoryKey
  label: string
  aliases: string[]
}

const MARQUEE_SPEED = 0.55

const CATEGORY_ORDER: CategoryConfig[] = [
  {
    key: "helmets",
    label: "Helmets",
    aliases: ["helmet", "helmets"],
  },
  {
    key: "bags-and-luggage",
    label: "Bags and Luggages",
    aliases: [
      "bags-and-luggage",
      "bags-and-luggages",
      "bags-luggage",
      "bags-and-boxes",
    ],
  },
  {
    key: "parts-and-accessories",
    label: "Parts and Accessories",
    aliases: ["parts-and-accessories", "parts-accessories"],
  },
  {
    key: "communications",
    label: "Communications",
    aliases: ["communication", "communications"],
  },
  {
    key: "riding-gear",
    label: "Riding Gear",
    aliases: ["riding-gear", "rider-gear"],
  },
]

const FALLBACK_CATEGORIES_SECTION = {
  title: "Product Categories",
  items: [
    {
      name: "Helmets",
      slug: "helmets",
      image: "/images/product-categories/helmets.png",
      imageAlt: "Black off-road motorcycle helmet",
      buttonLink: "/collections/helmet",
    },
    {
      name: "Bags and Luggages",
      slug: "bags-and-luggage",
      image: "/images/product-categories/bags-and-boxes (1).png",
      imageAlt: "Black motorcycle top box and luggage case",
      buttonLink: "/collections/bags-and-luggages",
    },
    {
      name: "Parts and Accessories",
      slug: "parts-and-accessories",
      image: "/images/product-categories/exhaust.png",
      imageAlt: "Motorcycle exhaust accessory",
      buttonLink: "/collections/parts-and-accessories",
    },
    {
      name: "Communications",
      slug: "communications",
      image: "/images/product-categories/intercom.png",
      imageAlt: "Motorcycle intercom communication device",
      buttonLink: "/collections/communications",
    },
    {
      name: "Riding Gear",
      slug: "riding-gear",
      image: "/images/product-categories/shoes.png",
      imageAlt: "Pair of black riding boots",
      buttonLink: "/collections/riding-gear",
    },
  ],
} satisfies {
  title: string
  items: CmsCategoryItem[]
}

const normalizeCategoryValue = (value?: string | null) =>
  cleanSanityString(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const getCategoryKey = (item: CmsCategoryItem): CategoryKey | null => {
  const values = [
    normalizeCategoryValue(item.slug),
    normalizeCategoryValue(item.name),
  ]

  return (
    CATEGORY_ORDER.find((category) =>
      values.some((value) => category.aliases.includes(value))
    )?.key ?? null
  )
}

const resolveCategoryItems = (
  items: CmsCategoryItem[] | null | undefined
): CmsCategoryItem[] =>
  CATEGORY_ORDER.map((category) => {
    const fallback = FALLBACK_CATEGORIES_SECTION.items.find(
      (item) => getCategoryKey(item) === category.key
    )!
    const cmsItem = items?.find(
      (item) => getCategoryKey(item) === category.key
    )
    const selected = cmsItem ?? fallback

    return {
      ...selected,
      name: category.label,
      slug: selected.slug || fallback.slug,
      image: selected.image || fallback.image,
      imageAlt: selected.imageAlt || fallback.imageAlt,
      buttonLink: selected.buttonLink || fallback.buttonLink,
    }
  })

const normalizeCategoryHref = (buttonLink?: string | null, slug?: string) => {
  const rawHref = buttonLink ? cleanSanityString(buttonLink).trim() : undefined

  if (rawHref) {
    if (/^https?:\/\//i.test(rawHref)) return rawHref

    const withoutLocalePrefix = rawHref.replace(/^\/[a-z]{2}(?=\/)/i, "")
    return withoutLocalePrefix.startsWith("/")
      ? withoutLocalePrefix
      : `/${withoutLocalePrefix}`
  }

  return slug
    ? `/collections/${encodeURIComponent(cleanSanityString(slug))}`
    : "#"
}

type CategoryCardProps = {
  category: CmsCategoryItem
}

function CategoryCard({ category }: CategoryCardProps) {
  const href = normalizeCategoryHref(category.buttonLink, category.slug)

  return (
    <div
      data-category-slide
      className="relative aspect-[2/3] w-[88vw] shrink-0 will-change-transform motion-reduce:transform-none motion-reduce:will-change-auto sm:w-[52vw] md:w-[37vw] lg:h-[630.5px] lg:w-[max(442.922px,25vw)] lg:aspect-auto"
      role="listitem"
    >
      <LocalizedClientLink
        href={href}
        draggable={false}
        aria-label={`Shop ${category.name}`}
        className="group relative block h-full w-full overflow-hidden bg-[#f1f1ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#111111]"
      >
        <div
          data-category-parallax
          className="pointer-events-none absolute inset-y-0 -left-[8%] w-[116%] will-change-transform"
        >
          <Image
            src={cleanSanityString(category.image)}
            alt={category.imageAlt || category.name}
            fill
            draggable={false}
            className="select-none object-contain p-[7%] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            sizes="(max-width: 639px) 88vw, (max-width: 767px) 52vw, (max-width: 1023px) 37vw, (min-width: 1772px) 25vw, 443px"
          />
        </div>

        <h3
          className={`${nationalCompressed.className} pointer-events-none absolute bottom-5 left-3 z-10 text-[clamp(2rem,3.1vw,4rem)] uppercase leading-[0.82] tracking-[0.01em] text-[#111111] sm:bottom-6 sm:left-4`}
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          {category.name}
        </h3>
      </LocalizedClientLink>
    </div>
  )
}

interface ShopByCategoriesProps {
  data?: SanityCategoriesSection | null
}

export default function ShopByCategories({ data }: ShopByCategoriesProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const useCustom = data?.useCustomCategories !== false
  const title =
    (useCustom && data?.title) || FALLBACK_CATEGORIES_SECTION.title
  const sourceItems =
    useCustom && data?.items?.length
      ? data.items
      : FALLBACK_CATEGORIES_SECTION.items
  const items = resolveCategoryItems(sourceItems)

  useGSAP(
    () => {
      const viewport = viewportRef.current
      const track = trackRef.current
      if (!viewport || !track) return

      const slides = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll("[data-category-slide]")
      )
      if (slides.length <= 1) return

      const scaleSetters = slides.map((slide) =>
        gsap.quickSetter(slide, "scaleX")
      )
      const xSetters = slides.map((slide) =>
        gsap.quickSetter(slide, "x", "px")
      )
      let reducedMotion = true
      let isHovered = false
      let hasFocusWithin = false
      let speedTween: gsap.core.Tween | null = null
      let slideMetrics: Array<{ left: number; width: number }> = []
      let cardGap = 0

      const getGap = () => {
        const styles = window.getComputedStyle(track)
        return Number.parseFloat(styles.columnGap || styles.gap) || 0
      }

      const measure = () => {
        const startX = slides[0]?.offsetLeft ?? 0
        cardGap = getGap()
        slideMetrics = slides.map((slide) => ({
          left: slide.offsetLeft - startX,
          width: slide.offsetWidth,
        }))
      }

      const resetCardEffects = () => {
        slides.forEach((_slide, index) => {
          scaleSetters[index](1)
          xSetters[index](0)
        })
      }

      const updateCompression = () => {
        if (reducedMotion) {
          resetCardEffects()
          return
        }

        const positionedSlides = slideMetrics
          .map(({ left, width }, index) => {
            const xPercent =
              Number(gsap.getProperty(slides[index], "xPercent")) || 0

            return {
              index,
              width,
              logicalLeft: left + (xPercent / 100) * width,
            }
          })
          .sort((a, b) => a.logicalLeft - b.logicalLeft)

        let nextPackedLeft = 0

        positionedSlides.forEach(({ index, width, logicalLeft }, orderIndex) => {
          const isExiting = orderIndex === 0 && logicalLeft < 0
          const exitProgress = isExiting
            ? gsap.utils.clamp(0, 1, (logicalLeft + width) / width)
            : 1
          const scaleX = exitProgress
          const packedLeft =
            orderIndex === 0 ? Math.max(logicalLeft, 0) : nextPackedLeft

          scaleSetters[index](scaleX)
          xSetters[index](packedLeft - logicalLeft)

          nextPackedLeft = packedLeft + width * scaleX + cardGap
        })
      }

      gsap.set(slides, {
        transformOrigin: "left center",
      })

      const loop: HorizontalLoop = createHorizontalLoop(slides, {
        paddingRight: getGap,
        speed: MARQUEE_SPEED,
      })
      loop.timeline.eventCallback("onUpdate", updateCompression)

      const smoothlySetPaused = (paused: boolean) => {
        speedTween?.kill()
        if (reducedMotion) return

        speedTween = gsap.to(loop.timeline, {
          timeScale: paused ? 0 : 1,
          duration: paused ? 0.4 : 0.55,
          ease: "power2.out",
          overwrite: "auto",
        })
      }

      const syncHoverPause = () => {
        smoothlySetPaused(isHovered || hasFocusWithin)
      }

      const handleMouseEnter = () => {
        isHovered = true
        syncHoverPause()
      }

      const handleMouseLeave = () => {
        isHovered = false
        syncHoverPause()
      }

      const handleFocusIn = () => {
        hasFocusWithin = true
        syncHoverPause()
      }

      const handleFocusOut = (event: FocusEvent) => {
        hasFocusWithin = viewport.contains(event.relatedTarget as Node | null)
        syncHoverPause()
      }

      viewport.addEventListener("mouseenter", handleMouseEnter)
      viewport.addEventListener("mouseleave", handleMouseLeave)
      viewport.addEventListener("focusin", handleFocusIn)
      viewport.addEventListener("focusout", handleFocusOut)

      const media = gsap.matchMedia()
      media.add(
        {
          allowMotion: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          reducedMotion = Boolean(context.conditions?.reduceMotion)
          speedTween?.kill()

          if (reducedMotion) {
            loop.timeline.pause(0, true).timeScale(1)
            resetCardEffects()
            return
          }

          measure()
          updateCompression()
          loop.timeline
            .timeScale(isHovered || hasFocusWithin ? 0 : 1)
            .play()
        }
      )

      const refresh = () => {
        speedTween?.kill()
        resetCardEffects()
        loop.refresh()
        measure()

        if (reducedMotion) {
          loop.timeline.pause(0, true).timeScale(1)
          resetCardEffects()
          return
        }

        updateCompression()
        loop.timeline.timeScale(isHovered || hasFocusWithin ? 0 : 1)
      }

      const resizeCall = gsap.delayedCall(0.12, refresh).pause()
      const resizeObserver = new ResizeObserver(() => {
        resizeCall.restart(true)
      })
      resizeObserver.observe(viewport)
      resizeObserver.observe(track)

      return () => {
        viewport.removeEventListener("mouseenter", handleMouseEnter)
        viewport.removeEventListener("mouseleave", handleMouseLeave)
        viewport.removeEventListener("focusin", handleFocusIn)
        viewport.removeEventListener("focusout", handleFocusOut)
        resizeObserver.disconnect()
        resizeCall.kill()
        speedTween?.kill()
        loop.timeline.eventCallback("onUpdate", null)
        loop.kill()
        media.revert()
      }
    },
    {
      scope: sectionRef,
      dependencies: [items.length],
      revertOnUpdate: true,
    }
  )

  return (
    <section
      ref={sectionRef}
      aria-labelledby="product-categories-heading"
      className="relative w-full overflow-hidden bg-white py-8 text-[#111111] md:py-12"
    >
      <h2
        id="product-categories-heading"
        className={`${montserrat.className} mb-4 text-left text-[28px] font-black uppercase leading-none tracking-[0.035em] text-[#161616] sm:text-[34px] md:mb-5 md:text-[42px]`}
      >
        {cleanSanityString(title)}
      </h2>

      <div
        ref={viewportRef}
        className="w-full overflow-hidden motion-reduce:overflow-x-auto"
        role="region"
        aria-label="Product categories"
      >
        <div
          ref={trackRef}
          className="flex w-max gap-2 motion-reduce:transform-none"
          role="list"
        >
          {items.map((category) => (
            <CategoryCard
              key={`${getCategoryKey(category)}-${category._key || category.slug}`}
              category={category}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
