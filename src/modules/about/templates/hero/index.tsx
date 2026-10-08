/**
 * About hero: same full-bleed frame as the homepage hero (one image, copy
 * bottom-left), with the About display title kept as is.
 */

import Image from "next/image"

import type { AboutHeroSectionContent } from "@lib/cms/about-page-main"
import { nationalCompressed, parkinsans } from "@lib/fonts"
import { resolveSanityImage } from "@lib/util/sanity-image"

const FALLBACK_IMAGE = "/images/sixthgearleftsideimg.jpg"

export default function AboutHero({
  content,
}: {
  content: AboutHeroSectionContent
}) {
  const image = resolveSanityImage(
    content.backgroundImageSource,
    content.backgroundImage || FALLBACK_IMAGE
  )

  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative w-full overflow-hidden bg-black min-h-[85vh] sm:min-h-[400px] lg:h-auto lg:aspect-[3/1] max-h-[90vh] lg:max-h-[640px]"
    >
      <Image
        src={image.url}
        alt={content.backgroundImageAlt}
        fill
        priority
        fetchPriority="high"
        quality={85}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: image.objectPosition }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"
      />

      <div className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-28 sm:px-12 sm:pb-20 lg:px-20 lg:pb-24">
        <div className="w-full max-w-4xl text-left">
          <h1
            id="about-hero-heading"
            className={`${nationalCompressed.className} mb-6 whitespace-pre-line break-words uppercase leading-[0.86] text-white text-[clamp(2.75rem,10vw,9.5rem)] sm:mb-4`}
          >
            {content.title}
          </h1>
          {content.subtitle ? (
            <p
              className={`${parkinsans.className} hidden max-w-xl text-sm leading-relaxed text-gray-200 sm:block sm:text-base`}
            >
              {content.subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
