"use client"

import React, { useRef } from "react"

const StarGroup = ({ color = "text-[#1A422D]" }: { color?: string }) => (
  <div className={`flex gap-1 ${color}`}>
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const BeanIcon = () => (
  <svg className="w-8 h-8 text-[#1A422D]/10" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11 20A7 7 0 0 1 4 13C4 8.6 7 5 11 5a7 7 0 0 1 7 7c0 4.4-3 8-7 8Z" />
    <path d="M11 5v15" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 13a4 4 0 0 0 4-4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const CupIcon = () => (
  <svg className="w-8 h-8 text-[#1A422D]/10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h14v7a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 10h1a3 3 0 010 6h-1M7 4v2M11 4v2M15 4v2" />
  </svg>
)

const TeapotIcon = () => (
  <svg className="w-8 h-8 text-[#1A422D]/10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8v12h12V8c0-3.314-2.686-6-6-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 10h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 2h8M6 10H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
  </svg>
)

const TESTIMONIALS = [
  {
    id: 1,
    name: "LARRY MITCHELL",
    role: "CEO Bean Craft",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    quote: "FROM THE FIRST SIP TO THE LAST, EVERY COFFEE IS CRAFTED WITH PASSION.",
    type: "type1",
    icon: <BeanIcon />
  },
  {
    id: 2,
    name: "STEVEN MARTIN",
    role: "CEO Bean Craft",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    quote: "THE COFFEE HERE AMAZING! ATMOSPHERE MAKES EVERY VISIT SPECIAL.",
    type: "type2",
    icon: <CupIcon />
  },
  {
    id: 3,
    name: "CHARLES MARTINEZ",
    role: "CEO Bean Craft",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    quote: "I LOVE THE VARIETY OF BLENDS; THE AROMA FILLS THE CAFÉ WITH WARMTH.",
    type: "type3",
    icon: <TeapotIcon />
  },
  {
    id: 4,
    name: "SARAH JENKINS",
    role: "Coffee Enthusiast",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    quote: "TRULY THE BEST ESPRESSO IN TOWN. THE BARISTAS ARE REAL ARTISTS.",
    type: "type1",
    icon: <BeanIcon />
  },
  {
    id: 5,
    name: "DAVID CHEN",
    role: "Local Guide",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    quote: "A HIDDEN GEM! THE PASTRIES AND POUR OVERS ARE SIMPLY INCREDIBLE.",
    type: "type2",
    icon: <CupIcon />
  },
  {
    id: 6,
    name: "AMANDA SMITH",
    role: "Food Blogger",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    quote: "THE AMBIENCE IS PERFECT FOR WORKING OR JUST RELAXING OUT WITH FRIENDS.",
    type: "type3",
    icon: <TeapotIcon />
  }
]

const ClientTestimonialsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // Calculate scroll width dynamically based on visible cards
      const containerWidth = scrollContainerRef.current.clientWidth
      // Scroll by one full view width minus a little overlap
      const scrollAmount = direction === "left" ? -containerWidth * 0.8 : containerWidth * 0.8
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="bg-white py-20 lg:py-28 relative">
      {/* Hide Scrollbar Snippet */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 sm:mb-16 gap-6 relative">
          <div className="text-center md:text-left w-full relative z-10">
            <span 
              className="text-[#f16d34] text-xl sm:text-2xl block mb-2"
              style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
            >
              Portfolio
            </span>
            <h2 
              className="text-[#1A422D] text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] font-black uppercase tracking-tight"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              HEAR FROM OUR HAPPY<br className="hidden md:block" /> CUSTOMERS, SHARING MOMENTS
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 shrink-0 mx-auto md:mx-0">
            <button 
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border-2 border-[#1A422D] text-[#1A422D] flex items-center justify-center hover:bg-[#1A422D] hover:text-white transition-colors"
              aria-label="Previous testimonials"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full bg-[#1A422D] text-white flex items-center justify-center hover:brightness-110 transition-colors shadow-md"
              aria-label="Next testimonials"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel / Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
          
          {/* Static Hero Column (100% width mobile, 25% width desktop) */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-[#1A422D] rounded-[16px] p-6 sm:p-8 flex flex-col justify-between shadow-lg h-[400px] lg:h-[420px]">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="text-white font-black flex items-baseline leading-none" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  <span className="text-[42px] sm:text-[52px]">4.9</span>
                  <span className="text-[20px] sm:text-[24px]">/5</span>
                </div>
                <div 
                  className="text-[#F3B748] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-right leading-[1.4] max-w-[140px]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  BREWING SMILES, ONE PERFECT CUP AT A TIME, EVERY SINGLE DAY
                </div>
              </div>

              {/* Middle row */}
              <div className="mt-auto mb-8">
                <h3 
                  className="text-white text-[28px] sm:text-[32px] font-black uppercase tracking-tight mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  BREWNI
                </h3>
                
                <div className="flex items-center gap-4">
                  {/* Overlapping Avatars */}
                  <div className="flex -space-x-3">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-[#1A422D] object-cover relative z-20" />
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-[#1A422D] object-cover relative z-10" />
                    <div className="w-10 h-10 rounded-full border-2 border-[#1A422D] bg-[#F3B748] text-[#1A422D] flex items-center justify-center text-xs font-bold relative z-0">
                      35+
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <StarGroup color="text-[#F3B748]" />
                    <span className="text-white/90 text-xs font-semibold" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      Trusted By Client
                    </span>
                  </div>
                </div>
              </div>

              <button 
                className="w-full bg-[#F3B748] text-[#1A422D] text-[12px] font-bold tracking-widest uppercase py-3.5 rounded-lg hover:brightness-105 transition-all shadow-md"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                MORE REVIEW
              </button>
            </div>
          </div>

          {/* Dynamic Scrollable Columns (100% mobile mapped to 75% desktop space) */}
          <div className="relative flex-1 overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full pb-4 items-stretch"
            >
              {TESTIMONIALS.map((t) => (
               <div 
                 key={t.id} 
                 className="snap-start shrink-0 flex flex-col gap-4 sm:gap-6 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-[400px] lg:h-[420px]"
               >
                 
                 {/* Type 1: Grey Header Top, Grey Quote Bottom */}
                 {t.type === "type1" && (
                   <>
                     <div className="bg-[#f2f2f2] rounded-[16px] p-4 flex items-center gap-4 shadow-sm shrink-0">
                       <img src={t.image} alt={t.name} className="w-12 h-12 rounded-xl object-cover" />
                       <div className="overflow-hidden">
                         <h4 className="text-[#1A422D] text-[13px] font-bold uppercase tracking-wide truncate" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{t.name}</h4>
                         <p className="text-[#1A422D]/60 text-[11px] font-medium truncate" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{t.role}</p>
                       </div>
                     </div>
                     <div className="bg-[#f2f2f2] rounded-[16px] p-6 flex flex-col flex-1 shadow-sm relative overflow-hidden">
                       <div className="flex justify-between items-start z-10 text-wrap break-words">
                         <StarGroup />
                         {t.icon}
                       </div>
                       <p className="mt-auto text-[#1A422D] text-[14px] sm:text-[15px] xl:text-[16px] font-black uppercase leading-[1.4] tracking-wide z-10" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                         "{t.quote}"
                       </p>
                     </div>
                   </>
                 )}

                 {/* Type 2: Grey Quote Top, Yellow Header Bottom */}
                 {t.type === "type2" && (
                   <>
                     <div className="bg-[#f2f2f2] rounded-[16px] p-6 flex flex-col flex-1 shadow-sm relative overflow-hidden">
                       <p className="text-[#1A422D] text-[14px] sm:text-[15px] xl:text-[16px] font-black uppercase leading-[1.4] tracking-wide z-10" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                         "{t.quote}"
                       </p>
                       <div className="mt-auto flex justify-between items-end z-10">
                         <StarGroup />
                         {t.icon}
                       </div>
                     </div>
                     <div className="bg-[#F3B748] rounded-[16px] p-4 flex items-center gap-4 shadow-sm shrink-0">
                       <img src={t.image} alt={t.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white/20" />
                       <div className="overflow-hidden">
                         <h4 className="text-[#1A422D] text-[13px] font-bold uppercase tracking-wide truncate" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{t.name}</h4>
                         <p className="text-[#1A422D]/70 text-[11px] font-medium truncate" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{t.role}</p>
                       </div>
                     </div>
                   </>
                 )}

                 {/* Type 3: Orange Header Top, Grey Quote Bottom */}
                 {t.type === "type3" && (
                   <>
                     <div className="bg-[#D95436] rounded-[16px] p-4 flex items-center gap-4 shadow-sm shrink-0">
                       <img src={t.image} alt={t.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white/20" />
                       <div className="overflow-hidden">
                         <h4 className="text-white text-[13px] font-bold uppercase tracking-wide truncate" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{t.name}</h4>
                         <p className="text-white/80 text-[11px] font-medium truncate" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{t.role}</p>
                       </div>
                     </div>
                     <div className="bg-[#f2f2f2] rounded-[16px] p-6 flex flex-col flex-1 shadow-sm relative overflow-hidden">
                       <div className="flex justify-between items-start z-10">
                         <StarGroup />
                         {t.icon}
                       </div>
                       <p className="mt-auto text-[#1A422D] text-[14px] sm:text-[15px] xl:text-[16px] font-black uppercase leading-[1.4] tracking-wide z-10" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                         "{t.quote}"
                       </p>
                     </div>
                   </>
                 )}
                 
               </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ClientTestimonialsSection
