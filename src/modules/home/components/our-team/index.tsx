"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
} from "lucide-react"

import type { SanityOurTeamSectionQueryResult } from "@lib/cms/types"
import {
  FALLBACK_OUR_TEAM_CONTENT,
  selectOurTeamContent,
  type OurTeamContent,
} from "@lib/cms/our-team"
import { outfit } from "@lib/fonts"
import {
  cleanSanityString,
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

const SECTION_X_PADDING =
  "px-5 xsmall:px-8 small:px-16 medium:px-24 large:px-[233px]"

interface TeamMember {
  id: number
  name: string
  role: string
  title: string
  description: string
  image: string
  wackyImage?: string | null
  imageAlt?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
}

interface OurTeamProps {
  data?: SanityOurTeamSectionQueryResult | null
  sectionTitle?: string | null
  sectionDescription?: string | null
  teamMembers?: TeamMember[] | null
}

function limitToFifteenWords(value: string) {
  const words = cleanSanityString(value).split(/\s+/).filter(Boolean)

  if (words.length <= 15) return words.join(" ")

  return `${words.slice(0, 15).join(" ")}…`
}

export default function OurTeam({
  data,
  sectionTitle,
  sectionDescription,
  teamMembers,
}: OurTeamProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [activeImageKey, setActiveImageKey] = useState<string | null>(null)

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
            description: member.description,
            professionalImage: member.image,
            wackyImage: member.wackyImage || member.image,
            imageAlt: member.imageAlt || member.name,
            instagramUrl: member.instagramUrl || undefined,
            facebookUrl: member.facebookUrl || undefined,
          }))
        : FALLBACK_OUR_TEAM_CONTENT.teamMembers,
  }
  const content = data !== undefined ? selectOurTeamContent(data) : legacyContent
  const activeMembers = content.teamMembers
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"

  const updateCarouselControls = useCallback(() => {
    const container = scrollContainerRef.current

    if (!container) return

    const maxScrollLeft = container.scrollWidth - container.clientWidth
    setCanScrollLeft(container.scrollLeft > 2)
    setCanScrollRight(maxScrollLeft - container.scrollLeft > 2)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current

    if (!container) return

    updateCarouselControls()
    container.addEventListener("scroll", updateCarouselControls, {
      passive: true,
    })

    const resizeObserver = new ResizeObserver(updateCarouselControls)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener("scroll", updateCarouselControls)
      resizeObserver.disconnect()
    }
  }, [activeMembers.length, updateCarouselControls])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    const firstCard = container?.firstElementChild as HTMLElement | null

    if (!container || !firstCard) return

    const cardWidth = firstCard.getBoundingClientRect().width
    const gap = Number.parseFloat(getComputedStyle(container).columnGap) || 0
    const visibleCards = Math.max(
      1,
      Math.floor((container.clientWidth + gap) / (cardWidth + gap))
    )
    const cardsPerMove = Math.max(1, visibleCards - 1)
    const distance = (cardWidth + gap) * cardsPerMove
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    container.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <section
      aria-labelledby="homepage-team-heading"
      data-sanity={createSanityDataAttribute(visualEditingEnabled, {
        documentId: "homepage",
        documentType: "homepage",
        path: sanitySource
          ? "ourTeamSection"
          : "ourTeamSection.useSanityContent",
      })}
      className={`${outfit.className} overflow-hidden bg-white py-16 text-[#171717] antialiased small:py-24 medium:py-28 ${SECTION_X_PADDING}`}
    >
      <div className="mx-auto max-w-[1454px]">
        <header className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#d84b20] small:text-sm">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[#f15a24]"
            />
            {cleanSanityString(content.sectionTitle)}
          </p>
          <h2
            id="homepage-team-heading"
            className="mt-5 text-[clamp(2.5rem,4.3vw,4.75rem)] font-black leading-[0.98] tracking-[-0.04em] text-[#241015] [text-wrap:balance]"
          >
            {cleanSanityString(content.sectionDescription)}
          </h2>
        </header>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Sixthgear team members"
          className="mt-12 small:mt-16 medium:mt-20"
        >
          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] small:gap-6"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {activeMembers.map((member) => {
              const professionalImage = cleanSanityString(
                member.professionalImage
              )
              const wackyImage = cleanSanityString(
                member.wackyImage || member.professionalImage
              )
              const hasAlternateImage = wackyImage !== professionalImage
              const showAlternate =
                hasAlternateImage && activeImageKey === member.key
              const memberPath = keyedSanityPath(
                "ourTeamSection.teamMembers",
                member.key
              )

              return (
                <article
                  key={member.key}
                  tabIndex={0}
                  aria-label={`${cleanSanityString(member.name)}, ${cleanSanityString(member.role)}`}
                  data-sanity={
                    sanitySource
                      ? createSanityDataAttribute(visualEditingEnabled, {
                          documentId: "homepage",
                          documentType: "homepage",
                          path: memberPath,
                        })
                      : undefined
                  }
                  onPointerEnter={(event) => {
                    if (
                      hasAlternateImage &&
                      event.pointerType === "mouse" &&
                      window.matchMedia("(hover: hover) and (pointer: fine)")
                        .matches
                    ) {
                      setActiveImageKey(member.key)
                    }
                  }}
                  onPointerLeave={(event) => {
                    if (!event.currentTarget.contains(document.activeElement)) {
                      setActiveImageKey(null)
                    }
                  }}
                  onFocus={() => {
                    if (hasAlternateImage) setActiveImageKey(member.key)
                  }}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setActiveImageKey(null)
                    }
                  }}
                  className="group/card flex min-h-full basis-[88%] shrink-0 snap-start flex-col rounded-[18px] bg-[#faf9f7] p-2 outline-none ring-1 ring-black/[0.05] transition-shadow duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#f15a24] focus-visible:ring-offset-4 xsmall:basis-[72%] small:basis-[calc(50%_-_0.75rem)] medium:basis-[calc(33.333%_-_1rem)] large:basis-[calc(25%_-_1.125rem)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[13px] bg-[#eceae6]">
                    <Image
                      src={professionalImage}
                      alt={cleanSanityString(member.imageAlt)}
                      data-sanity={
                        sanitySource
                          ? createSanityDataAttribute(visualEditingEnabled, {
                              documentId: "homepage",
                              documentType: "homepage",
                              path: `${memberPath}.photo`,
                            })
                          : undefined
                      }
                      fill
                      sizes="(max-width: 511px) 88vw, (max-width: 1023px) 72vw, (max-width: 1279px) 44vw, (max-width: 1439px) 29vw, 24vw"
                      className={`object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                        showAlternate ? "scale-[1.02] opacity-0" : "opacity-100"
                      }`}
                    />
                    {hasAlternateImage ? (
                      <Image
                        src={wackyImage}
                        alt=""
                        aria-hidden="true"
                        data-sanity={
                          sanitySource
                            ? createSanityDataAttribute(visualEditingEnabled, {
                                documentId: "homepage",
                                documentType: "homepage",
                                path: `${memberPath}.wackyPhoto`,
                              })
                            : undefined
                        }
                        fill
                        sizes="(max-width: 511px) 88vw, (max-width: 1023px) 72vw, (max-width: 1279px) 44vw, (max-width: 1439px) 29vw, 24vw"
                        className={`object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                          showAlternate
                            ? "scale-100 opacity-100"
                            : "scale-[1.02] opacity-0"
                        }`}
                      />
                    ) : null}
                  </div>

                  <div className="flex min-h-[208px] flex-1 flex-col px-4 pb-4 pt-5 small:px-5">
                    <h3 className="text-xl font-semibold leading-tight tracking-[-0.025em] text-[#241015]">
                      {cleanSanityString(member.name)}
                    </h3>
                    <p className="mt-1 text-sm font-medium leading-snug text-[#705e62]">
                      {cleanSanityString(member.role)}
                    </p>
                    <p className="mt-4 max-w-[34ch] text-sm font-light leading-[1.55] text-[#655b5d]">
                      {limitToFifteenWords(member.description)}
                    </p>

                    {member.instagramUrl || member.facebookUrl ? (
                      <div className="mt-auto flex items-center gap-2 pt-6">
                        {member.instagramUrl ? (
                          <a
                            href={cleanSanityString(member.instagramUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${cleanSanityString(member.name)} on Instagram`}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#241015] ring-1 ring-black/[0.06] transition-colors duration-200 hover:bg-[#f15a24] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15a24]"
                          >
                            <Instagram aria-hidden="true" size={18} strokeWidth={2} />
                          </a>
                        ) : null}
                        {member.facebookUrl ? (
                          <a
                            href={cleanSanityString(member.facebookUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${cleanSanityString(member.name)} on Facebook`}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#241015] ring-1 ring-black/[0.06] transition-colors duration-200 hover:bg-[#f15a24] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15a24]"
                          >
                            <Facebook aria-hidden="true" size={18} strokeWidth={2} />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-7 flex items-center justify-center gap-3 small:justify-end">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous team members"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#241015]/15 bg-white text-[#241015] transition-[background-color,color,transform,opacity] duration-200 hover:bg-[#241015] hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#241015] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#241015]"
            >
              <ChevronLeft aria-hidden="true" size={21} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next team members"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#241015]/15 bg-white text-[#241015] transition-[background-color,color,transform,opacity] duration-200 hover:bg-[#241015] hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#241015] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#241015]"
            >
              <ChevronRight aria-hidden="true" size={21} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
