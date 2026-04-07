"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

import ProductCard from "@modules/home/components/product-sections/product-card"

type YouMayLikeClientProps = {
  recommendedProducts: HttpTypes.StoreProduct[]
  fallbackProducts: HttpTypes.StoreProduct[]
  currentProductHandle: string
  region: HttpTypes.StoreRegion
}

const MIN_PRIMARY_RESULTS = 4

export default function YouMayLikeClient({
  recommendedProducts,
  fallbackProducts,
  currentProductHandle,
  region,
}: YouMayLikeClientProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const products = useMemo(() => {
    const seenHandles = new Set<string>()
    const sourceProducts =
      recommendedProducts.length < MIN_PRIMARY_RESULTS
        ? [...recommendedProducts, ...fallbackProducts]
        : recommendedProducts

    const ordered = sourceProducts.filter((product) => {
      const handle = product.handle || ""

      if (!handle || handle === currentProductHandle || seenHandles.has(handle)) {
        return false
      }

      seenHandles.add(handle)
      return true
    })

    return ordered
  }, [currentProductHandle, fallbackProducts, recommendedProducts])

  useEffect(() => {
    const rail = railRef.current

    if (!rail) {
      return
    }

    const updateState = () => {
      const { scrollLeft, clientWidth, scrollWidth } = rail
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }

    updateState()
    rail.addEventListener("scroll", updateState, { passive: true })
    window.addEventListener("resize", updateState)

    return () => {
      rail.removeEventListener("scroll", updateState)
      window.removeEventListener("resize", updateState)
    }
  }, [products.length])

  if (products.length === 0) {
    return null
  }

  const inventoryMap: Record<string, number> = {}

  const scrollRail = (direction: "left" | "right") => {
    railRef.current?.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    })
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2
          className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight"
          style={{ fontFamily: "BRHendrix, sans-serif" }}
        >
          You May Like
        </h2>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollRail("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll recommendations left"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-[#F16D34] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail("right")}
            disabled={!canScrollRight}
            aria-label="Scroll recommendations right"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-[#F16D34] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[260px] flex-shrink-0 snap-start border border-gray-200 bg-white lg:w-[280px]"
          >
            <ProductCard
              product={product}
              region={region}
              inventoryMap={inventoryMap}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
