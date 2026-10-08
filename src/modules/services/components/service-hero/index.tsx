/**
 * Service Hero Section
 * The photo is shown whole (its own aspect ratio, no crop) with the About
 * hero type. From lg the text sits on the photo, bottom left, over a light
 * gradient that only darkens behind the copy; below lg the photo is too short
 * for it, so the text goes in a black block underneath.
 */

import Image from "next/image"

import type { ServicesHeroContent } from "@lib/cms/services-page-content"
import { nationalCompressed, parkinsans } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ServiceHeroProps {
  content: ServicesHeroContent
}

export default function ServiceHero({ content }: ServiceHeroProps) {
  return (
    <section aria-labelledby="services-hero-heading" className="w-full bg-black">
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
          fetchPriority="high"
          className="block h-auto w-full"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-tr from-black/55 via-black/10 to-transparent lg:block"
        />

        <div className="flex w-full flex-col items-start px-6 py-10 sm:px-12 lg:absolute lg:inset-0 lg:justify-end lg:px-20 lg:pb-14 lg:pt-0 xl:pb-20">
          <div className="w-full max-w-4xl text-left lg:[text-shadow:0_2px_14px_rgba(0,0,0,0.35)]">
            <h1
              id="services-hero-heading"
              className={`${nationalCompressed.className} mb-4 whitespace-pre-line break-words uppercase leading-[0.86] text-white text-[clamp(2.75rem,8vw,8rem)]`}
            >
              {content.title}
            </h1>
            {content.description ? (
              <p
                className={`${parkinsans.className} max-w-xl text-sm leading-relaxed text-gray-200 sm:text-base`}
              >
                {content.description}
              </p>
            ) : null}

            <LocalizedClientLink
              href="/contact"
              className={`${parkinsans.className} mt-6 inline-flex rounded-md border-2 border-white px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors [text-shadow:none] hover:bg-white hover:text-black sm:text-sm`}
            >
              Contact Us
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
