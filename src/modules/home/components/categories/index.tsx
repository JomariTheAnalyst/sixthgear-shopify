"use client"

import Image from "next/image"
import {
  useCallback,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import { InertiaPlugin } from "gsap/InertiaPlugin"

import type { SanityCategoriesSection } from "@lib/cms/types"
import { cleanSanityString } from "@lib/cms/visual-editing"
import { montserrat, nationalCompressed } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DragCursor, {
  type DragCursorHandle,
} from "components/drag-cursor"

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin)

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

const DRAG_THRESHOLD_PX = 8
const PARALLAX_MAX_PERCENT = 6

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
  index: number
  total: number
  onClickCapture: (event: ReactMouseEvent<HTMLAnchorElement>) => void
  onPointerEnter: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerLeave: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerDown: () => void
  onPointerUp: () => void
}

function CategoryCard({
  category,
  index,
  total,
  onClickCapture,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
}: CategoryCardProps) {
  const href = normalizeCategoryHref(category.buttonLink, category.slug)

  return (
    <div
      data-category-slide
      className="relative aspect-[2/3] w-[88vw] shrink-0 sm:w-[52vw] md:w-[37vw] lg:h-[630.5px] lg:w-[442.922px] lg:aspect-auto"
      role="listitem"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerLeave}
    >
      <LocalizedClientLink
        href={href}
        draggable={false}
        onClickCapture={onClickCapture}
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
            sizes="(max-width: 639px) 88vw, (max-width: 767px) 52vw, (max-width: 1023px) 37vw, 443px"
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
  const cursorRef = useRef<DragCursorHandle | null>(null)
  const draggedRef = useRef(false)
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
      const imageLayers = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll("[data-category-parallax]")
      )
      const parallaxSetters = imageLayers.map((image) =>
        gsap.quickSetter(image, "xPercent")
      )
      const reducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      )

      let reducedMotion = reducedMotionQuery.matches
      let draggable: Draggable | null = null
      let slideMetrics: Array<{ left: number; width: number }> = []
      let viewportWidth = 0

      const measure = () => {
        viewportWidth = viewport.clientWidth
        slideMetrics = slides.map((slide) => ({
          left: slide.offsetLeft,
          width: slide.offsetWidth,
        }))
      }

      const updateParallax = () => {
        if (reducedMotion || viewportWidth <= 0) {
          parallaxSetters.forEach((setX) => setX(0))
          return
        }

        const trackX = Number(gsap.getProperty(track, "x")) || 0
        const viewportCenter = viewportWidth / 2

        slideMetrics.forEach(({ left, width }, index) => {
          const slideCenter = left + trackX + width / 2
          const distance = gsap.utils.clamp(
            -1,
            1,
            (slideCenter - viewportCenter) / (viewportCenter + width / 2)
          )
          parallaxSetters[index](-distance * PARALLAX_MAX_PERCENT)
        })
      }

      const getBounds = () => ({
        minX: Math.min(0, viewport.clientWidth - track.scrollWidth),
        maxX: 0,
      })

      const refresh = () => {
        draggable?.tween?.kill()
        const bounds = getBounds()
        const currentX = Number(gsap.getProperty(track, "x")) || 0
        gsap.set(track, {
          x: gsap.utils.clamp(bounds.minX, bounds.maxX, currentX),
        })
        draggable?.applyBounds(bounds)
        draggable?.update(true)
        measure()
        updateParallax()
      }

      measure()
      ;[draggable] = Draggable.create(track, {
        trigger: viewport,
        type: "x",
        bounds: getBounds(),
        inertia: !reducedMotion,
        edgeResistance: 0.82,
        dragResistance: 0.04,
        dragClickables: true,
        minimumMovement: DRAG_THRESHOLD_PX,
        allowNativeTouchScrolling: true,
        cursor: "none",
        activeCursor: "none",
        onPressInit() {
          this.tween?.kill()
          draggedRef.current = false
          cursorRef.current?.press()
        },
        onDragStart() {
          draggedRef.current = true
        },
        onDrag: updateParallax,
        onThrowUpdate: updateParallax,
        onRelease() {
          cursorRef.current?.release()
        },
      })
      updateParallax()

      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: reduce)", () => {
        reducedMotion = true
        if (draggable) draggable.vars.inertia = false
        parallaxSetters.forEach((setX) => setX(0))

        return () => {
          reducedMotion = false
          if (draggable) draggable.vars.inertia = true
          updateParallax()
        }
      })

      const resizeCall = gsap.delayedCall(0.12, refresh).pause()
      const resizeObserver = new ResizeObserver(() => {
        resizeCall.restart(true)
      })
      resizeObserver.observe(viewport)

      return () => {
        resizeObserver.disconnect()
        resizeCall.kill()
        draggable?.tween?.kill()
        draggable?.kill()
        media.revert()
      }
    },
    {
      scope: sectionRef,
      dependencies: [items.length],
      revertOnUpdate: true,
    }
  )

  const handleCardClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      const interactionWasDrag = draggedRef.current
      draggedRef.current = false

      if (interactionWasDrag) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    []
  )

  const handlePointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const cursorActivated = cursorRef.current?.enter(
        event.clientX,
        event.clientY
      )
      if (cursorActivated) event.currentTarget.style.cursor = "none"
    },
    []
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      cursorRef.current?.move(event.clientX, event.clientY)
    },
    []
  )

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.style.cursor = ""
      cursorRef.current?.leave()
    },
    []
  )

  const handlePointerDown = useCallback(() => {
    draggedRef.current = false
    cursorRef.current?.press()
  }, [])

  const handlePointerUp = useCallback(() => {
    cursorRef.current?.release()
  }, [])

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
        className="w-full cursor-none overflow-hidden touch-pan-y"
        role="region"
        aria-roledescription="carousel"
        aria-label="Product categories"
      >
        <div ref={trackRef} className="flex w-max gap-2" role="list">
          {items.map((category, index) => (
            <CategoryCard
              key={`${getCategoryKey(category)}-${category._key || category.slug}`}
              category={category}
              index={index}
              total={items.length}
              onClickCapture={handleCardClickCapture}
              onPointerEnter={handlePointerEnter}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            />
          ))}
        </div>
      </div>

      <DragCursor ref={cursorRef} primaryLabel="CLICK" />
    </section>
  )
}
