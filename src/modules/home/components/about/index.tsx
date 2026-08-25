"use client"

import { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight } from "lucide-react"

import type { SanityAboutSection } from "@lib/cms/types"
import { outfit } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Tunable design values for this section.
 *
 * - Exact 233px desktop side padding lives in SECTION_X_PADDING (`large:` = 1440px+).
 * - Heading desktop target is 104px / 104px / -2.6px (-0.025em) / 900, reached by
 *   the clamp() max in the h2 below (the 5.7vw curve hits 104px from ~1825px
 *   viewports; at exactly 1440px it renders ~82px so the heading keeps a clean
 *   3-4 line wrap inside the text column).
 * - Body desktop target is 20px / 30px / 300.
 * - Every collage card uses the same 278/374 portrait ratio and rounded-[14px].
 * - The gallery is a fixed-height window (GALLERY_WINDOW) that crops the taller
 *   columns; white gradient overlays fade the cropped edges at top and bottom.
 * - Parallax travel is the total scroll-scrubbed distance per column; columns
 *   start offset by half the travel so movement stays inside the cropped window.
 */
const SECTION_X_PADDING =
  "px-5 xsmall:px-8 small:px-16 medium:px-24 large:px-[233px]"
const GALLERY_WINDOW =
  "h-[480px] xsmall:h-[540px] small:h-[680px] medium:h-[800px]"
const COLUMN_ONE_TRAVEL = 280 // px upward, desktop
const COLUMN_TWO_TRAVEL = 130 // px downward, desktop (slower than column one)
const MOBILE_TRAVEL_SCALE = 0.45

type CollageImage = {
  src: string
  alt: string
}

// Temporary local placeholders; swap src/alt entries here for final imagery.
const COLLAGE_COLUMNS: [CollageImage[], CollageImage[]] = [
  [
    {
      src: "/images/sixthgear-image1.jpg",
      alt: "Motorcycles being serviced inside the Sixth Gear workshop",
    },
    {
      src: "/images/sixthgear-workshop.jpg",
      alt: "Sixth Gear workshop floor lined with motorcycles",
    },
    {
      src: "/images/polaroid-marquee/satisfied-customers/003.jpg",
      alt: "Rider holding a helmet inside the Sixth Gear store",
    },
    {
      src: "/images/polaroid-marquee/satisfied-customers/009.jpg",
      alt: "Staff member preparing customer orders at the Sixth Gear shop",
    },
  ],
  [
    {
      src: "/images/firstgear-coffee/coffee-portrait.jpg",
      alt: "First Gear Coffee drink served in the cafe lounge",
    },
    {
      src: "/images/firstgear.jpg",
      alt: "Sixth Gear Moto Supply storefront with First Gear Coffee signage",
    },
    {
      src: "/images/polaroid-marquee/satisfied-customers/016.jpg",
      alt: "Customer with a new purchase at the Sixth Gear counter",
    },
    {
      src: "/images/polaroid-marquee/satisfied-customers/013.jpg",
      alt: "Customer picking up gear in the Sixth Gear cafe lounge",
    },
  ],
]

// Static supporting paragraphs rendered after the CMS-driven description.
const EXTRA_BODY_PARAGRAPHS = [
  "From routine maintenance and diagnostics to performance upgrades and detailing, every job is handled by mechanics who ride daily and treat your machine like their own.",
  "Drop by our Makati shop to browse the latest gear, book a service, or settle in with a cup from First Gear Coffee.",
]

const FALLBACK_ABOUT_SECTION: SanityAboutSection = {
  useCustomAbout: false,
  kicker: "About Us",
  title: "We Offer Complete Diagnostics for Your Motorcycle",
  description:
    "Sixth Gear Moto Supply Café + Lounge is a rider-built motorcycle hub combining professional workshop service, premium accessories, riding gear, detailing, performance upgrades, and a relaxed café experience powered by First Gear Coffee.",
  highlights: [
    "Motorcycle Service and Advanced Diagnostics",
    "Parts Accessories Luggage and Communications",
    "Helmets Riding Gear and Apparel",
    "Café Lounge and Rider Community",
  ],
  primaryCta: {
    text: "More About Us",
    link: "/about",
  },
  imageTop: "/images/homepage/about/about_bg.png",
  imageBottom: "/images/homepage/about/about-small.png",
  videoUrl: "#",
}

interface AboutSectionProps {
  data?: SanityAboutSection | null
  kicker?: string
  title?: string
  description?: string
  highlights?: string[]
  primaryCta?: {
    text: string
    link: string
  }
  imageTop?: string | null
  imageBottom?: string | null
  videoUrl?: string | null
}

