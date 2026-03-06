"use client"

import React from "react"

const CheckOutBeansSection = () => {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Banner Container */}
        <div className="bg-[#222222] rounded-[32px] md:rounded-[40px] px-8 py-12 md:px-16 md:py-0 flex flex-col md:flex-row items-center justify-between relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-[#333333]">
          
          {/* Text Content */}
          <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left z-10 md:py-20 relative">
            
            {/* Hand-drawn Arrow SVG */}
            <div className="absolute top-[8%] right-[10%] hidden md:block text-white/40">
               <svg 
                 width="65" 
                 height="65" 
                 viewBox="0 0 100 100" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="2.5" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
                 className="transform rotate-[-5deg]"
               >
                 {/* Curving arrow pointing from text to the beans */}
                 <path d="M10,10 Q60,30 85,75" />
                 <path d="M65,75 L85,75 L80,55" />
               </svg>
            </div>

            <h2 
              className="text-white text-[36px] sm:text-[42px] md:text-[52px] leading-[1.15] font-bold mb-8 tracking-tight"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Check out our <br className="hidden md:block" />
              best coffee beans
            </h2>

            <button 
              className="group bg-[#432616] sm:bg-[#341d11] text-white border border-white/10 text-[15px] font-bold rounded-full px-8 py-4 flex items-center transition-all hover:bg-white hover:text-[#222222] shadow-lg"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Explore our products
              <svg className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Image Container - Floating on the right */}
          <div className="w-full md:w-[45%] mt-12 md:mt-0 flex justify-center md:justify-end relative items-center">
            {/* 
              In the real design, this is a transparent coffee sack PNG. 
              Since we are using Unsplash placeholder, we use an organic rounded full circle 
              to match well with the dark theme until you replace it with your transparent image.
            */}
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] z-20 md:-my-10 flex justify-center items-center">
              <img 
                src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800"
                alt="Sack of Coffee Beans"
                className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-[#222222]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CheckOutBeansSection
