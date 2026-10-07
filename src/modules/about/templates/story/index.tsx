"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import type { AboutStorySectionContent } from "@lib/cms/about-page-main"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { resolveSanityImage } from "@lib/util/sanity-image"
import { ABOUT_CONTAINER, ABOUT_PROSE } from "@modules/about/constants"
import { MOTION_OK, revealFrame, riseIn } from "@modules/about/motion"
import {
  ABOUT_BODY,
  ABOUT_EYEBROW,
  ABOUT_SUBTITLE,
  ABOUT_TITLE,
} from "@modules/about/styles"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

export interface AboutStoryProps {
  content: AboutStorySectionContent
}

gsap.registerPlugin(useGSAP)

export default function AboutStory({ content }: AboutStoryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const media = gsap.matchMedia()
      media.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-story-row]", section).forEach((row) => {
          const frame = row.querySelector("[data-frame]")
          if (frame) revealFrame(frame, row.querySelector("[data-drift]"))

          const points = row.querySelectorAll("[data-point]")
          if (points.length) riseIn(points, points[0], 0.14)
        })
      })

      return () => media.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-story-heading"
      className="bg-white py-20 md:py-28 lg:py-32"
    >
      <div className={ABOUT_CONTAINER}>
        <header className={ABOUT_PROSE}>
          <p className={ABOUT_EYEBROW}>{content.eyebrow}</p>
          <h2 id="about-story-heading" className={`${ABOUT_TITLE} mt-4 text-[#1a1a1a]`}>
            {content.heading}
          </h2>
          <p className={`${ABOUT_BODY} mt-5 text-[#1a1a1a]/70`}>{content.lede}</p>
        </header>

        <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24 lg:gap-32">
          {content.items.map((item, index) => {
            const imageLeft = index % 2 === 0
            const image = resolveSanityImage(item.imageSource, item.imageUrl)
            const itemPath = keyedSanityPath("ourStory.items", item.key)

            return (
              <article
                key={item.key}
                data-story-row
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "aboutPage",
                        documentType: "aboutPage",
                        path: itemPath,
                      })
                    : undefined
                }
                className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20"
              >
                <div
                  data-frame
                  className={`relative aspect-[4/3] overflow-hidden rounded-[20px] bg-grey-10 md:aspect-[4/5] ${
                    imageLeft ? "" : "md:order-2"
                  }`}
                >
                  <div data-drift className="absolute inset-0">
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
                      sizes="(max-width: 767px) 100vw, (max-width: 1760px) 50vw, 800px"
                      className="object-cover"
                      style={{ objectPosition: image.objectPosition }}
                    />
                  </div>
                </div>

                <div className={imageLeft ? "" : "md:order-1"}>
                  <h3
                    className={`${ABOUT_SUBTITLE} text-[clamp(2.25rem,4vw,4rem)] text-[#1a1a1a]`}
                  >
                    {item.heading}
                  </h3>

                  {item.points?.length ? (
                    <>
                      {item.lead ? (
                        <p className={`${ABOUT_BODY} ${ABOUT_PROSE} mt-5 text-[#1a1a1a]/75`}>
                          {item.lead}
                        </p>
                      ) : null}
                      <ul
                        className={`${ABOUT_BODY} ${ABOUT_PROSE} mt-7 divide-y divide-black/10 border-y border-black/10 text-[#1a1a1a]`}
                      >
                        {item.points.map((point) => (
                          <li key={point} data-point className="flex gap-4 py-4">
                            <span
                              aria-hidden="true"
                              className="mt-[0.8em] h-0.5 w-4 shrink-0 bg-[#F16D34]"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className={`${ABOUT_BODY} ${ABOUT_PROSE} mt-5 text-[#1a1a1a]/75`}>
                      {item.body}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
