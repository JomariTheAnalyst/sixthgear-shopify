"use client"

import { useRef } from "react"
import { inter, montserrat } from "@lib/fonts"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TeamMember {
  id: number
  name: string
  role: string
  title: string
  description: string
  image: string
  socialLinks: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
}

interface OurTeamProps {
  sectionTitle?: string | null
  sectionDescription?: string | null
  teamMembers?: TeamMember[] | null
}

const teamMembersFallback: TeamMember[] = [
  {
    id: 1,
    name: "MARTIE",
    role: "Lead Technician",
    title: "Workshop Head",
    description:
      "Experienced motorcycle technician specializing in diagnostics, repairs, and performance upgrades for big bikes and premium motorcycles.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    socialLinks: {},
  },
  {
    id: 2,
    name: "JAMES",
    role: "Senior Mechanic",
    title: "Service & Installation Specialist",
    description:
      "Focused on PMS, mechanical repairs, and proper installation of accessories, electronics, and safety upgrades.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face",
    socialLinks: {},
  },
  {
    id: 3,
    name: "MARVIN",
    role: "Service Advisor",
    title: "Rider Support & Coordination",
    description:
      "Your point of contact for service consultations, job updates, and ensuring a smooth workshop experience from start to finish.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=face",
    socialLinks: {},
  },
  {
    id: 4,
    name: "SARAH",
    role: "Lead Barista",
    title: "First Gear Coffee",
    description:
      "Expert barista crafting premium coffee beverages, ensuring riders have the perfect brew while they wait.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face",
    socialLinks: {},
  },
]

export default function OurTeam({
  sectionTitle,
  sectionDescription,
  teamMembers,
}: OurTeamProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const activeTitle = sectionTitle || "Our  Team"
  const activeDescription =
    sectionDescription ||
    "Riders, Technicians, and Professionals Who Care About Your Bike"

  const activeMembers =
    teamMembers && teamMembers.length >= 4 ? teamMembers.slice(0, 4) : teamMembersFallback

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
    <section className="relative">
      {/* Top Paper Cut */}
      <div className="w-full -mb-1 relative z-10">
        <img
          src="/images/polaroid-marquee/top.svg"
          alt=""
          className="w-full h-auto block"
        />
      </div>

      {/* Main Section */}
      <div className="bg-[#0A0A0A] relative overflow-hidden">
        <div className="py-16 md:py-24 lg:py-28">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="flex justify-center mb-4">
              </div>
              <h2
                className={`${montserrat.className} text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-white mb-4`}
              >
                {activeTitle}
              </h2>
              <p
                className={`${inter.className} text-sm md:text-base text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed whitespace-pre-line`}
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
                    key={member.id}
                    className="snap-center flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  >
                    <div className="bg-white rounded-3xl overflow-hidden h-full flex flex-col group/card shadow-lg hover:shadow-2xl hover:shadow-[#fca311]/5 border border-transparent hover:border-[#fca311]/10 transition-all duration-500">
                      
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="absolute inset-0 w-full h-full object-cover grayscale opacity-95 transition-all duration-700 group-hover/card:scale-105"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/20 to-transparent mix-blend-multiply" />
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>

                      {/* Content Section (White Bottom Card) */}
                      <div className="px-6 py-8 md:py-10 text-center bg-white flex flex-col flex-grow items-center justify-center -mt-2 relative z-10 rounded-t-3xl">
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
                          className={`${inter.className} text-sm font-medium text-gray-500 mb-2 leading-relaxed`}
                        >
                          {member.title}
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
        <img
          src="/images/polaroid-marquee/bottom.svg"
          alt=""
          className="w-full h-auto block"
        />
      </div>
    </section>
  )
}
