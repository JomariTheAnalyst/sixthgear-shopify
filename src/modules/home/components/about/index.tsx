"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { SanityAboutSection } from "@lib/cms/types"
import { inter, montserrat } from "@lib/fonts"

const FALLBACK_ABOUT_SECTION: SanityAboutSection = {
  useCustomAbout: false,
  kicker: "About Us",
  title: "We Offer Complete Diagnostics for Your Motorcycle",
  description: "Sixth Gear Moto Supply Café + Lounge is a rider-built motorcycle hub combining professional workshop service, premium accessories, riding gear, detailing, performance upgrades, and a relaxed café experience powered by First Gear Coffee.",
  highlights: [
    "Motorcycle Service and Advanced Diagnostics",
    "Parts Accessories Luggage and Communications",
    "Helmets Riding Gear and Apparel",
    "Café Lounge and Rider Community",
  ],
  primaryCta: {
    text: "More About Us",
    link: "/about",
  },
  imageTop: "/images/homepage/about/about_bg.png",
  imageBottom: "/images/homepage/about/about-small.png",
  videoUrl: "#", // or ""
}

interface AboutSectionProps {
  data?: SanityAboutSection | null
  // Keep original props for legacy Strapi support
  kicker?: string
  title?: string
  description?: string
  highlights?: string[]
  primaryCta?: {
    text: string
    link: string
  }
  imageTop?: string | null
  imageBottom?: string | null
  videoUrl?: string | null
}

const AboutSection = ({
  data,
  ...legacyProps
}: AboutSectionProps) => {

  const isCMSDisabled = data?.useCustomAbout === false

  // Merge precedence: Sanity -> Legacy -> Fallback
  // Only override with CMS if the kill-switch is NOT disabled
  const mergedContent = {
    kicker: isCMSDisabled 
      ? (legacyProps.kicker || FALLBACK_ABOUT_SECTION.kicker)
      : (data?.kicker || legacyProps.kicker || FALLBACK_ABOUT_SECTION.kicker),
      
    title: isCMSDisabled
      ? (legacyProps.title || FALLBACK_ABOUT_SECTION.title)
      : (data?.title || legacyProps.title || FALLBACK_ABOUT_SECTION.title),
      
    description: isCMSDisabled
      ? (legacyProps.description || FALLBACK_ABOUT_SECTION.description)
      : (data?.description || legacyProps.description || FALLBACK_ABOUT_SECTION.description),
      
    highlights: isCMSDisabled
      ? (legacyProps.highlights?.length ? legacyProps.highlights : FALLBACK_ABOUT_SECTION.highlights)
      : (data?.highlights?.length ? data.highlights : (legacyProps.highlights?.length ? legacyProps.highlights : FALLBACK_ABOUT_SECTION.highlights)),
      
    primaryCta: isCMSDisabled
      ? (legacyProps.primaryCta || FALLBACK_ABOUT_SECTION.primaryCta)
      : (data?.primaryCta || legacyProps.primaryCta || FALLBACK_ABOUT_SECTION.primaryCta),
      
    imageTop: isCMSDisabled
      ? (legacyProps.imageTop || FALLBACK_ABOUT_SECTION.imageTop)
      : (data?.imageTop || legacyProps.imageTop || FALLBACK_ABOUT_SECTION.imageTop),
      
    imageBottom: isCMSDisabled
      ? (legacyProps.imageBottom || FALLBACK_ABOUT_SECTION.imageBottom)
      : (data?.imageBottom || legacyProps.imageBottom || FALLBACK_ABOUT_SECTION.imageBottom),
      
    videoUrl: isCMSDisabled
      ? (legacyProps.videoUrl || FALLBACK_ABOUT_SECTION.videoUrl)
      : (data?.videoUrl || legacyProps.videoUrl || FALLBACK_ABOUT_SECTION.videoUrl),
  }

  const hasVideo = !!mergedContent.videoUrl && mergedContent.videoUrl !== "#"

  return (
    <section className="bg-[#1a1a1a] py-16 md:py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Images Composition */}
        <div className="relative w-full aspect-square md:aspect-[5/4] lg:aspect-square">
          {/* Top Image (Background/Workshop) */}
          <div className="absolute top-0 right-0 w-[65%] h-[60%] z-10">
            <div
              className="relative w-full h-full rounded-[2rem] overflow-hidden"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
            >
              <Image
                src={mergedContent.imageTop as string}
                alt="Motorcycle Workshop"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Bottom Image (Foreground/Mechanic) */}
          <div className="absolute bottom-0 left-0 w-[70%] h-[65%] z-20">
            <div className="relative w-full h-full rounded-[2rem] border-[6px] border-[#1a1a1a] overflow-hidden shadow-2xl">
              <Image
                src={mergedContent.imageBottom as string}
                alt="Mechanic Working"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 60vw, 40vw"
                unoptimized
              />
            </div>

            {/* Play Button - Only show if video URL exists */}
            {hasVideo && (
              <a
                href={mergedContent.videoUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -top-10 -right-10 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#D97706] to-[#92400E] rounded-[1.5rem] flex items-center justify-center shadow-lg z-30 cursor-pointer hover:scale-110 transition-transform border-[6px] border-[#1a1a1a]"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center pl-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#D97706"
                  >
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col gap-6 z-10">
          {/* Tagline */}
          <span className={`${inter.className} block text-[#F97316] text-sm md:text-base font-semibold uppercase tracking-[0.08em]`}>
            {mergedContent.kicker}
          </span>

          {/* Heading */}
          <h2
            className={`${montserrat.className} text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-[0.02em] text-white`}
          >
            {mergedContent.title}
          </h2>

          {/* Description */}
          <p className={`${inter.className} text-gray-400 text-lg leading-relaxed`}>
            {mergedContent.description}
          </p>

          {/* Features List */}
          {mergedContent.highlights && mergedContent.highlights.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mt-2">
              {mergedContent.highlights.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className={`${inter.className} text-white text-base md:text-lg`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          {mergedContent.primaryCta && mergedContent.primaryCta.text && mergedContent.primaryCta.link && (
            <div className="mt-8">
              <LocalizedClientLink
                href={mergedContent.primaryCta.link}
                className={`${montserrat.className} inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white font-medium rounded-lg hover:shadow-lg hover:to-[#D97706] transition-all transform hover:-translate-y-1`}
              >
                {mergedContent.primaryCta.text}
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
