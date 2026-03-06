"use client"

import React from "react"

const NewsletterSection = () => {
  return (
    <section className="bg-white py-20 lg:py-28 px-5 sm:px-8 md:px-12">
      <div className="max-w-[1240px] mx-auto bg-[#dd5d36] rounded-[16px] sm:rounded-[24px] py-16 sm:py-20 md:py-28 px-6 sm:px-10 text-center relative overflow-hidden">
        
        {/* Subtitle / Overline */}
        <span 
          className="text-white text-[18px] sm:text-[22px] md:text-[26px] block mb-4 sm:mb-6"
          style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
        >
          Our Newsletter
        </span>

        {/* Main Heading */}
        <h2 
          className="text-white text-[28px] sm:text-[36px] md:text-[44px] lg:text-[48px] leading-[1.2] font-black uppercase tracking-tight max-w-[800px] mx-auto mb-6 sm:mb-8 relative z-10"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          COME FOR THE COFFEE, STAY FOR<br className="hidden md:block" /> THE CREW. WE ARE YOUR DAILY<br className="hidden md:block" /> HANGOUT SPOT.
        </h2>

        {/* Subtext */}
        <p 
          className="text-white/95 text-[14px] sm:text-[16px] md:text-[18px] mb-10 sm:mb-12 relative z-10"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Get 25% off on your first order just by subscribing to our newsletter
        </p>

        {/* Form Container */}
        <form 
          className="relative z-10 max-w-[640px] mx-auto bg-white rounded-[12px] p-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-2 shadow-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <input 
            type="email" 
            placeholder="Enter Email Address" 
            className="w-full bg-transparent border-none outline-none px-4 sm:px-6 py-4 text-[#222222] text-[15px] sm:text-[16px] font-medium placeholder:text-gray-500"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
            required
          />
          <button 
            type="submit"
            className="w-full sm:w-auto shrink-0 bg-[#F3B748] text-[#1A422D] text-[13px] md:text-[14px] font-extrabold uppercase px-8 py-4 rounded-[8px] border-2 border-[#1A422D] tracking-widest transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0px_0px_#1A422D] shadow-[3px_3px_0px_0px_#1A422D] hover:brightness-105"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            SUBSCRIBE NOW
          </button>
        </form>

      </div>
    </section>
  )
}

export default NewsletterSection
