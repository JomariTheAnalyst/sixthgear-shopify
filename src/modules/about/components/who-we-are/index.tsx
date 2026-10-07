"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import type { AboutWhoWeAreSectionContent } from "@lib/cms/about-page-main"
import { resolveSanityImage } from "@lib/util/sanity-image"
import { ABOUT_CONTAINER, ABOUT_PROSE } from "@modules/about/constants"
import { MOTION_OK, revealFrame, riseIn } from "@modules/about/motion"
import { ABOUT_BODY, ABOUT_TITLE } from "@modules/about/styles"

gsap.registerPlugin(useGSAP)

export default function WhoWeAre({
  content,
}: {
  content: AboutWhoWeAreSectionContent
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const image = resolveSanityImage(content.imageSource, content.imageUrl)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const media = gsap.matchMedia()
      media.add(MOTION_OK, () => {
        const frame = section.querySelector("[data-frame]")
        const copy = section.querySelector("[data-copy]")
        if (frame) revealFrame(frame, section.querySelector("[data-drift]"))
        if (copy) riseIn(copy.children, copy)

        gsap.to("[data-pulse]", {
          scale: 1.45,
          opacity: 0,
          duration: 2.2,
          ease: "power1.out",
          repeat: -1,
        })
      })

      return () => media.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-who-heading"
      className="bg-white pb-20 md:pb-28 lg:pb-32"
    >
      <div
        className={`${ABOUT_CONTAINER} grid items-center gap-10 lg:grid-cols-2 lg:gap-20`}
      >
        <div
          data-frame
          className="relative aspect-square overflow-hidden rounded-[20px] bg-grey-10"
        >
          <div data-drift className="absolute inset-0">
            <Image
              src={image.url}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 1023px) 100vw, (max-width: 1760px) 50vw, 800px"
              className="object-cover"
              style={{ objectPosition: image.objectPosition }}
            />
          </div>
        </div>

        <div data-copy>
          <span
            aria-hidden="true"
            className="relative flex h-14 w-14 items-center justify-center"
          >
            <span
              data-pulse
              className="absolute inset-0 rounded-full border border-black/20"
            />
            <span className="absolute inset-[7px] rounded-full border border-black/25" />
            <span className="h-5 w-5 rounded-full border-2 border-[#1a1a1a]" />
          </span>

          <h2
            id="about-who-heading"
            className={`${ABOUT_TITLE} mt-8 text-[#1a1a1a]`}
          >
            {content.heading}{" "}
            <span className="text-[#F16D34]">{content.headingAccent}</span>
          </h2>

          {content.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className={`${ABOUT_BODY} ${ABOUT_PROSE} mt-6 text-[#1a1a1a]/75`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
