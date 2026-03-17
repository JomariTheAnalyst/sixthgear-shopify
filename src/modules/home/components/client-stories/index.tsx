"use client"

import { useRef } from "react"
import { inter, montserrat } from "@lib/fonts"

interface Story {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
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

  if (!stories || stories.length === 0) {
    return null
  }

  const placeholderStories: Story[] = [
    {
      id: 10001,
      title: "Workshop Story Coming Soon",
      excerpt: "More rider stories, service notes, and garage insights will be added here soon.",
      author: "Sixthgear Moto",
      date: "Coming Soon",
      category: "Update",
      image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&h=1200&fit=crop",
    },
    {
      id: 10002,
      title: "Next Rider Feature In Progress",
      excerpt: "We are preparing another story from the workshop floor and the riding community.",
      author: "Sixthgear Moto",
      date: "Coming Soon",
      category: "Feature",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=1200&fit=crop",
    },
    {
      id: 10003,
      title: "Fresh Garage Note On The Way",
      excerpt: "A new round of motorcycle care insights and rider-focused updates will be published here.",
      author: "Sixthgear Moto",
      date: "Coming Soon",
      category: "News",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&h=1200&fit=crop",
    },
  ]

  const displayStories =
    stories.length >= 6
      ? stories.slice(0, 6)
      : [...stories, ...placeholderStories.slice(0, 6 - stories.length)]

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
    <section className="relative py-14 md:py-18 lg:py-24 bg-white overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-14 lg:mb-16">
          <h2
            className={`${montserrat.className} inline-block text-black text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-[0.02em]`}
          >
            {sectionTitle}
          </h2>
          <p
            className={`${inter.className} mt-4 text-base md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto`}
          >
            {sectionDescription}
          </p>
        </div>

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
              key={story.id}
              className="flex-shrink-0 w-[82vw] sm:w-[60vw] md:w-[45vw] lg:w-[calc(33.333%-22px)] snap-center border border-gray-200 bg-white p-3 md:p-4"
            >
              <div className="relative aspect-[4/5] overflow-hidden border border-gray-200">
                <img
                  src={story.image}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`${inter.className} inline-flex items-center gap-2 bg-black/45 px-3 py-1.5 text-white text-xs font-medium backdrop-blur-sm`}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 13c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3Z" />
                      <path d="M19.5 10.5c0 6-7.5 11-7.5 11s-7.5-5-7.5-11a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    {story.author}
                  </span>
                </div>
                <button
                  type="button"
                  className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center shadow-lg"
                  aria-label={`Open ${story.title}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              <div className="pt-4 md:pt-5">
                <div className="flex items-center gap-2 text-[#ff5000] mb-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 2v4M16 2v4M3 10h18" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                  </svg>
                  <span className={`${inter.className} text-xs md:text-sm font-semibold uppercase tracking-[0.06em]`}>
                    {story.date}
                  </span>
                </div>

                <h3 className={`${montserrat.className} text-xl md:text-2xl lg:text-[24px] font-bold tracking-[0.005em] text-[#111111] leading-[1.12] mb-3`}>
                  {story.title}
                </h3>
                <p className={`${inter.className} text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3`}>
                  {story.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => scroll("left")}
            className="w-12 h-12 bg-[#ff5000] hover:bg-[#e54800] rounded-full flex items-center justify-center transition-colors active:scale-95 text-white"
            aria-label="Previous"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-12 h-12 bg-[#ff5000] hover:bg-[#e54800] rounded-full flex items-center justify-center transition-colors active:scale-95 text-white"
            aria-label="Next"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
