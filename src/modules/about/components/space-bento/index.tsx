"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import type { OurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import {
  cleanSanityString,
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { parkinsans } from "@lib/fonts"
import { resolveSanityImage } from "@lib/util/sanity-image"
import { ABOUT_CONTAINER, ABOUT_PROSE } from "@modules/about/constants"
import { MOTION_OK, revealFrame } from "@modules/about/motion"
import { ABOUT_BODY, ABOUT_SUBTITLE, ABOUT_TITLE } from "@modules/about/styles"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

gsap.registerPlugin(useGSAP)

/** Large tile on the left spanning both rows; the other two stack on the right. */
const TILE_LAYOUT = [
  {
    className: "aspect-[4/5] sm:aspect-[4/3] lg:row-span-2 lg:aspect-auto",
    sizes: "(max-width: 1023px) 100vw, (max-width: 1760px) 58vw, 950px",
  },
  {
    className: "aspect-[4/3] lg:aspect-[16/10]",
    sizes: "(max-width: 1023px) 100vw, (max-width: 1760px) 42vw, 680px",
  },
  {
    className: "aspect-[4/3] lg:aspect-[16/10]",
    sizes: "(max-width: 1023px) 100vw, (max-width: 1760px) 42vw, 680px",
  },
] as const

export default function SpaceBento({
  content,
}: {
  content: OurSpaceExperienceContent
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"
  const items = content.items.slice(0, TILE_LAYOUT.length)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const media = gsap.matchMedia()
      media.add(MOTION_OK, () => {
        gsap.utils
          .toArray<HTMLElement>("[data-tile]", section)
          .forEach((tile) => revealFrame(tile))
      })

      return () => media.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-space-heading"
      data-sanity={createSanityDataAttribute(visualEditingEnabled, {
        documentId: "aboutPage",
        documentType: "aboutPage",
        path: sanitySource ? "ourSpaceExperience" : "ourSpaceExperience.useSanityContent",
      })}
      className="bg-[#0A0A0A] py-20 text-white md:py-28 lg:py-32"
    >
      <div className={ABOUT_CONTAINER}>
        <header className={`${ABOUT_PROSE} mx-auto text-center`}>
          <h2 id="about-space-heading" className={ABOUT_TITLE}>
            {content.sectionTitle}
          </h2>
          <p className={`${ABOUT_BODY} mt-5 text-white/70`}>
            {content.sectionDescription}
          </p>
        </header>

        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
          {items.map((item, index) => {
            const layout = TILE_LAYOUT[index]
            const image = resolveSanityImage(
              item.imageSource,
              cleanSanityString(item.imageUrl)
            )
            const itemPath = keyedSanityPath("ourSpaceExperience.items", item.key)

            return (
              <article
                key={item.key}
                data-tile
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "aboutPage",
                        documentType: "aboutPage",
                        path: itemPath,
                      })
                    : undefined
                }
                className={`group relative isolate overflow-hidden rounded-[20px] bg-white/5 ${layout.className}`}
              >
                <Image
                  src={image.url}
                  alt={item.imageAlt}
                  data-sanity={
                    sanitySource
                      ? createSanityDataAttribute(visualEditingEnabled, {
                          documentId: "aboutPage",
                          documentType: "aboutPage",
                          path: `${itemPath}.image`,
                        })
                      : undefined
                  }
                  fill
                  sizes={layout.sizes}
                  className="-z-10 object-cover transition-transform duration-700 ease-out motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
                  style={{ objectPosition: image.objectPosition }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 lg:p-8">
                  <h3 className={`${ABOUT_SUBTITLE} text-[clamp(1.75rem,2.6vw,2.75rem)]`}>
                    {item.title}
                  </h3>
                  <p
                    className={`${parkinsans.className} mt-2 max-w-[48ch] text-sm leading-relaxed text-white/75 md:text-base`}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
