"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { ServicesGridContent } from "@lib/cms/services-page-content"
import { outfit } from "@lib/fonts"
import {
  cleanSanityString,
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

type ModernServicesGridProps = {
  countryCode: string
  content: ServicesGridContent
}

const LEGACY_SECTION_HEADING = "Complete care for your ride"
const REVISED_SECTION_HEADING = "Everything your ride needs, handled right"
const SECTION_DESCRIPTION =
  "From regular PMS and diagnostics to upgrades and detailing, our team takes care of the work properly—so you can ride out confident and ready."

export default function ModernServicesGrid({
  countryCode,
  content,
}: ModernServicesGridProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"
  const sourceHeading = cleanSanityString(content.sectionHeading)
  const sectionHeading =
    sourceHeading.trim().toLowerCase() ===
    LEGACY_SECTION_HEADING.toLowerCase()
      ? REVISED_SECTION_HEADING
      : sourceHeading

  const updateCarouselControls = useCallback(() => {
    const rail = railRef.current
    if (!rail) return

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth
    setCanScrollLeft(rail.scrollLeft > 2)
    setCanScrollRight(maxScrollLeft - rail.scrollLeft > 2)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    updateCarouselControls()
    rail.addEventListener("scroll", updateCarouselControls, { passive: true })

    const resizeObserver = new ResizeObserver(updateCarouselControls)
    resizeObserver.observe(rail)

    return () => {
      rail.removeEventListener("scroll", updateCarouselControls)
      resizeObserver.disconnect()
    }
  }, [content.services.length, updateCarouselControls])

  const scrollCarousel = (direction: "left" | "right") => {
    const rail = railRef.current
    const firstCard = rail?.querySelector<HTMLElement>("[data-service-card]")

    if (!rail || !firstCard) return

    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0
    const distance = firstCard.getBoundingClientRect().width + gap
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    rail.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <section
      aria-labelledby="services-carousel-heading"
      className={`${outfit.className} w-full overflow-hidden bg-white py-20 text-[#151515] md:py-28`}
    >
      <header className="mx-auto grid max-w-[1400px] gap-7 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)] lg:items-end lg:gap-16 lg:px-12">
        <h2
          id="services-carousel-heading"
          className="text-balance uppercase text-[clamp(1.75rem,3vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em]"
        >
          {sectionHeading}
        </h2>
        <p className="max-w-[650px] text-sm leading-6 text-black/[0.62] sm:text-base sm:leading-7">
          {SECTION_DESCRIPTION}
        </p>
      </header>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Motorcycle services"
        className="mt-12 w-full md:mt-16"
      >
        <div
          ref={railRef}
          className="scrollbar-hide ml-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 sm:ml-8 sm:gap-5 lg:ml-[max(48px,calc((100vw-1400px)/2+48px))] lg:gap-6"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {content.services.map((service) => {
            const title = cleanSanityString(service.title)
            const description = cleanSanityString(service.description)
            const slug = cleanSanityString(service.slug)
            const itemTarget =
              sanitySource && content.useCustomServices
                ? createSanityDataAttribute(visualEditingEnabled, {
                    documentId: "servicesPage",
                    documentType: "servicesPage",
                    path: keyedSanityPath(
                      "servicesGrid.featuredServices",
                      service.key
                    ),
                  })
                : sanitySource && service.documentId
                  ? createSanityDataAttribute(visualEditingEnabled, {
                      documentId: service.documentId,
                      documentType: "service",
                      path: "title",
                    })
                  : undefined

            return (
              <article
                key={service.key}
                data-service-card
                data-sanity={itemTarget}
                className="group flex basis-[84vw] shrink-0 snap-start flex-col sm:basis-[68vw] md:basis-[46vw] lg:basis-[36vw] xl:basis-[31vw] 2xl:basis-[400px] 2xl:max-w-[430px]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#eceae6]">
                  <Image
                    src={cleanSanityString(service.imageUrl)}
                    alt={cleanSanityString(service.imageAlt)}
                    fill
                    sizes="(max-width: 639px) 84vw, (max-width: 767px) 68vw, (max-width: 1023px) 46vw, (max-width: 1279px) 36vw, 430px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                </div>

                <div className="pt-5">
                  <Link
                    href={`/${countryCode}/services/${slug}`}
                    aria-label={`View ${title} service details`}
                    className="group/service-link block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F16D34]"
                  >
                    <h3 className="text-xl font-semibold leading-[1.12] tracking-[-0.025em] transition-colors duration-200 group-hover/service-link:text-[#F16D34] sm:text-2xl">
                      {title}
                    </h3>
                    <p className="mt-3 line-clamp-3 max-w-[42ch] text-sm leading-6 text-black/[0.62] transition-colors duration-200 group-hover/service-link:text-black/[0.78] sm:text-[15px]">
                      {description}
                    </p>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-[1400px] items-center gap-3 px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            disabled={!canScrollLeft}
            aria-label="Previous services"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.14] bg-white text-black transition-[background-color,color,transform,opacity] duration-200 hover:bg-black hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#F16D34] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
          >
            <ChevronLeft aria-hidden="true" size={19} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            disabled={!canScrollRight}
            aria-label="Next services"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.14] bg-white text-black transition-[background-color,color,transform,opacity] duration-200 hover:bg-black hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#F16D34] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
          >
            <ChevronRight aria-hidden="true" size={19} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  )
}
