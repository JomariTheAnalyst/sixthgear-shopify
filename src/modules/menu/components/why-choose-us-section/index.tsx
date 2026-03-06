"use client"

import React from "react"

const StarburstBadge = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex items-center justify-center w-[90px] h-[90px] mb-6">
    <svg className="absolute w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] text-white" viewBox="0 0 100 100" fill="currentColor">
      {/* 24-point zig-zag badge path */}
      <path d="M 50 2 L 57 12 L 69 9 L 74 19 L 86 21 L 85 33 L 96 40 L 90 50 L 96 60 L 85 67 L 86 79 L 74 81 L 69 91 L 57 88 L 50 98 L 43 88 L 31 91 L 26 81 L 14 79 L 15 67 L 4 60 L 10 50 L 4 40 L 15 33 L 14 21 L 26 19 L 31 9 L 43 12 Z" />
    </svg>
    <div className="relative z-10 w-10 h-10 text-[#1A422D] flex items-center justify-center">
      {children}
    </div>
  </div>
)

const FEATURES = [
  {
    id: 1,
    title: "SUSTAINABLE CUPS",
    desc: "Eco-friendly cups for a better planet. Sip coffee, save nature.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="7" y="10" width="10" height="6" fill="#F3B748" stroke="currentColor" />
        <path d="M6 4h12l-1 16H7L6 4z" />
        <path d="M5 4h14" />
        <circle cx="12" cy="13" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 2,
    title: "ORGANIC BEANS",
    desc: "Sourced from trusted organic farms. Naturally grown.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M6 10h12v5a4 4 0 01-4 4H10a4 4 0 01-4-4v-5z" fill="#F3B748" />
        <path d="M18 10h2a2 2 0 010 4h-2" />
        <path d="M15 10c0-2-3-3-3-3S9 8 9 10" />
        <path d="M4 19h16" />
      </svg>
    )
  },
  {
    id: 3,
    title: "LOCAL PARTNERSHIPS",
    desc: "Supporting nearby farmers and small suppliers.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="12" r="8" fill="#F3B748" />
        <circle cx="12" cy="12" r="3" fill="white" />
        <path d="M18 9a4 4 0 00-6-6" stroke="currentColor" />
      </svg>
    )
  },
  {
    id: 4,
    title: "FRESHLY ROASTED",
    desc: "Roasted in-house for peak aroma and taste.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M7 6h10l-1 10a2 2 0 01-2 2h-4a2 2 0 01-2-2L7 6z" fill="#F3B748" />
        <path d="M6 6h12" />
        <path d="M5 20h14" />
        <path d="M10 2v3" />
        <path d="M14 2v3" />
      </svg>
    )
  },
  {
    id: 5,
    title: "REUSABLE MUGS",
    desc: "Encouraging refill culture and waste reduction.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="7" y="8" width="10" height="12" rx="1" fill="#F3B748" />
        <path d="M9 4h6v4H9z" />
        <circle cx="12" cy="14" r="2" fill="white" />
        <path d="M10 2v2" />
      </svg>
    )
  },
  {
    id: 6,
    title: "FAIR TRADE FOCUS",
    desc: "Eco-friendly cups for a better planet. Sip coffee, save nature.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="4" y="8" width="16" height="10" rx="1" fill="white" />
        <rect x="6" y="10" width="12" height="6" fill="#F3B748" />
        <path d="M12 4L4 8" />
        <path d="M12 4L20 8" />
        <circle cx="12" cy="13" r="1.5" fill="white" />
      </svg>
    )
  },
  {
    id: 7,
    title: "SUSTAINABLE CUPS",
    desc: "Better prices and respect for every grower.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="4" y="10" width="16" height="12" fill="white" />
        <rect x="8" y="14" width="8" height="8" fill="#F3B748" />
        <path d="M2 10l2-4h16l2 4" fill="#F3B748" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 8,
    title: "ORGANIC BEANS",
    desc: "Sourced from trusted organic farms. Naturally grown.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M7 8h10l1 12a1 1 0 01-1 1H7a1 1 0 01-1-1L7 8z" fill="#F3B748" />
        <path d="M8 8c0-2-1-4-1-4s2 1 5 1 5-1 5-1-1 2-1 4" />
        <circle cx="12" cy="15" r="2" fill="white" />
      </svg>
    )
  }
]

const WhyChooseUsSection = () => {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20">
          <span 
            className="text-[#f16d34] text-xl sm:text-2xl block mb-2"
            style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
          >
            Why Choose Us
          </span>
          <h2 
            className="text-[#1A422D] text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] font-black uppercase tracking-tight max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            YOUR FAVORITE BREWS AND BITES, ALL IN ONE MENU
          </h2>
        </div>

        {/* 4x2 Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-[#f2f2f2] rounded-[20px] p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <StarburstBadge>
                {feature.icon}
              </StarburstBadge>
              
              <h3 
                className="text-[#1A422D] font-extrabold text-[16px] sm:text-[17px] uppercase tracking-wide mb-3"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {feature.title}
              </h3>
              
              <p 
                className="text-[#1A422D]/70 text-[14px] leading-[1.6] font-medium max-w-[220px]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsSection
