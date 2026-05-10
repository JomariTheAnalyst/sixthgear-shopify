"use client"

import { useRef } from "react"
import Image from "next/image"
import { inter, montserrat } from "@lib/fonts"
import { TextRoll } from "components/ui/text-roll"
import { CLIENT_STORIES_FALLBACKS } from "@lib/strapi/client-stories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface Story {
  _id?: string
  id?: number
  title: string | null
  slug?: string | null
  excerpt: string | null
  publishedAt?: string | null
  date?: string | null
  category: {
    title: string | null
    slug: string | null
  } | string | null
  featuredImageUrl?: string | null
  image?: string | null
}

interface ClientStoriesProps {
  sectionTitle?: string
  sectionDescription?: string
  stories?: Story[]
}

export default function ClientStories({
  sectionTitle = "Rider Stories & Garage Notes",
  sectionDescription = "Tips, stories, and insights from the workshop, the road, and the rider lounge",
  stories = [],
}: ClientStoriesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const placeholderStories: Story[] = CLIENT_STORIES_FALLBACKS.stories.map(
    (story) => ({
      ...story,
      slug: story.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    })
  )

  const normalizedStories = stories
    .map((story) => ({
      key: story._id || String(story.id || story.title || Math.random()),
      title: story.title || "Rider Story",
      slug:
        story.slug ||
        (story.title
          ? story.title
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
          : null),
      excerpt: story.excerpt || "",
      publishedLabel:
        story.publishedAt
          ? new Date(story.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : story.date || "",
      featuredImageUrl: story.featuredImageUrl || story.image || null,
    }))
    .filter((story) => story.slug && story.title)

  const normalizedPlaceholders = placeholderStories.map((story) => ({
    key: String(story.id),
    title: story.title || "Rider Story",
    slug: story.slug || null,
    excerpt: story.excerpt || "",
    publishedLabel: story.date || "",
    featuredImageUrl: story.image || null,
  }))

  const displayStories =
    normalizedStories.length > 0
      ? normalizedStories.slice(0, 6)
      : normalizedPlaceholders.slice(0, 6)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth >= 1024 ? 360 : 320
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section
      id="rider-stories"
      className="relative py-14 md:py-18 lg:py-24 bg-white overflow-hidden"
    >
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="mb-10 md:mb-14 lg:mb-16">
          <div className="mx-auto w-full max-w-[1200px] text-center">
          <h2
            className={`${montserrat.className} whitespace-nowrap text-center text-[clamp(1.7rem,4.15vw,3.65rem)] font-black leading-[0.9] tracking-[-0.05em] text-[#191b22] mb-3 md:mb-4`}
          >
            {sectionTitle}
          </h2>
          <p
            className={`${inter.className} mx-auto max-w-[760px] text-base font-medium leading-[1.35] tracking-[-0.02em] text-black/70 md:text-xl lg:text-2xl`}
          >
            {sectionDescription}
          </p>
          </div>
        </div>

        <>
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {displayStories.map((story) => (
              <article
                key={story.key}
                className="group flex flex-shrink-0 w-[82vw] flex-col sm:w-[60vw] md:w-[45vw] lg:w-[calc(33.333%-22px)] snap-center border border-[#ede4d8] bg-[#f6f1e8] p-3 md:p-4"
              >
                <div className="flex h-full flex-col">
                  {story.featuredImageUrl ? (
                    <div className="relative aspect-[4/5] overflow-hidden border border-[#ede4d8] bg-[#f6f1e8]">
                      <Image
                        src={story.featuredImageUrl}
                        alt={story.title || "Rider story"}
                        fill
                        sizes="(max-width: 639px) 82vw, (max-width: 1023px) 45vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col pt-4 md:pt-5">
                    <div className="mb-3">
                      <span className={`${inter.className} text-xs md:text-sm font-semibold uppercase tracking-[0.06em] text-[#ff5000]`}>
                        {story.publishedLabel}
                      </span>
                    </div>

                    <h3 className={`${montserrat.className} text-xl md:text-2xl lg:text-[24px] font-bold tracking-[0.005em] text-[#111111] leading-[1.12] mb-3 decoration-black underline-offset-[10px] transition-[text-decoration-color] duration-300 group-hover:underline`}>
                      {story.title}
                    </h3>
                    <p className={`${inter.className} text-gray-600 text-sm md:text-[15px] leading-relaxed line-clamp-3`}>
                      {story.excerpt}
                    </p>

                    <div className="mt-auto flex items-end justify-end pt-6">
                      <LocalizedClientLink
                        href={`/rider-stories/${story.slug || ""}`}
                        className="inline-flex items-center text-sm font-medium uppercase tracking-[0.12em] text-black"
                      >
                        <TextRoll className="inline-flex">Read article</TextRoll>
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 flex items-center justify-center bg-[#FF5000] hover:bg-[#e54800] text-white transition-all duration-300 active:scale-95"
              aria-label="Previous"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 flex items-center justify-center bg-[#FF5000] hover:bg-[#e54800] text-white transition-all duration-300 active:scale-95"
              aria-label="Next"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
        
      </div>
    </section>
  )
}
