"use client"

import { useRef } from "react"
import Image from "next/image"
import { inter, montserrat } from "@lib/fonts"
import type { OurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import { cleanSanityString, createSanityDataAttribute, keyedSanityPath } from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

export interface ProjectsSectionProps {
  content: OurSpaceExperienceContent
  variant?: "light" | "dark"
}

const ProjectsSection = ({
  content,
  variant = "light",
}: ProjectsSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isDark = variant === "dark"
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"

  const displayItems = content.items.slice(0, 3)

  return (
    <section
      data-sanity={createSanityDataAttribute(visualEditingEnabled, {
        documentId: "aboutPage",
        documentType: "aboutPage",
        path: sanitySource ? "ourSpaceExperience" : "ourSpaceExperience.useSanityContent",
      })}
      className={`${isDark ? "bg-[#0A0A0A]" : "bg-white"} py-14 md:py-18 lg:py-24`}
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-10 text-center md:mb-12 lg:mb-14">
          <h2
            className={`${montserrat.className} whitespace-nowrap text-[clamp(1.85rem,4.15vw,3.65rem)] font-black leading-[0.9] tracking-[-0.05em] ${isDark ? "text-white" : "text-[#191b22]"}`}
          >
            {content.sectionTitle}
          </h2>
          <p
            className={`${inter.className} mx-auto mt-4 max-w-[760px] text-base font-medium leading-[1.35] tracking-[-0.02em] md:text-xl lg:text-2xl ${isDark ? "text-white/70" : "text-black/70"}`}
          >
            {content.sectionDescription}
          </p>
        </div>

        <div className="lg:hidden">
          <div
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-0 pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {displayItems.map((item) => (
              <article
                key={item.key}
                data-sanity={sanitySource ? createSanityDataAttribute(visualEditingEnabled, {
                  documentId: "aboutPage",
                  documentType: "aboutPage",
                  path: keyedSanityPath("ourSpaceExperience.items", item.key),
                }) : undefined}
                className="group flex w-[82vw] flex-shrink-0 snap-center flex-col overflow-hidden rounded-[24px] bg-[#f5efe7] sm:w-[62vw] md:w-[46vw]"
              >
                <div className="relative aspect-[1.06/0.7] overflow-hidden rounded-t-[24px]">
                  <Image
                    src={cleanSanityString(item.imageUrl)}
                    alt={item.imageAlt}
                    data-sanity={sanitySource ? createSanityDataAttribute(visualEditingEnabled, {
                      documentId: "aboutPage",
                      documentType: "aboutPage",
                      path: `${keyedSanityPath("ourSpaceExperience.items", item.key)}.image`,
                    }) : undefined}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 639px) 80vw, (max-width: 1023px) 60vw, 45vw"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3
                    className={`${montserrat.className} min-h-[6.2rem] max-w-[11ch] text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[#232228]`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`${inter.className} mt-6 text-sm leading-[1.4] text-black/68 md:text-[15px]`}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  })
                }
              }}
              className="flex h-11 w-11 items-center justify-center bg-[#191b22] text-white transition-colors duration-300 hover:bg-black active:scale-95"
              aria-label="Previous"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    left: 320,
                    behavior: "smooth",
                  })
                }
              }}
              className="flex h-11 w-11 items-center justify-center bg-[#191b22] text-white transition-colors duration-300 hover:bg-black active:scale-95"
              aria-label="Next"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {displayItems.map((item) => (
            <article
              key={item.key}
              data-sanity={sanitySource ? createSanityDataAttribute(visualEditingEnabled, {
                documentId: "aboutPage",
                documentType: "aboutPage",
                path: keyedSanityPath("ourSpaceExperience.items", item.key),
              }) : undefined}
              className="group overflow-hidden rounded-[24px] bg-[#f5efe7] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[1.06/0.7] overflow-hidden rounded-t-[24px]">
                <Image
                  src={cleanSanityString(item.imageUrl)}
                  alt={item.imageAlt}
                  data-sanity={sanitySource ? createSanityDataAttribute(visualEditingEnabled, {
                    documentId: "aboutPage",
                    documentType: "aboutPage",
                    path: `${keyedSanityPath("ourSpaceExperience.items", item.key)}.image`,
                  }) : undefined}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1279px) 32vw, 420px"
                />
              </div>

              <div className="flex min-h-[18rem] flex-col p-8">
                <h3
                  className={`${montserrat.className} min-h-[8.75rem] max-w-[11ch] text-[clamp(2.25rem,2.7vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.065em] text-[#232228]`}
                >
                  {item.title}
                </h3>
                <p
                  className={`${inter.className} mt-7 text-[15px] leading-[1.45] text-black/68`}
                >
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
