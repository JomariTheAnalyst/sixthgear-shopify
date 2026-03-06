import React from "react"

const AboutUsSection = () => {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <span 
            className="text-[#D95436] text-xl sm:text-2xl block mb-2"
            style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
          >
            About Us
          </span>
          <h2 
            className="text-[#1A422D] text-[28px] sm:text-[36px] md:text-[44px] leading-[1.1] font-black uppercase tracking-tight max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            THE HEART BEHIND EVERY<br className="hidden md:block" /> BREW EXPERIENCE
          </h2>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column - 2 Cards */}
          <div className="flex flex-col gap-6 lg:gap-8 justify-between">
            {/* Card 1 */}
            <div className="bg-[#f4f4f4] rounded-2xl p-8 flex-1 flex flex-col justify-center transition-transform hover:-translate-y-1">
              <div className="bg-[#1A422D] text-white w-12 h-12 rounded-[10px] flex items-center justify-center mb-6 shadow-md">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {/* Coffee Cup */}
                  <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
                </svg>
              </div>
              <h3 className="text-[#1A422D] font-extrabold text-[17px] sm:text-[19px] uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                SPECIALTY COFFEE
              </h3>
              <p className="text-[#1A422D]/70 text-[14px] leading-[1.6] font-medium" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Expertly crafted with passion and care. Savor the rich taste of specialty coffee.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#f4f4f4] rounded-2xl p-8 flex-1 flex flex-col justify-center transition-transform hover:-translate-y-1">
              <div className="bg-[#1A422D] text-white w-12 h-12 rounded-[10px] flex items-center justify-center mb-6 shadow-md">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {/* Cozy Ambiance (Cocktail / Drink) */}
                  <path d="M21,5V4 A2,2 0 0,0 19,2 H5 A2,2 0 0,0 3,4 V5 L11,13 V19 H7 V21 H17 V19 H13 V13 L21,5 M5,4 H19 V5.5 L12,12.5 L5,5.5 V4 Z" />
                </svg>
              </div>
              <h3 className="text-[#1A422D] font-extrabold text-[17px] sm:text-[19px] uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                COZY AMBIANCE
              </h3>
              <p className="text-[#1A422D]/70 text-[14px] leading-[1.6] font-medium" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Soft lights and relaxing vibes surround you. Enjoy every moment in our cozy ambiance.
              </p>
            </div>
          </div>

          {/* Middle Column - Central Image */}
          <div className="w-full h-[400px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden shadow-lg relative order-first lg:order-none mb-6 lg:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80" 
              alt="Barista at espresso machine" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Right Column - 2 Cards */}
          <div className="flex flex-col gap-6 lg:gap-8 justify-between">
            {/* Card 3 */}
            <div className="bg-[#f4f4f4] rounded-2xl p-8 flex-1 flex flex-col justify-center transition-transform hover:-translate-y-1">
              <div className="bg-[#1A422D] text-white w-12 h-12 rounded-[10px] flex items-center justify-center mb-6 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* Grinder / Baked Goods Icon */}
                  <rect x="6" y="2" width="12" height="6" rx="1" />
                  <path d="M12 22V8" />
                  <path d="M8 13h8" />
                  <path d="M8 17h8" />
                  <path d="M4 22h16" />
                </svg>
              </div>
              <h3 className="text-[#1A422D] font-extrabold text-[17px] sm:text-[19px] uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                FRESHLY BAKED GOODS
              </h3>
              <p className="text-[#1A422D]/70 text-[14px] leading-[1.6] font-medium" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Baked fresh daily with love and care. Taste the homemade warmth in every bite.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#f4f4f4] rounded-2xl p-8 flex-1 flex flex-col justify-center transition-transform hover:-translate-y-1">
              <div className="bg-[#1A422D] text-white w-12 h-12 rounded-[10px] flex items-center justify-center mb-6 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* Kettle / Maker */}
                  <path d="M12 2C8.686 2 6 4.686 6 8v12h12V8c0-3.314-2.686-6-6-6z" />
                  <path d="M16 10h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4" />
                  <path d="M8 2h8" />
                  <path d="M6 10H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
                </svg>
              </div>
              <h3 className="text-[#1A422D] font-extrabold text-[17px] sm:text-[19px] uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                EXPERT BARISTAS
              </h3>
              <p className="text-[#1A422D]/70 text-[14px] leading-[1.6] font-medium" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Skilled hands craft every cup perfectly. Experience coffee made by expert baristas.
              </p>
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12 sm:mt-16">
          <button 
            className="bg-[#1A422D] text-white font-bold text-sm tracking-widest uppercase px-12 py-4 rounded-[12px] hover:brightness-110 active:translate-y-1 transition-all shadow-[0_6px_0_0_rgba(26,66,45,0.2)]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            READ MORE
          </button>
        </div>
      </div>
    </section>
  )
}

export default AboutUsSection
