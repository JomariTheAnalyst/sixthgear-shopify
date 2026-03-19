"use client"

/**
 * About Us Hero Section
 * Premium hero with background image and overlay, matching the homepage/services layout
 * Displays main tagline and introduction
 */

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface AboutHeroProps {
  title: string
  subtitle: string
  backgroundImage: string | null
}

export default function AboutHero({
  title,
  subtitle,
  backgroundImage,
}: AboutHeroProps) {
  // Use requested fallback image if backgroundImage isn't available
  const imageSrc = backgroundImage || "/images/sixthgearleftsideimg.jpg"

  return (
    <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[400px] lg:h-auto lg:aspect-[3/1] max-h-[640px]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 opacity-100 z-10">
          <Image
            src={imageSrc}
            alt={title}
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

      {/* Content Container (Matches Homepage/Services Hero padding and layout) */}
      <div className="absolute inset-0 z-20 w-full h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 lg:pb-24 items-start">
        <div className="w-full max-w-4xl text-left">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-4 text-xs sm:text-sm">
            <LocalizedClientLink
              href="/"
              className="text-white/60 hover:text-white transition-colors uppercase tracking-widest font-semibold"
            >
              Home
            </LocalizedClientLink>
            <span className="text-white/40">/</span>
            <span className="text-white font-bold uppercase tracking-widest">About</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white uppercase tracking-tight line-clamp-1">
            {title}
          </h1>

          {/* Description */}
          {subtitle && (
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}

        </div>
      </div>
    </div>
  )
}

