"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import {
  BadgeCheck,
  ClipboardCheck,
  MessageSquareText,
  Wrench,
} from "lucide-react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import type { ServicesProcessContent } from "@lib/cms/services-page-content"
import { outfit } from "@lib/fonts"
import {
  cleanSanityString,
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const LEGACY_PROCESS_HEADING = "Sixthgear process of work"
const REVISED_PROCESS_HEADING =
  "Building better rides through careful workmanship."

const PROCESS_MEDIA = [
  {
    imageUrl: "/images/services/service1.png",
    imageAlt: "Motorcycle consultation and service intake at Sixthgear",
    icon: MessageSquareText,
  },
  {
    imageUrl: "/images/services/service2.png",
    imageAlt: "Motorcycle inspection and work planning at Sixthgear",
    icon: ClipboardCheck,
  },
  {
    imageUrl: "/images/services/service5.png",
    imageAlt: "Motorcycle workshop service being completed at Sixthgear",
    icon: Wrench,
  },
  {
    imageUrl: "/images/services/service4.png",
    imageAlt: "Final motorcycle check and handover at Sixthgear",
    icon: BadgeCheck,
  },
] as const

export default function ProcessOfWork({
  content,
}: {
  content: ServicesProcessContent
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"
  const sourceHeading = cleanSanityString(content.sectionHeading)
  const sectionHeading =
    sourceHeading.trim().toLowerCase() === LEGACY_PROCESS_HEADING.toLowerCase()
      ? REVISED_PROCESS_HEADING
      : sourceHeading

  useGSAP(
    () => {
      const section = sectionRef.current
      const viewport = viewportRef.current
      const track = trackRef.current

      if (!section || !viewport || !track || content.steps.length < 2) return

      const media = gsap.matchMedia()

      media.add(
        {
          desktop: "(min-width: 1024px)",
          canAnimate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const desktop = Boolean(context.conditions?.desktop)
          const canAnimate = Boolean(context.conditions?.canAnimate)

          if (!desktop || !canAnimate) {
            gsap.set(track, { clearProps: "transform" })
            return
          }

          const getTravel = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth)

          gsap.to(track, {
            x: () => -getTravel(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom bottom",
              end: () =>
                `+=${Math.max(getTravel() * 1.12, window.innerHeight * 1.5)}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          const refreshFrame = window.requestAnimationFrame(() => {
            ScrollTrigger.refresh()
          })

          return () => window.cancelAnimationFrame(refreshFrame)
        }
      )

      return () => media.revert()
    },
    {
      scope: sectionRef,
      dependencies: [content.steps.length],
    }
  )

  if (content.steps.length === 0) return null

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-process-heading"
      className={`${outfit.className} flex w-full flex-col justify-center overflow-hidden bg-white py-20 text-[#151515] md:py-24 lg:min-h-[100svh] lg:py-10`}
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 text-center sm:px-8 lg:px-12">
        <h2
          id="services-process-heading"
          className="mx-auto max-w-[22ch] text-balance uppercase text-[40px] font-semibold leading-[48px] tracking-[-2px] sm:text-[56px] sm:leading-[67.2px] sm:tracking-[-2.8px]"
        >
          {sectionHeading}
        </h2>
      </div>

      <div
        ref={viewportRef}
        className="mt-12 w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-14 lg:overflow-visible"
      >
        <ol
          ref={trackRef}
          className="flex w-max snap-x snap-mandatory gap-4 px-5 sm:gap-6 sm:px-8 lg:gap-7 lg:px-0 lg:pl-[max(2.5rem,calc((100vw-960px)/2))] lg:pr-[max(2.5rem,calc((100vw-960px)/2))]"
        >
          {content.steps.map((step, index) => {
            const media = PROCESS_MEDIA[index % PROCESS_MEDIA.length]
            const Icon = media.icon

            return (
              <li
                key={step.key}
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "servicesPage",
                        documentType: "servicesPage",
                        path: keyedSanityPath("processOfWork.steps", step.key),
                      })
                    : undefined
                }
                className="grid h-[min(680px,72vh)] min-h-[560px] w-[calc(100vw-2.5rem)] max-w-[960px] shrink-0 snap-center grid-rows-[minmax(240px,1fr)_auto] gap-0 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white p-2.5 sm:w-[calc(100vw-4rem)] lg:h-[min(580px,58vh)] lg:min-h-[430px] lg:w-[960px] lg:grid-cols-[1.02fr_0.98fr] lg:grid-rows-1"
              >
                <div className="relative min-h-0 overflow-hidden rounded-[16px] bg-[#dedbd4]">
                  <Image
                    src={media.imageUrl}
                    alt={media.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex min-h-0 flex-col justify-between px-5 py-7 sm:px-8 sm:py-9 lg:p-[clamp(2.25rem,3.2vw,3.75rem)]">
                  <div>
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.55}
                      className="h-14 w-14 text-[#F16D34]"
                    />
                    <h3 className="mt-7 max-w-[16ch] text-[28px] font-medium leading-[33.6px] tracking-[-0.84px]">
                      {cleanSanityString(step.title)}
                    </h3>
                    <p className="mt-4 max-w-[43ch] text-[16px] font-normal leading-[24px] tracking-[-0.16px] text-black/[0.58]">
                      {cleanSanityString(step.description)}
                    </p>
                  </div>

                  <Link
                    href="/about"
                    className="mt-8 inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-[#f4f3f1] px-7 py-3 text-sm font-medium tracking-[-0.14px] text-black transition-colors duration-200 hover:bg-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#F16D34]"
                  >
                    About Us
                  </Link>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
