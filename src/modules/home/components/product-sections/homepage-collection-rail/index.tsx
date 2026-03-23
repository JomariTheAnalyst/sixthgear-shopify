"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import { montserrat } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "../product-card"

interface HomepageCollectionRailProps {
  title?: string
  collectionHandle: string
  buttonLabel?: string
  products: HttpTypes.StoreProduct[]
}

const MAX_SLOTS = 10

function ViewAllCard({ collectionHandle }: { collectionHandle: string }) {
  const collectionHref = `/store?collection=${encodeURIComponent(collectionHandle)}`

  return (
    <LocalizedClientLink
      href={collectionHref}
      className="flex h-full min-h-[420px] w-[260px] flex-shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-xl bg-[#1a1a1a] px-6 text-white transition-colors duration-300 hover:bg-[#F16D34] lg:w-[280px]"
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
  products,
}: HomepageCollectionRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const showViewAll = products.length > MAX_SLOTS
  const visibleProducts = useMemo(
    () => (showViewAll ? products.slice(0, MAX_SLOTS - 1) : products),
    [products, showViewAll]
  )
  const showControls = showViewAll
  const useDesktopGrid = !showViewAll && visibleProducts.length <= 4

  useEffect(() => {
    const rail = railRef.current

    if (!rail) {
      return
    }

    const updateScrollState = () => {
      const { scrollLeft, clientWidth, scrollWidth } = rail
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }

    updateScrollState()
    rail.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)

    return () => {
      rail.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [showControls, visibleProducts.length])

  if (!products.length) {
    return null
  }

  const collectionHref = `/store?collection=${encodeURIComponent(collectionHandle)}`
  const activeButtonLabel = buttonLabel || "Shop the Collection"

  const scrollRail = (direction: "left" | "right") => {
    const rail = railRef.current

    if (!rail) {
      return
    }

    rail.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    })
  }

  return (
    <section className="bg-white py-10 md:py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 flex items-end justify-between gap-4 px-4 md:mb-8 md:px-8 lg:px-12">
          <h2
            className={`${montserrat.className} text-2xl font-black uppercase tracking-[0.025em] text-gray-900 md:text-3xl lg:text-5xl`}
          >
            {title || collectionHandle}
          </h2>

          <div className="flex items-center gap-2 md:gap-3">
            <LocalizedClientLink
              href={collectionHref}
              className={`${montserrat.className} inline-flex items-center gap-1 bg-gray-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-300 hover:bg-[#F16D34] md:gap-2 md:px-6 md:py-3 md:text-sm`}
            >
              <span className="hidden sm:inline">{activeButtonLabel}</span>
              <span className="sm:hidden">Shop</span>
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" strokeWidth={2.5} />
            </LocalizedClientLink>

            {showControls && (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollRail("left")}
                  disabled={!canScrollLeft}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail("right")}
                  disabled={!canScrollRight}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <div
            ref={railRef}
            className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:px-8"
          >
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="w-[70vw] flex-shrink-0 snap-start sm:w-[45vw] md:w-[40vw]"
              >
                <ProductCard product={product} />
              </div>
            ))}

            {showViewAll && (
              <div className="w-[70vw] flex-shrink-0 snap-start sm:w-[45vw] md:w-[40vw]">
                <ViewAllCard collectionHandle={collectionHandle} />
              </div>
            )}
          </div>
        </div>

        <div
          ref={useDesktopGrid ? undefined : railRef}
          className={
            useDesktopGrid
              ? "hidden px-4 md:px-8 lg:grid lg:grid-cols-4 lg:gap-6 lg:px-12"
              : "hidden lg:flex lg:flex-row lg:gap-6 lg:overflow-x-auto lg:px-12 lg:pb-4 lg:scroll-smooth lg:snap-x lg:snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          }
        >
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className={useDesktopGrid ? undefined : "w-[280px] flex-shrink-0 snap-start"}
            >
              <ProductCard product={product} />
            </div>
          ))}

          {showViewAll && (
            <div className="w-[280px] flex-shrink-0 snap-start">
              <ViewAllCard collectionHandle={collectionHandle} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
