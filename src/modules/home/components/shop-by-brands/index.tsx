"use client"

import { useState, useRef, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import type { SanityShopByBrandsSection } from "@lib/cms/types"

const FALLBACK_SHOP_BY_BRANDS: SanityShopByBrandsSection = {
  useCustomShopByBrands: false,
  sectionTitle: "BRANDS WE ARE PARTNER WITH",
  showNavDesktop: false,
  brands: [
    {
      name: "AKRAPOVIC",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      link: "/store?brand=akrapovic",
      buttonText: "SHOP NOW",
      imageAlt: "Akrapovic exhaust"
    },
    {
      name: "SEC MOTO",
      imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop",
      link: "/store?brand=sec-moto",
      buttonText: "SHOP NOW",
      imageAlt: "SEC Moto gear"
    },
    {
      name: "MOTOHUB",
      imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop",
      link: "/store?brand=motohub",
      buttonText: "SHOP NOW",
      imageAlt: "Motohub store"
    },
    {
      name: "MOTUL",
      imageUrl: "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&h=600&fit=crop",
      link: "/store?brand=motul",
      buttonText: "SHOP NOW",
      imageAlt: "Motul oil"
    },
  ],
  stats: [
    {
      icon: "⭐",
      title: "Rider-Built Experience",
      description: "Years of hands-on motorcycle expertise",
    },
    {
      icon: "🏍️",
      title: "Trusted by Riders",
      description: "Preferred by riders and enthusiasts",
    },
    {
      icon: "⚡",
      title: "Fast Turnaround",
      description: "Efficient, reliable service delivery",
    },
    {
      icon: "🔩",
      title: "Genuine Parts & Accessories",
      description: "Trusted OEM and premium aftermarket",
    },
  ],
}

interface ShopByBrandsProps {
  data?: SanityShopByBrandsSection | null
  // Keep original props optional for existing callers if necessary, but we'll adapt them
  sectionTitle?: string
  brands?: any[]
  showNavDesktop?: boolean
}

export default function ShopByBrands({
  data,
  ...legacyProps
}: ShopByBrandsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const isCMSDisabled = !data || data.useCustomShopByBrands === false
  
  // 1. If Sanity kill-switch is thrown, we strictly ignore Sanity data.
  // 2. Otherwise we prioritize Sanity config -> Legacy Strapi config -> Hardcoded Fallback.
  
  const resolvedSectionTitle = isCMSDisabled 
    ? (legacyProps.sectionTitle || FALLBACK_SHOP_BY_BRANDS.sectionTitle)
    : (data?.sectionTitle || legacyProps.sectionTitle || FALLBACK_SHOP_BY_BRANDS.sectionTitle)

  const resolvedShowNavDesktop = isCMSDisabled
    ? (legacyProps.showNavDesktop ?? FALLBACK_SHOP_BY_BRANDS.showNavDesktop)
    : (data?.showNavDesktop ?? legacyProps.showNavDesktop ?? FALLBACK_SHOP_BY_BRANDS.showNavDesktop)

  const resolvedBrands = isCMSDisabled
    ? (legacyProps.brands?.length ? legacyProps.brands : FALLBACK_SHOP_BY_BRANDS.brands)
    : (data?.brands?.length ? data.brands : (legacyProps.brands?.length ? legacyProps.brands : FALLBACK_SHOP_BY_BRANDS.brands))

  const resolvedStats = (isCMSDisabled
    ? FALLBACK_SHOP_BY_BRANDS.stats
    : (data?.stats?.length ? data.stats : FALLBACK_SHOP_BY_BRANDS.stats)) || []

  // Don't render if no brands at all
  if (!resolvedBrands || resolvedBrands.length === 0) {
    return null
  }

  const itemsPerView = 4
  const maxIndex = Math.max(0, resolvedBrands.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.scrollWidth / resolvedBrands.length
      container.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      })
    }
  }, [currentIndex, resolvedBrands.length])

  return (
    <section className="w-full bg-white">
      {/* Brands Section */}
      <div className="py-6 md:py-8 relative">
        <div className="w-full px-2 sm:px-3 md:px-4">
          {/* Section Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-tight px-1 sm:px-2">
            {resolvedSectionTitle}
          </h2>

          {/* Carousel Container */}
          <div className="relative">
            {/* Desktop Navigation Arrows - Only show if > 4 brands */}
            {resolvedShowNavDesktop && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous brands"
                >
                  <svg
                    className="w-6 h-6 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Next brands"
                >
                  <svg
                    className="w-6 h-6 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Scrollable Brands Grid */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="grid grid-flow-col auto-cols-[50%] md:auto-cols-[25%] gap-[2px]">
                {resolvedBrands.map((brand, index) => (
                  <LocalizedClientLink
                    key={index}
                    href={brand.link || "#"}
                    className="group relative overflow-hidden bg-gray-900 transition-all duration-500 ease-out touch-manipulation select-none"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      transform:
                        hoveredIndex === index ? "scaleX(1.15)" : "scaleX(1)",
                      zIndex: hoveredIndex === index ? 10 : 1,
                      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out pointer-events-none"
                        style={{
                          backgroundImage: `url(${brand.imageUrl})`,
                          transform:
                            hoveredIndex === index ? "scale(1.25)" : "scale(1)",
                        }}
                      />

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-8">
                        {/* Brand Name */}
                        <h3 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 md:mb-4 uppercase tracking-wide">
                          {brand.name}
                        </h3>

                        {/* Button */}
                        <div className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                          <span>{brand.buttonText}</span>
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </LocalizedClientLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="w-full bg-[#f5f5f5] border-t border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {resolvedStats.map((stat, index) => (
              <div key={index} className="flex items-start gap-3 md:gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl md:text-3xl flex items-center justify-center">
                  {stat.iconUrl ? (
                    <img src={stat.iconUrl} alt={stat.title} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                  ) : (
                    stat.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-tight mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
