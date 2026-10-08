"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import type { AboutStorySectionContent } from "@lib/cms/about-page-main"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { resolveSanityImage } from "@lib/util/sanity-image"
import CalBookingTrigger from "@modules/booking/components/cal-booking-trigger"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { riseIn } from "@modules/about/motion"
import { ABOUT_BODY, ABOUT_TITLE } from "@modules/about/styles"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export interface AboutStoryProps {
  content: AboutStorySectionContent
}

/** Must match the md:motion-safe: classes below, which lay out the pinned stage. */
const PIN_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"
const PHONE_QUERY = "(max-width: 767px) and (prefers-reduced-motion: no-preference)"

/** Hidden-until-wiped state for slides after the first. */
const CLIP_HIDDEN = "inset(100% 0% 0% 0%)"
const CLIP_SHOWN = "inset(0% 0% 0% 0%)"

const BUTTON =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-sm"

/**
 * Our Story as a full-bleed photo slider.
 *
 * Tablet/desktop with motion: the section pins for (slides - 1) screens; each
 * scroll screen wipes the next slide up over the last (clip-path, scrubbed, so
 * scrolling up plays it back down) and snaps to whole slides. Phones and
 * reduced motion: the same cards stacked, no pin (phones get a light reveal).
 * The pinned layout is CSS (md:motion-safe:), so nothing jumps before JS; JS
 * only sets --story-offset so the frame clears the sticky header.
 */
export default function AboutStory({ content }: AboutStoryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)
  const count = content.items.length

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", section)
      const media = gsap.matchMedia()

      media.add(PIN_QUERY, () => {
        if (slides.length < 2) return
        setPinned(true)

        // The pinned frame starts below the sticky header (announcement bar + nav).
        const header = document.querySelector<HTMLElement>("header")
        const setOffset = () =>
          section.style.setProperty(
            "--story-offset",
            `${Math.max(0, Math.round(header?.getBoundingClientRect().bottom ?? 0))}px`
          )
        setOffset()
        const headerObserver = new ResizeObserver(setOffset)
        if (header) headerObserver.observe(header)

        const steps = slides.length - 1
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${steps * window.innerHeight}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / steps,
              duration: { min: 0.2, max: 0.45 },
              delay: 0.05,
              ease: "power1.inOut",
            },
            onUpdate: (self) => setActive(Math.round(self.progress * steps)),
          },
        })

        slides.slice(1).forEach((slide, index) => {
          const copy = slide.querySelector("[data-copy]")
          timeline.fromTo(slide, { clipPath: CLIP_HIDDEN }, { clipPath: CLIP_SHOWN, duration: 1 }, index)
          if (copy) {
            timeline.fromTo(
              copy,
              { y: 48, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
              index + 0.35
            )
          }
        })

        return () => {
          headerObserver.disconnect()
          section.style.removeProperty("--story-offset")
          setPinned(false)
          setActive(0)
        }
      })

      media.add(PHONE_QUERY, () => {
        slides.forEach((slide) => riseIn(slide, slide))
      })

      return () => media.revert()
    },
    { scope: sectionRef, dependencies: [count] }
  )

  if (count === 0) return null

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-story-heading"
      className="bg-white py-20 md:py-28 lg:py-32 md:motion-safe:h-screen md:motion-safe:pb-3 md:motion-safe:pt-[calc(var(--story-offset,88px)+0.75rem)]"
    >
      <h2 id="about-story-heading" className="sr-only">
        {content.heading}
      </h2>

      {/* Near full width: small gutters only. */}
      <div className="mx-auto w-full px-3 sm:px-4 lg:px-5 md:motion-safe:h-full">
        <div className="flex flex-col gap-4 md:gap-5 md:motion-safe:relative md:motion-safe:block md:motion-safe:h-full md:motion-safe:overflow-hidden md:motion-safe:rounded-[4px] md:motion-safe:bg-[#0A0A0A]">
          {content.items.map((item, index) => {
            const image = resolveSanityImage(item.imageSource, item.imageUrl)
            const itemPath = keyedSanityPath("ourStory.items", item.key)
            // Pinned: only the slide on screen takes keyboard focus.
            const tabIndex = pinned && index !== active ? -1 : undefined

            return (
              <article
                key={item.key}
                data-slide
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "aboutPage",
                        documentType: "aboutPage",
                        path: itemPath,
                      })
                    : undefined
                }
                className={`relative isolate flex h-[70vh] min-h-[460px] flex-col justify-end overflow-hidden rounded-[4px] bg-[#0A0A0A] md:h-[clamp(520px,80vh,900px)] md:motion-safe:absolute md:motion-safe:inset-0 md:motion-safe:h-full md:motion-safe:min-h-0 md:motion-safe:rounded-none ${
                  index > 0 ? "md:motion-safe:[clip-path:inset(100%_0%_0%_0%)]" : ""
                }`}
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
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  className="-z-10 object-cover"
                  style={{ objectPosition: image.objectPosition }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
                />

                <p
                  aria-hidden="true"
                  className={`${ABOUT_BODY} absolute right-5 top-5 font-semibold tabular-nums tracking-[0.12em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.45)] sm:right-8 sm:top-7 lg:right-12 lg:top-10`}
                >
                  {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </p>

                <div data-copy className="px-5 pb-8 [text-shadow:0_1px_14px_rgba(0,0,0,0.35)] sm:px-8 sm:pb-10 lg:px-14 lg:pb-14">
                  <h3 className={`${ABOUT_TITLE} max-w-[14ch] text-white`}>
                    {item.heading}
                  </h3>
                  <p
                    className={`${ABOUT_BODY} mt-4 line-clamp-2 max-w-[50ch] text-white/85 md:mt-5`}
                  >
                    {item.lead || item.body}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
                    <LocalizedClientLink
                      href="/store"
                      tabIndex={tabIndex}
                      className={`${BUTTON} bg-white text-[#1a1a1a] hover:bg-[#F16D34] hover:text-white`}
                    >
                      Shop now
                    </LocalizedClientLink>
                    <CalBookingTrigger
                      tabIndex={tabIndex}
                      className={`${BUTTON} border border-white/70 text-white hover:border-white hover:bg-white hover:text-[#1a1a1a]`}
                    >
                      Book a service
                    </CalBookingTrigger>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
