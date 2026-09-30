"use client"

/**
 * Service Hero Section
 * Hero banner for main services page. The photo is shown whole (its own
 * aspect ratio, no crop, no overlay). From lg the text sits on the photo,
 * bottom left as before; below lg the photo is too short for it, so the text
 * goes in a black block underneath.
 */

import Image from "next/image"

import type { ServicesHeroContent } from "@lib/cms/services-page-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ServiceHeroProps {
  content: ServicesHeroContent
}

export default function ServiceHero({ content }: ServiceHeroProps) {
  return (
    <div className="w-full bg-black">
      {/* Never wider than the photo itself (2134px), so it is not enlarged. */}
      <div className="relative mx-auto w-full max-w-[2134px]">
      <Image
        src={content.heroImage}
        alt={content.imageAlt}
        width={2134}
        height={737}
        quality={100}
        sizes="100vw"
        priority
        className="block h-auto w-full"
      />

      <div className="flex w-full flex-col items-start px-6 py-10 sm:px-12 lg:absolute lg:inset-0 lg:justify-end lg:px-20 lg:pb-14 lg:pt-0 xl:pb-20">
        <div className="w-full max-w-4xl text-left">
          <h1 className="mb-4 text-3xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl lg:[text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
            {content.title}
          </h1>

          {content.description && (
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-gray-200 sm:text-base lg:[text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
              {content.description}
            </p>
          )}

          <div className="flex flex-col items-start justify-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <LocalizedClientLink
              href="/contact"
              className="w-full rounded-md border-2 border-white bg-transparent px-6 py-3 text-center text-xs font-bold uppercase tracking-wide text-white transition-all hover:bg-white hover:text-black sm:w-auto sm:text-sm"
            >
              Contact Us
            </LocalizedClientLink>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
