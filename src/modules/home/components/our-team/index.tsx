"use client"

import { useRef } from "react"
import Image from "next/image"
import { inter, montserrat } from "@lib/fonts"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { SanityOurTeamSectionQueryResult } from "@lib/cms/types"
import {
  FALLBACK_OUR_TEAM_CONTENT,
  selectOurTeamContent,
  type OurTeamContent,
} from "@lib/cms/our-team"
import { cleanSanityString, createSanityDataAttribute, keyedSanityPath } from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

interface TeamMember {
  id: number
  name: string
  role: string
  title: string
  description: string
  image: string
}

interface OurTeamProps {
  data?: SanityOurTeamSectionQueryResult | null
  sectionTitle?: string | null
  sectionDescription?: string | null
  teamMembers?: TeamMember[] | null
}

export default function OurTeam({
  data,
  sectionTitle,
  sectionDescription,
  teamMembers,
}: OurTeamProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const legacyContent: OurTeamContent = {
    source: "fallback",
    sectionTitle: sectionTitle || FALLBACK_OUR_TEAM_CONTENT.sectionTitle,
    sectionDescription:
      sectionDescription || FALLBACK_OUR_TEAM_CONTENT.sectionDescription,
    teamMembers:
      teamMembers && teamMembers.length > 0
        ? teamMembers.map((member) => ({
            key: String(member.id),
            name: member.name,
            role: member.role,
            title: member.title,
            description: member.description,
            image: member.image,
            imageAlt: member.name,
          }))
        : FALLBACK_OUR_TEAM_CONTENT.teamMembers,
  }
  const content = data !== undefined ? selectOurTeamContent(data) : legacyContent
  const activeTitle = content.sectionTitle
  const activeDescription = content.sectionDescription
  const activeMembers = content.teamMembers
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const isMobile = window.innerWidth < 768
      const scrollAmount = isMobile 
        ? scrollContainerRef.current.clientWidth 
        : scrollContainerRef.current.clientWidth / 3
        
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section data-sanity={createSanityDataAttribute(visualEditingEnabled, {
      documentId: "homepage",
      documentType: "homepage",
      path: sanitySource ? "ourTeamSection" : "ourTeamSection.useSanityContent",
    })} className="relative">
      {/* Top Paper Cut */}
      <div className="w-full -mb-1 relative z-10">
        <Image
          src="/images/polaroid-marquee/top.svg"
          alt=""
          width={1600}
          height={120}
          className="w-full h-auto block"
        />
      </div>

      {/* Main Section */}
      <div className="bg-[#0A0A0A] relative overflow-hidden">
        <div className="py-16 md:py-24 lg:py-28">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            
            {/* Header */}
            <div className="mb-10 text-center md:mb-12 lg:mb-14">
              <div className="flex justify-center mb-4">
              </div>
              <h2
                className={`${montserrat.className} whitespace-nowrap text-[clamp(1.85rem,4.15vw,3.65rem)] font-black leading-[0.9] tracking-[-0.05em] text-white`}
              >
                {activeTitle}
              </h2>
              <p
                className={`${inter.className} mx-auto mt-4 max-w-[760px] text-base font-medium leading-[1.35] tracking-[-0.02em] text-white/70 md:text-xl lg:text-2xl whitespace-pre-line`}
              >
                {activeDescription}
              </p>
            </div>

            {/* Carousel Container */}
            <div className="relative group">
              {/* Left Arrow */}
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 md:-left-6 top-[40%] text-[#0A0A0A] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 md:-right-6 top-[40%] text-[#0A0A0A] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Scroll Area */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide px-2"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {activeMembers.map((member) => (
                  <div
                    key={member.key}
                    data-sanity={sanitySource ? createSanityDataAttribute(visualEditingEnabled, {
                      documentId: "homepage",
                      documentType: "homepage",
                      path: keyedSanityPath("ourTeamSection.teamMembers", member.key),
                    }) : undefined}
                    className="snap-center flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  >
                    <div className="bg-[#eeeeee] rounded-3xl overflow-hidden h-full flex flex-col group/card shadow-lg hover:shadow-2xl hover:shadow-[#fca311]/5 border border-transparent hover:border-[#fca311]/10 transition-all duration-500">
                      
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#eeeeee]">
                        <Image
                          src={cleanSanityString(member.image)}
                          alt={member.imageAlt}
                          data-sanity={sanitySource ? createSanityDataAttribute(visualEditingEnabled, {
                            documentId: "homepage",
                            documentType: "homepage",
                            path: `${keyedSanityPath("ourTeamSection.teamMembers", member.key)}.photo`,
                          }) : undefined}
                          fill
                          sizes="(max-width: 639px) 85vw, (max-width: 1023px) 50vw, 33vw"
                          className="object-cover grayscale opacity-95 transition-all duration-700 group-hover/card:scale-105"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/20 to-transparent mix-blend-multiply" />
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>

                      {/* Content Section (White Bottom Card) */}
                      <div className="px-6 py-8 md:py-10 text-center bg-[#eeeeee] flex flex-col flex-grow items-center justify-center -mt-2 relative z-10 rounded-t-3xl">
                        <h3
                          className={`${montserrat.className} text-[22px] font-bold tracking-tight text-[#111111] mb-1.5`}
                        >
                          {member.name}
                        </h3>
                        <p
                          className={`${inter.className} text-[#555555] font-semibold text-[15px] mb-4`}
                        >
                          {member.role}
                        </p>
                        <p
                          className={`${inter.className} text-[13px] text-gray-400 leading-relaxed max-w-[260px] line-clamp-3`}
                        >
                          {member.description}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Paper Cut */}
      <div className="w-full -mt-1 relative z-10">
        <Image
          src="/images/polaroid-marquee/bottom.svg"
          alt=""
          width={1600}
          height={120}
          className="w-full h-auto block"
        />
      </div>
    </section>
  )
}
