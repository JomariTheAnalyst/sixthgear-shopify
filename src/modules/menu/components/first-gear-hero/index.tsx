"use client"

export interface FirstGearHeroData {
  pageTitle?: string
  pageSubtitle?: string
  backgroundImage?: string | null
}

interface FirstGearHeroProps {
  heroData?: FirstGearHeroData | null
  onMenuClick: () => void
}

const HERO_IMAGES = {
  portrait: "/images/firstgear-coffee/coffee-portrait.jpg",
} as const

export default function FirstGearHero({
  heroData,
  onMenuClick,
}: FirstGearHeroProps) {
  return (
    <section className="relative bg-white pt-8 sm:pt-16 md:pt-24 lg:pt-32 pb-16 sm:pb-24 md:pb-40 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 text-white">
        <svg
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          className="w-[calc(100%+1px)] h-[16px] sm:h-[24px] md:h-[40px] block"
          fill="currentColor"
        >
          <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
        </svg>
      </div>

      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-8 items-center">
          <div className="relative z-10 lg:pr-6 flex flex-col items-center text-center md:items-start md:text-left mt-8 lg:mt-0">
            <div
              className="text-[#f16d34] text-[10px] sm:text-xs font-bold tracking-[2px] sm:tracking-[3px] uppercase mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              FIRST GEAR COFFEE. EST 2023 - MAKATI, PHILIPPINES
            </div>

            <div className="relative inline-block z-20">
              <h1
                className="text-[#222222] text-[44px] sm:text-[56px] md:text-[64px] lg:text-[70px] xl:text-[80px] leading-[1.05] tracking-tight uppercase"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontWeight: 900,
                }}
              >
                PRECISION
                <br />
                <span className="text-[#f16d34]">IN EVERY</span>
                <br />
                POUR.
              </h1>

              <div className="hidden md:block absolute top-[50%] -right-[8%] md:-right-[10%] lg:-right-[12%] transform rotate-[10deg] pointer-events-none drop-shadow-lg scale-90 lg:scale-100 h-fit w-fit">
                <svg
                  width="120"
                  height="120"
                  viewBox="-10 -10 120 120"
                  className="overflow-visible"
                >
                  <path
                    d="M50 0L56.1264 16.3533L72.8252 6.09673L74.0152 23.447L92.7441 19.3005L88.0827 37.8924L103.951 40.4074L93.2081 55.4338L103.012 73.1362L86.1366 77.2657L89.4312 95.8277L72.2605 92.5152L64.2127 108.318L50 96L35.7873 108.318L27.7395 92.5152L10.5688 95.8277L13.8634 77.2657L-3.01184 73.1362L6.79189 55.4338L-3.95115 40.4074L11.9173 37.8924L7.25595 19.3005L25.9848 23.447L27.1748 6.09673L43.8736 16.3533L50 0Z"
                    fill="#222222"
                    stroke="#f16d34"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <text
                    x="50"
                    y="47"
                    fill="white"
                    fontSize="14"
                    fontWeight="800"
                    fontFamily="var(--font-montserrat), sans-serif"
                    textAnchor="middle"
                    letterSpacing="1"
                    transform="rotate(-5, 50, 50)"
                  >
                    GOOD
                  </text>
                  <text
                    x="50"
                    y="65"
                    fill="white"
                    fontSize="14"
                    fontWeight="800"
                    fontFamily="var(--font-montserrat), sans-serif"
                    textAnchor="middle"
                    letterSpacing="1"
                    transform="rotate(-5, 50, 50)"
                  >
                    VIBES
                  </text>
                </svg>
              </div>
            </div>

            <p
              className="mt-6 md:mt-8 text-[#222222]/80 text-sm md:text-[15px] font-medium max-w-[420px] leading-relaxed"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {heroData?.pageSubtitle ||
                "Start your day right with freshly brewed coffee made to energize your mornings and satisfy your senses."}
            </p>

            <div className="mt-8 md:mt-10">
              <button
                onClick={onMenuClick}
                className="bg-[#f16d34] text-white text-xs md:text-[13px] font-bold tracking-wider uppercase px-8 py-3.5 rounded-xl border border-transparent hover:brightness-110 transition-all active:translate-y-1 w-full sm:w-auto"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  boxShadow: "0 6px 0 0 rgba(0,0,0,0.15)",
                }}
              >
                SEE THE MENU
              </button>
            </div>

            <div className="mt-12 md:mt-16 sm:mt-20 grid grid-cols-3 gap-2 sm:gap-4 max-w-[340px] w-full">
              <div className="border border-[#222222]/10 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-[#222222]/5 to-transparent flex flex-col items-center justify-center aspect-square shadow-sm">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-[#f16d34] mb-2 sm:mb-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                <span
                  className="text-[9px] sm:text-[11px] font-bold text-center text-[#222222] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  QUALITY
                  <br />
                  FIRST
                </span>
              </div>

              <div className="border border-[#222222]/10 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-[#222222]/5 to-transparent flex flex-col items-center justify-center aspect-square shadow-sm">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-[#f16d34] mb-2 sm:mb-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 4 13C4 8.6 7 5 11 5a7 7 0 0 1 7 7c0 4.4-3 8-7 8Z" />
                  <path d="M11 5v15" />
                  <path d="M11 13a4 4 0 0 0 4-4" />
                </svg>
                <span
                  className="text-[9px] sm:text-[11px] font-bold text-center text-[#222222] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  FRESH
                  <br />
                  BEANS
                </span>
              </div>

              <div className="border border-[#222222]/10 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-[#222222]/5 to-transparent flex flex-col items-center justify-center aspect-square shadow-sm">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-[#f16d34] mb-2 sm:mb-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span
                  className="text-[9px] sm:text-[11px] font-bold text-center text-[#222222] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  COFFEE
                  <br />
                  COMMUNITY
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex relative w-full h-[450px] md:h-[550px] lg:h-[700px] mt-2 lg:mt-0 items-center justify-center pointer-events-none drop-shadow-2xl">
            <div className="absolute top-[12%] right-[10%] lg:right-[4%] w-[65%] lg:w-[85%] aspect-[3/4] border-[12px] border-white rounded-[4px] shadow-lg transform rotate-[6deg] overflow-hidden bg-gray-200">
              <img
                src={HERO_IMAGES.portrait}
                alt="First Gear Coffee portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
