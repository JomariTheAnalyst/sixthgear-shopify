"use client"

import React, { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { inter, montserrat } from "@lib/fonts"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { SanityWhatWeOffer } from "@lib/cms/types"
import {
  selectWhatWeOfferContent,
  type WhatWeOfferContent,
} from "@lib/cms/what-we-offer"
import { cleanSanityHref, cleanSanityString, createSanityDataAttribute, keyedSanityPath } from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

interface AboutServicesProps {
  data?: SanityWhatWeOffer | null
}

export default function WhatWeOffer({ data }: AboutServicesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const content = selectWhatWeOfferContent(data)
  const sectionName = content.sectionName
  const heading = content.heading
  const cards = content.cards
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sectionTarget = createSanityDataAttribute(visualEditingEnabled, {
    documentId: "homepage",
    documentType: "homepage",
    path: content.source === "sanity" ? "whatWeOffer" : "whatWeOffer.useSanityContent",
  })

  const headingParts = heading.split("\n")

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const offset = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  const renderCard = (service: WhatWeOfferContent["cards"][number]) => {
    const itemPath = keyedSanityPath("whatWeOffer.cards", service.key)
    const itemTarget = content.source === "sanity"
      ? createSanityDataAttribute(visualEditingEnabled, {
          documentId: "homepage",
          documentType: "homepage",
          path: itemPath,
        })
      : undefined
    return (
      <Link
        key={service.key}
        href={cleanSanityHref(service.linkUrl)}
        data-sanity={itemTarget}
        className="group relative flex-none w-[85vw] sm:w-[400px] lg:w-[450px] xl:w-[480px] min-h-[500px] lg:min-h-[650px] snap-center overflow-hidden bg-black"
      >
        <Image
          src={cleanSanityString(service.backgroundImage)}
          alt={service.imageAlt}
          data-sanity={content.source === "sanity" ? createSanityDataAttribute(visualEditingEnabled, {
            documentId: "homepage",
            documentType: "homepage",
            path: `${itemPath}.backgroundImage`,
          }) : undefined}
          fill
          quality={90}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center">
          <h3
            className={`text-2xl md:text-3xl text-white font-black uppercase leading-tight mb-6 tracking-wide ${montserrat.className}`}
          >
            {service.title}
          </h3>
          <button
            className={`bg-white text-black text-xs md:text-sm font-bold uppercase tracking-[0.2em] px-8 py-3 w-fit hover:bg-gray-100 transition-colors ${inter.className}`}
          >
            {service.buttonText}
          </button>
        </div>
      </Link>
    )
  }

  return (
    <section data-sanity={sectionTarget} className="bg-[#1a1a1a] py-20 md:py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 relative z-10 w-full">
        <div className="text-center mb-16 md:mb-20">
          <span
            className={`text-[#F16D34] text-sm md:text-base font-semibold uppercase tracking-widest ${inter.className}`}
          >
            {sectionName}
          </span>

          <h2
            className={`text-4xl md:text-5xl lg:text-6xl text-white font-bold uppercase leading-[1.1] mt-4 ${montserrat.className}`}
          >
            {headingParts.map((part, index) => (
              <span key={index}>
                {index === headingParts.length - 1 ? (
                  <span className="text-[#F16D34]">{part}</span>
                ) : (
                  <>
                    {part}
                    <br />
                  </>
                )}
              </span>
            ))}
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide"
        >
          {cards.map((card) => renderCard(card))}
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={() => scroll("left")}
            className="p-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}