const AboutSection = ({ data, ...legacyProps }: AboutSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null)
  const columnOneRef = useRef<HTMLDivElement>(null)
  const columnTwoRef = useRef<HTMLDivElement>(null)
  const isCMSDisabled = data?.useCustomAbout === false

  // Merge precedence: Sanity -> legacy source -> local fallback.
  const mergedContent = {
    kicker: isCMSDisabled
      ? legacyProps.kicker || FALLBACK_ABOUT_SECTION.kicker
      : data?.kicker || legacyProps.kicker || FALLBACK_ABOUT_SECTION.kicker,
    description: isCMSDisabled
      ? legacyProps.description || FALLBACK_ABOUT_SECTION.description
      : data?.description ||
        legacyProps.description ||
        FALLBACK_ABOUT_SECTION.description,
  }

  useGSAP(
    () => {
      const media = gsap.matchMedia()

      media.add(
        {
          canAnimate: "(prefers-reduced-motion: no-preference)",
          isCompact: "(max-width: 1023px)",
        },
        (context) => {
          const { canAnimate, isCompact } = context.conditions as {
            canAnimate: boolean
            isCompact: boolean
          }

          if (!canAnimate) return

          const section = sectionRef.current
          const columnOne = columnOneRef.current
          const columnTwo = columnTwoRef.current

          if (!section || !columnOne || !columnTwo) return

          const scale = isCompact ? MOBILE_TRAVEL_SCALE : 1
          const columnOneShift = (COLUMN_ONE_TRAVEL / 2) * scale
          const columnTwoShift = (COLUMN_TWO_TRAVEL / 2) * scale

          // Column one drifts upward; column two drifts downward more slowly.
          gsap.fromTo(
            columnOne,
            { y: columnOneShift },
            {
              y: -columnOneShift,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          )

          gsap.fromTo(
            columnTwo,
            { y: -columnTwoShift },
            {
              y: columnTwoShift,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          )
        }
      )

      return () => media.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      aria-labelledby="homepage-about-heading"
      className={`${outfit.className} overflow-hidden bg-white py-14 text-black antialiased small:py-20 medium:py-24 ${SECTION_X_PADDING}`}
    >
      <div className="mx-auto flex max-w-[1454px] flex-col gap-12 small:grid small:grid-cols-[1.1fr_1fr] small:items-start small:gap-14 medium:gap-20">
        <div className="flex flex-col items-start">
          <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-700">
            {mergedContent.kicker}
          </span>

          <h2
            id="homepage-about-heading"
            className="mt-6 text-[clamp(2.5rem,5.7vw,6.5rem)] font-black uppercase leading-[1] tracking-[-0.025em] text-black"
          >
            Built by riders, for every ride
          </h2>

          <div className="mt-7 flex max-w-[58ch] flex-col gap-5 text-lg font-light leading-[1.5] text-black small:text-xl small:leading-[1.5]">
            <p>{mergedContent.description}</p>
            <p className="font-medium">{EXTRA_BODY_PARAGRAPHS[0]}</p>
            <p>{EXTRA_BODY_PARAGRAPHS[1]}</p>
          </div>

          <LocalizedClientLink
            href="/about"
            className="group mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#111111] py-1.5 pl-7 pr-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#f15a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
          >
            Learn more
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111111] transition-transform duration-300 group-hover:rotate-45"
            >
              <ArrowUpRight size={18} strokeWidth={2} />
            </span>
          </LocalizedClientLink>
        </div>

        <div className={`relative overflow-hidden ${GALLERY_WINDOW}`}>
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {COLLAGE_COLUMNS.map((column, columnIndex) => (
              <div
                key={`about-collage-column-${columnIndex}`}
                ref={columnIndex === 0 ? columnOneRef : columnTwoRef}
                className={`flex flex-col gap-4 will-change-transform sm:gap-5 ${
                  columnIndex === 0 ? "-mt-36" : "-mt-[290px]"
                }`}
              >
                {column.map((image) => (
                  <figure
                    key={image.src}
                    className="relative aspect-[278/374] w-full flex-none overflow-hidden rounded-[14px] bg-neutral-100"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1023px) 44vw, (max-width: 1919px) 22vw, 320px"
                    />
                  </figure>
                ))}
              </div>
            ))}
          </div>

          {/* White fades covering the cropped column edges. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white to-transparent sm:h-24"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-white to-transparent sm:h-24"
          />
        </div>
      </div>
    </section>
  )
}

export default AboutSection
