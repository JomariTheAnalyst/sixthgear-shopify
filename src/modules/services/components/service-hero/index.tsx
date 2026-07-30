"use client"

/**
 * Service Hero Section
 * Hero banner for main services page
 */

import Image from "next/image"

import type { ServicesHeroContent } from "@lib/cms/services-page-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ServiceHeroProps {
  content: ServicesHeroContent
}

export default function ServiceHero({ content }: ServiceHeroProps) {
  return (
    <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[400px] lg:h-auto lg:aspect-[3/1] max-h-[640px]">
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 opacity-100 z-10">
          <Image
            src={content.heroImage}
            alt={content.imageAlt}
            fill
            quality={100}
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      </div>

      <div className="absolute inset-0 z-20 w-full h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 lg:pb-24 items-start">
        <div className="w-full max-w-4xl text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white uppercase tracking-tight line-clamp-1">
            {content.title}
          </h1>

          {content.description && (
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              {content.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 items-start justify-start">
            <LocalizedClientLink
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white font-bold text-center rounded-md hover:bg-white hover:text-black transition-all uppercase tracking-wide text-xs sm:text-sm"
            >
              Contact Us
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
