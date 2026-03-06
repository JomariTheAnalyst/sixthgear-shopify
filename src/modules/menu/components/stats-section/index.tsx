"use client"

import React from "react"

const STATS = [
  {
    id: 1,
    value: "46",
    label: "YEARS OF",
    label2: "EXPERIENCE"
  },
  {
    id: 2,
    value: "1M+",
    label: "HAPPY",
    label2: "CLIENTS"
  },
  {
    id: 3,
    value: "84",
    label: "COUNTRIES",
    label2: "OPERATING"
  },
  {
    id: 4,
    value: "1K+",
    label: "PRODUCTS",
    label2: "AVAILABLE"
  }
]

const StatsSection = () => {
  return (
    <section className="relative bg-[#222222] py-20 lg:py-28 overflow-hidden z-20 w-full mt-4">
      {/* Torn Top Edge Overlay */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 text-white transform rotate-180">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[12px] sm:h-[18px] md:h-[24px] block" fill="currentColor">
          <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
        </svg>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 my-8 sm:my-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 lg:gap-8 justify-items-center md:justify-items-start lg:justify-items-center">
          {STATS.map((stat) => (
            <div key={stat.id} className="flex border-l-[1.5px] border-white/90 pl-5 sm:pl-6 md:pl-5 lg:pl-8 h-full items-center w-full max-w-[180px] sm:max-w-[220px]">
              <div className="flex flex-col justify-center">
                <span 
                  className="text-white text-[56px] sm:text-[64px] lg:text-[76px] font-black leading-none mb-1 md:mb-2 tracking-tighter"
                  style={{ fontFamily: "Tanker, var(--font-montserrat), sans-serif" }}
                >
                  {stat.value}
                </span>
                <span 
                  className="text-white/95 text-[11px] sm:text-[12px] lg:text-[13px] font-bold tracking-[0.05em] uppercase leading-[1.4]"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {stat.label}<br/>{stat.label2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Torn Bottom Edge Overlay */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 text-white">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[12px] sm:h-[18px] md:h-[24px] block" fill="currentColor">
          <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
        </svg>
      </div>
    </section>
  )
}

export default StatsSection
