"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { buildSanityImageUrl, getObjectPosition } from "@lib/util/sanity-image"
import { inter, montserrat } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { SanityHeroSection } from "@lib/cms/types"

const FALLBACK_HERO: SanityHeroSection = {
  useCustomHero: false,
  heading: "Best Bike\nRepair & Service",
  description: "Professional servicing, repairs, detailing & performance upgrades. Trusted by riders for precision and care.",
  primaryLabel: "Shop Now",
  primaryLink: "/store",
  secondaryLabel: "View Services",
  secondaryLink: "/services",
  slides: [
    {
      imageUrl: "/images/homepage/slideshow-hero/slideshow4.png",
      mobileImageUrl: null,
      mobileCrop: null,
      mobileHotspot: null,
      imageAlt: "SixthgearMoto hero background 1",
      contentAlignment: "left",
    },
    {
      imageUrl: "/images/homepage/slideshow-hero/slideshow5.png",
      mobileImageUrl: null,
      mobileCrop: null,
      mobileHotspot: null,
      imageAlt: "SixthgearMoto hero background 2",
      contentAlignment: "left",
    },
    {
      imageUrl: "/images/homepage/slideshow-hero/sixthgear-hero.jpg",
      mobileImageUrl: null,
      mobileCrop: null,
      mobileHotspot: null,
      imageAlt: "SixthgearMoto hero background 3",
      contentAlignment: "left",
    },
  ],
}

interface HeroProps {
  data?: SanityHeroSection | null
}

const Hero = ({ data }: HeroProps) => {
  // If explicitly disabled in CMS, kill all CMS inputs and default to pure fallback
  const isCMSDisabled = data?.useCustomHero === false

  // Merge field by field: use CMS if present, otherwise FALLBACK_HERO
  const mergedHero = (!data || isCMSDisabled)
    ? FALLBACK_HERO
    : {
      heading: data.heading ?? FALLBACK_HERO.heading,
      description: data.description ?? FALLBACK_HERO.description,
      primaryLabel: data.primaryLabel ?? FALLBACK_HERO.primaryLabel,
      primaryLink: data.primaryLink ?? FALLBACK_HERO.primaryLink,
      secondaryLabel: data.secondaryLabel ?? FALLBACK_HERO.secondaryLabel,
      secondaryLink: data.secondaryLink ?? FALLBACK_HERO.secondaryLink,
      slides:
        data.slides && data.slides.length > 0
          ? data.slides
          : FALLBACK_HERO.slides || [],
    }

  const headingText = mergedHero.heading || "Sixthgear Moto"

  // Format title to single line (prevents 2 lines)
  const singleLineHeading = headingText.replace(/\n/g, " ")

  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = mergedHero.slides || []

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative w-full overflow-hidden min-h-[85vh] sm:min-h-[400px] lg:h-auto lg:aspect-[3/1] max-h-[90vh] lg:max-h-[640px]">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0 bg-black">
        {slides.map((slide, idx) => (
          (() => {
            const mobileImageSrc =
              buildSanityImageUrl(
                slide.mobileImageRef
                  ? {
                    asset: { _ref: slide.mobileImageRef },
                    crop: slide.mobileCrop ?? null,
                    hotspot: slide.mobileHotspot ?? null,
                  }
                  : null,
                { width: 900, height: 1400 }
              ) ||
              slide.mobileImageUrl ||
              slide.imageUrl

            const desktopObjectPosition = getObjectPosition(slide.hotspot)
            const mobileObjectPosition = getObjectPosition(
              slide.mobileHotspot ?? slide.hotspot
            )

            return (
              <div
                key={slide.imageUrl + idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                  }`}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.imageAlt || `Hero Background slide ${idx + 1}`}
                  fill
                  quality={85}
                  className="hidden md:block object-cover object-right sm:object-center"
                  style={{ objectPosition: desktopObjectPosition }}
                  sizes="(max-width: 767px) 0px, 100vw"
                  priority={idx === 0}
                />

                <Image
                  src={mobileImageSrc}
                  alt={slide.imageAlt || `Hero Background slide ${idx + 1}`}
                  fill
                  quality={85}
                  className="block md:hidden object-cover"
                  style={{ objectPosition: mobileObjectPosition }}
                  sizes="(max-width: 767px) 100vw, 0px"
                  priority={idx === 0}
                />

                {/* Mobile Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-10 pointer-events-none block sm:hidden" />

                {/* Content Container */}
                <div className={`absolute inset-0 z-20 w-full h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-28 sm:pb-20 lg:pb-24 transition-all duration-700 ${slide.contentAlignment === "right" ? "items-end" : "items-start"
                  }`}>
                  <div className={`w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 ${slide.contentAlignment === "right" ? "text-right" : "text-left"
                    }`}>


                    {/* Title */}
                    <h1 className={`${montserrat.className} text-[32px] leading-[1.1] sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-4 text-white uppercase tracking-[0.02em] break-words sm:line-clamp-1 drop-shadow-md sm:drop-shadow-none`}>
                      {singleLineHeading}
                    </h1>

                    {/* Description - Hidden on Mobile */}
                    {mergedHero.description && (
                      <p className={`${inter.className} hidden sm:block text-gray-200 text-sm sm:text-base leading-relaxed mb-6 max-w-xl`}>
                        {mergedHero.description}
                      </p>
                    )}

                    {/* CTA Buttons - Large & Stacked on Mobile */}
                    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all duration-700 w-full sm:w-auto ${slide.contentAlignment === "right" ? "items-end sm:justify-end" : "items-start sm:justify-start"
                      }`}>
                      {mergedHero.primaryLink && mergedHero.primaryLabel && (
                        <LocalizedClientLink
                          href={mergedHero.primaryLink}
                          className={`${montserrat.className} flex items-center justify-center w-full sm:w-auto px-6 py-4 sm:py-3 bg-white text-black font-medium text-center rounded-md hover:bg-gray-100 transition-all uppercase tracking-[0.04em] text-sm`}
                        >
                          {mergedHero.primaryLabel}
                        </LocalizedClientLink>
                      )}

                      {mergedHero.secondaryLabel && mergedHero.secondaryLink && (
                        <LocalizedClientLink
                          href={mergedHero.secondaryLink}
                          className={`${montserrat.className} flex items-center justify-center w-full sm:w-auto px-6 py-4 sm:py-3 bg-transparent border-2 border-white text-white font-medium text-center rounded-md hover:bg-white hover:text-black transition-all uppercase tracking-[0.04em] text-sm`}
                        >
                          {mergedHero.secondaryLabel}
                        </LocalizedClientLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()
        ))}
      </div>

      {/* Carousel Navigation */}
      {slides.length > 1 && (
        <>
          {/* Desktop Pagination Dots */}
          <div className="hidden sm:flex absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${idx === currentSlide ? "bg-white" : "bg-white/30 hover:bg-white/50"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mobile Navigation (Arrows + Progress Dots) */}
          <div className="flex sm:hidden absolute bottom-6 left-6 right-6 z-30 items-center justify-between gap-4">
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-0.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-white" : "w-4 bg-white/40"
                    }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Hero
