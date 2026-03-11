"use client"

import React, { useRef } from "react"

const GALLERY_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", alt: "Cafe interior with espresso machine" },
  { id: 2, src: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80", alt: "Barista preparing coffee" },
  { id: 3, src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", alt: "Coffee shop atmosphere" },
  { id: 4, src: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80", alt: "Coffee and pastries" },
  { id: 5, src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", alt: "Pouring latte art" },
  { id: 6, src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80", alt: "Cozy corner in the cafe" },
  { id: 7, src: "https://images.unsplash.com/photo-1521017432531-fbd92076e512?w=800&q=80", alt: "Freshly roasted coffee beans" },
  { id: 8, src: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80", alt: "Customer enjoying coffee" }
]

const GallerySection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative bg-[#F3B748] py-24 sm:py-32 overflow-hidden z-20 w-full">
      {/* Hide Scrollbar Snippet */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Torn Top Edge Overlay (White) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 text-white transform rotate-180">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[16px] sm:h-[24px] md:h-[32px] block" fill="currentColor">
          <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20 px-5 sm:px-8">
          <span 
            className="text-[#222222] text-[18px] sm:text-[22px] block mb-2"
            style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
          >
            Gallery
          </span>
          <h2 
            className="text-[#222222] text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] font-black uppercase tracking-tight max-w-[800px] mx-auto"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            A VISUAL JOURNEY<br /> THROUGH OUR COFFEE<br className="hidden sm:block" /> AND COZY SPACE
          </h2>
        </div>

        <div className="relative w-full overflow-hidden px-4 sm:px-8 md:px-12">
          {/* Navigation Buttons (Desktop & Tablet) */}
          <button 
            onClick={() => {
              if (scrollContainerRef.current) {
                const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
                scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
              }
            }}
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white text-[#222222] items-center justify-center hover:bg-[#222222] hover:text-white transition-colors shadow-lg"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={() => {
              if (scrollContainerRef.current) {
                const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
                scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
              }
            }}
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white text-[#222222] items-center justify-center hover:bg-[#222222] hover:text-white transition-colors shadow-lg"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 items-center"
            style={{ paddingLeft: 'min(5vw, 24px)', paddingRight: 'min(5vw, 24px)' }}
          >
            {GALLERY_IMAGES.map((image) => (
              <div 
                key={image.id}
                className="snap-center shrink-0 w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] 
                           aspect-[3/4] sm:aspect-[4/5] rounded-[16px] sm:rounded-[20px] shadow-lg overflow-hidden group hover:-translate-y-2 transition-transform duration-300 relative"
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8 md:hidden">
            <button 
              onClick={() => {
                if (scrollContainerRef.current) {
                  const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
                  scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                }
              }}
              className="w-12 h-12 rounded-full bg-white/20 text-[#222222] border-2 border-[#222222] flex items-center justify-center hover:bg-[#222222] hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => {
                if (scrollContainerRef.current) {
                  const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
                  scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
                }
              }}
              className="w-12 h-12 rounded-full bg-[#222222] text-white flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Torn Bottom Edge Overlay (White) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 text-white">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[16px] sm:h-[24px] md:h-[32px] block" fill="currentColor">
          <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
        </svg>
      </div>
    </section>
  )
}

export default GallerySection
