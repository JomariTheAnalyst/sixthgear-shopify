"use client"

/**
 * Service Hero Section
 * Hero banner for individual service pages
 */

import Image from "next/image"
import { useParams } from "next/navigation"
import { ServiceCategory } from "@lib/services-data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ServiceHeroProps {
  service: ServiceCategory
}

export default function ServiceHero({ service }: ServiceHeroProps) {
  const params = useParams()
  const countryCode = params?.countryCode as string

  // Use requested fallback image if service.heroImage isn't available
  const backgroundImage = service.heroImage || service.image || "/images/homepage/services/hero.png"

  return (
    <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[400px] lg:h-auto lg:aspect-[3/1] max-h-[640px]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 opacity-100 z-10">
          <Image
            src={backgroundImage}
            alt={service.title}
            fill
            quality={100}
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      </div>

      {/* Content Container (Matches Homepage Hero padding and layout) */}
      <div className="absolute inset-0 z-20 w-full h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 lg:pb-24 items-start">
        <div className="w-full max-w-4xl text-left">
          
          {/* Breadcrumb (Don't show on the main /services page) */}
          {service.slug !== "services" && (
            <nav className="flex items-center gap-2 mb-4 text-xs sm:text-sm">
              <LocalizedClientLink
                href="/"
                className="text-white/60 hover:text-white transition-colors uppercase tracking-widest font-semibold"
              >
                Home
              </LocalizedClientLink>
              <span className="text-white/40">/</span>
              <LocalizedClientLink
                href="/services"
                className="text-white/60 hover:text-white transition-colors uppercase tracking-widest font-semibold"
              >
                Services
              </LocalizedClientLink>
              <span className="text-white/40">/</span>
              <span className="text-white font-bold uppercase tracking-widest">{service.shortTitle}</span>
            </nav>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white uppercase tracking-tight line-clamp-1">
            {service.title}
          </h1>

          {/* Description */}
          {service.description && (
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              {service.description}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 items-start justify-start">
            <LocalizedClientLink
              href="/services"
              className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white font-bold text-center rounded-md hover:bg-white hover:text-black transition-all uppercase tracking-wide text-xs sm:text-sm"
            >
              Services
            </LocalizedClientLink>
          </div>
          
        </div>
      </div>
    </div>
  )
}

