/**
 * About hero: rounded photo frame inside the page container, copy over a dark
 * bottom gradient. The frame grows with its content, so the H1 never clips.
 */

import Image from "next/image"

import type { AboutHeroSectionContent } from "@lib/cms/about-page-main"
import { inter, nationalCompressed } from "@lib/fonts"
import { resolveSanityImage } from "@lib/util/sanity-image"
import { ABOUT_CONTAINER } from "@modules/about/constants"

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
    <section aria-labelledby="about-hero-heading" className="bg-white pt-3 md:pt-5">
      <div className={ABOUT_CONTAINER}>
        <div className="relative isolate flex min-h-[540px] flex-col justify-end overflow-hidden rounded-[20px] bg-[#0A0A0A] md:min-h-[620px] lg:min-h-[min(80vh,820px)]">
          <Image
            src={image.url}
            alt={content.backgroundImageAlt}
            fill
            priority
            sizes="(max-width: 1760px) 100vw, 1632px"
            className="-z-10 object-cover"
            style={{ objectPosition: image.objectPosition }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
          />

          <div className="px-5 pb-8 pt-32 sm:px-8 sm:pb-10 lg:px-14 lg:pb-14">
            <p
              className={`${inter.className} text-xs font-semibold uppercase tracking-[0.18em] text-white/80 md:text-sm`}
            >
              {content.eyebrow}
            </p>
            <h1
              id="about-hero-heading"
              className={`${nationalCompressed.className} mt-4 whitespace-pre-line break-words uppercase leading-[0.86] text-white text-[clamp(2.75rem,10vw,9.5rem)]`}
            >
              {content.title}
            </h1>
            {content.subtitle ? (
              <p
                className={`${inter.className} mt-5 max-w-[60ch] text-base leading-relaxed text-white/80 md:mt-6 md:text-lg`}
              >
                {content.subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
