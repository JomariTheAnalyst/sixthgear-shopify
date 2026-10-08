"use client"

/**
 * About Mission Section
 * CEO quote with portrait. The underline under the highlighted phrase draws in
 * once on enter; without motion it is already drawn.
 */

import React, { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import type { AboutCeoQuoteSectionContent } from "@lib/cms/about-page-main"
import { parkinsans } from "@lib/fonts"
import { resolveSanityImage } from "@lib/util/sanity-image"
import { ABOUT_CONTAINER } from "@modules/about/constants"
import { MOTION_OK } from "@modules/about/motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

gsap.registerPlugin(useGSAP)

export default function AboutMission({
  content,
}: {
  content: AboutCeoQuoteSectionContent
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const { quoteText, highlightedPhrase, ceoName, ceoTitle, ceoPhotoDescription } =
    content
  const photo = resolveSanityImage(content.ceoPhotoSource, content.ceoPhotoUrl)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add(MOTION_OK, () => {
        const underline = sectionRef.current?.querySelector("[data-underline]")
        if (!underline) return
        gsap.fromTo(
          underline,
          { backgroundSize: "0% 2px" },
          {
            backgroundSize: "100% 2px",
            duration: 0.9,
            ease: "power2.inOut",
            scrollTrigger: { trigger: underline, start: "top 80%", once: true },
          }
        )
      })
      return () => media.revert()
    },
    { scope: sectionRef }
  )

  const renderQuoteWithHighlight = () => {
    if (!highlightedPhrase || !quoteText.includes(highlightedPhrase)) {
      return quoteText
    }

    const parts = quoteText.split(highlightedPhrase)
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span
                data-underline={index === 0 ? "" : undefined}
                className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_2px] bg-[position:0_100%] bg-no-repeat pb-0.5 font-semibold text-[#F16D34]"
              >
                {highlightedPhrase}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    )
  }

  return (
    <section
      ref={sectionRef}
      aria-label="A word from our founder"
      className={`${parkinsans.className} bg-white py-20 md:py-28 lg:py-32`}
    >
      <div className={ABOUT_CONTAINER}>
        <figure className="mx-auto max-w-4xl text-center">
          <span
            aria-hidden="true"
            className="block text-[100px] leading-none text-[#F16D34]/20 md:text-[140px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            &ldquo;
          </span>

          <blockquote className="-mt-12 text-xl leading-relaxed text-[#1a1a1a] md:-mt-16 md:text-2xl lg:text-3xl">
            {renderQuoteWithHighlight()}
          </blockquote>

          <figcaption className="mt-12 flex flex-col items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-[#F16D34]/20 md:h-24 md:w-24">
              <Image
                src={photo.url}
                alt={ceoPhotoDescription}
                fill
                sizes="96px"
                className="object-cover"
                style={{ objectPosition: photo.objectPosition }}
              />
            </div>

            <div>
              <p className="text-lg font-bold text-[#1a1a1a] md:text-xl">{ceoName}</p>
              <p className="text-sm font-medium text-[#F16D34] md:text-base">{ceoTitle}</p>
            </div>

            <LocalizedClientLink
              href="/about/ceo-story"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#191b22] px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#F16D34]"
            >
              Read Story
            </LocalizedClientLink>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
