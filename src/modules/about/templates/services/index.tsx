"use client"

import React, { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { inter, montserrat } from "@lib/fonts"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ServiceCard {
  id: number
  title: string
  backgroundImage: string | null
  linkUrl: string
  buttonText: string
}

interface AboutServicesProps {
  sectionName?: string
  heading?: string
  cards?: ServiceCard[]
}

const defaultServices: ServiceCard[] = [
  {
    id: 1,
    title: "Motorcycle Service & Diagnostics",
    backgroundImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    linkUrl: "/services",
    buttonText: "DISCOVER",
  },
  {
    id: 2,
    title: "Parts, Accessories & Luggage",
    backgroundImage:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    linkUrl: "/store",
    buttonText: "SHOP",
  },
  {
    id: 3,
    title: "Rider Apparel & Gear",
    backgroundImage:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    linkUrl: "/store",
    buttonText: "SHOP",
  },
  {
    id: 4,
    title: "Café & Rider Lounge",
    backgroundImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    linkUrl: "/first-gear",
    buttonText: "DISCOVER",
  },
]

export default function AboutServices({
  sectionName = "What We Offer",
  heading = "Complete Care for\nYour Ride",
  cards = defaultServices,
}: AboutServicesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Split heading by newline
  const headingParts = heading.split("\n")

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const offset = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  // Render a single card
  const renderCard = (service: ServiceCard) => {
    return (
      <Link
        key={service.id}
        href={service.linkUrl || "#"}
        className="group relative flex-none w-[85vw] sm:w-[400px] lg:w-[450px] xl:w-[480px] min-h-[500px] lg:min-h-[650px] snap-center overflow-hidden bg-black"
      >
        <Image
          src={service.backgroundImage || "/images/placeholder.jpg"}
          alt={service.title}
          fill
          quality={90}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Darkening gradient to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        {/* Content Centered at Bottom */}
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
    <section className="bg-[#1a1a1a] py-20 md:py-28 lg:py-36 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 relative z-10 w-full">
        {/* Section Header */}
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

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide"
        >
          {cards.map((card) => renderCard(card))}
        </div>

        {/* Navigation Buttons (Centered at Bottom) */}
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
