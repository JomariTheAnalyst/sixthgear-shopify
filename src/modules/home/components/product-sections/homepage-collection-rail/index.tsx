"use client"

import { useEffect, useId, useState } from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { HttpTypes } from "@medusajs/types"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import { montserrat } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "../product-card"

type EmblaApi = NonNullable<UseEmblaCarouselType[1]>

interface HomepageCollectionRailProps {
  title?: string
  collectionHandle: string
  buttonLabel?: string
  /** Products to show; the page fetches one extra to decide on "View All". */
  productLimit: number
  products: HttpTypes.StoreProduct[]
  countryCode?: string
}

// Flex-basis per breakpoint, so widths are right before Embla hydrates:
// 1.5 cards < 640px, 2.5 up to 1023px, 4 up to 1439px, 5 from 1440px.
const SLIDE_CLASS =
  "min-w-0 shrink-0 grow-0 basis-2/3 pl-3 sm:basis-2/5 md:pl-4 lg:basis-1/4 large:basis-1/5"

// Outlined card: hairline at rest, full black outline on hover/focus-within.
const CARD_FRAME_CLASS =
  "h-full border border-black/10 bg-white transition-colors duration-300 hover:border-[#0A0B0A] focus-within:border-[#0A0B0A]"

const ARROW_CLASS =
  "flex h-10 w-10 items-center justify-center border border-[#0A0B0A] text-[#0A0B0A] transition-colors hover:bg-[#0A0B0A] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent"

function ViewAllCard({ href }: { href: string }) {
  return (
    <LocalizedClientLink
      href={href}
      className="flex h-full min-h-[320px] w-full flex-col items-center justify-center gap-3 bg-[#0A0B0A] px-6 text-white transition-colors duration-300 hover:bg-[#0A0B0A]/85"
    >
      <span
        className="text-3xl uppercase leading-none"
        style={{ fontFamily: "Tanker, sans-serif" }}
      >
        View All
      </span>
      <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
    </LocalizedClientLink>
  )
}

export default function HomepageCollectionRail({
  title,
  collectionHandle,
  buttonLabel,
  productLimit,
  products,
  countryCode,
}: HomepageCollectionRailProps) {
  const headingId = useId()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: "auto",
    dragFree: false,
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [snapCount, setSnapCount] = useState(0)
  const [selectedSnap, setSelectedSnap] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    const sync = (api: EmblaApi) => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
      setSnapCount(api.scrollSnapList().length)
      setSelectedSnap(api.selectedScrollSnap())
    }

    sync(emblaApi)
    emblaApi.on("select", sync).on("reInit", sync)

    return () => {
      emblaApi.off("select", sync).off("reInit", sync)
    }
  }, [emblaApi])

  if (!products.length) {
    return null
  }

  const heading = title || collectionHandle
  const hasMore = products.length > productLimit
  const visibleProducts = hasMore ? products.slice(0, productLimit) : products
  const slideCount = visibleProducts.length + (hasMore ? 1 : 0)
  const collectionHref = `/store?collection=${encodeURIComponent(collectionHandle)}`

  return (
    <section
      aria-labelledby={headingId}
      className="bg-white py-10 md:py-12 lg:py-16"
    >
      <div className="mb-6 flex items-end justify-between gap-4 px-[2.5vw] md:mb-8">
        <h2
          id={headingId}
          className={`${montserrat.className} text-2xl font-black uppercase tracking-[0.025em] text-[#0A0B0A] md:text-3xl lg:text-5xl`}
        >
          {heading}
        </h2>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <LocalizedClientLink
            href={collectionHref}
            className={`${montserrat.className} inline-flex h-10 items-center gap-1 bg-[#0A0B0A] px-3 text-xs font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-300 hover:bg-[#0A0B0A]/85 md:gap-2 md:px-6 md:text-sm`}
          >
            <span className="hidden sm:inline">{buttonLabel || "View all"}</span>
            <span className="sm:hidden">View all</span>
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4" strokeWidth={2.5} />
          </LocalizedClientLink>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className={ARROW_CLASS}
              aria-label={`Previous ${heading} products`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className={ARROW_CLASS}
              aria-label={`Next ${heading} products`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-[2.5vw]">
        {/* Embla only captures horizontal drags; pan-y keeps vertical page scroll on touch. */}
        <div
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={heading}
          className="cursor-grab overflow-hidden active:cursor-grabbing"
        >
          <div className="-ml-3 flex [touch-action:pan-y_pinch-zoom] md:-ml-4">
            {visibleProducts.map((product, index) => (
              <div
                key={product.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slideCount}`}
                className={SLIDE_CLASS}
              >
                <div className={CARD_FRAME_CLASS}>
                  <ProductCard
                    product={product}
                    countryCode={countryCode}
                    variant="rail"
                    showWishlist
                    showShare
                  />
                </div>
              </div>
            ))}

            {hasMore && (
              <div
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideCount} of ${slideCount}`}
                className={SLIDE_CLASS}
              >
                <ViewAllCard href={collectionHref} />
              </div>
            )}
          </div>
        </div>
      </div>

      {snapCount > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-1 px-[2.5vw]">
          {Array.from({ length: snapCount }, (_, index) => {
            const active = index === selectedSnap

            return (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to page ${index + 1}`}
                aria-current={active ? "true" : undefined}
                className="group/dot flex h-6 w-6 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A]"
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-colors ${
                    active
                      ? "bg-[#0A0B0A]"
                      : "bg-gray-300 group-hover/dot:bg-gray-500"
                  }`}
                />
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
