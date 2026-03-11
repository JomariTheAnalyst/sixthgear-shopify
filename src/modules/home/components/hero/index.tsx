"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { SanityHeroSection } from "@lib/cms/types"

const FALLBACK_HERO: SanityHeroSection = {
  useCustomHero: false,
  heading: "Best Bike\nRepair & Service",
  description: "Professional servicing, repairs, detailing & performance upgrades. Trusted by riders for precision and care.",
  primaryLabel: "More About Us",
  primaryLink: "/about",
  secondaryLabel: "View Services",
  secondaryLink: "/services",
  slides: [
    {
      imageUrl: "/images/homepage/slideshow-hero/slideshow4.png",
      imageAlt: "SixthgearMoto hero background 1",
      contentAlignment: "left",
    },
    {
      imageUrl: "/images/homepage/slideshow-hero/slideshow5.png",
      imageAlt: "SixthgearMoto hero background 2",
      contentAlignment: "left",
    },
    {
      imageUrl: "/images/homepage/slideshow-hero/sixthgear-hero.png",
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
        slides: data.slides && data.slides.length > 0 ? data.slides : (FALLBACK_HERO.slides || [])
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
    <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[400px] lg:h-auto lg:aspect-[3/1] max-h-[640px]">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0 bg-black">
        {slides.map((slide, idx) => (
          <div 
            key={slide.imageUrl + idx} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt || `Hero Background slide ${idx + 1}`}
              fill
              quality={100}
              className="object-cover object-center"
              sizes="100vw"
              priority={idx === 0}
            />

            {/* Content Container (Now scoped uniquely per-slide) */}
            <div className={`absolute inset-0 z-20 w-full h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 lg:pb-24 transition-all duration-700 ${
              slide.contentAlignment === "right" ? "items-end" : "items-start"
            }`}>
              <div className={`w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 ${
                slide.contentAlignment === "right" ? "text-right" : "text-left"
              }`}>
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white uppercase tracking-tight line-clamp-1">
                  {singleLineHeading}
                </h1>

                {/* Description */}
                {mergedHero.description && (
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                    {mergedHero.description}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all duration-700 ${
                  slide.contentAlignment === "right" ? "items-end sm:justify-end" : "items-start sm:justify-start"
                }`}>
                  {mergedHero.primaryLink && mergedHero.primaryLabel && (
                    <LocalizedClientLink
                      href={mergedHero.primaryLink}
                      className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold text-center rounded-md hover:bg-gray-100 transition-all uppercase tracking-wide text-xs sm:text-sm"
                    >
                      {mergedHero.primaryLabel}
                    </LocalizedClientLink>
                  )}

                  {mergedHero.secondaryLabel && mergedHero.secondaryLink && (
                    <LocalizedClientLink
                      href={mergedHero.secondaryLink}
                      className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white font-bold text-center rounded-md hover:bg-white hover:text-black transition-all uppercase tracking-wide text-xs sm:text-sm"
                    >
                      {mergedHero.secondaryLabel}
                    </LocalizedClientLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${
                idx === currentSlide ? "bg-white" : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Hero

