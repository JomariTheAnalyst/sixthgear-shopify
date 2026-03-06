import React from "react"

interface MarqueeProps {
  items?: string[]
  speed?: number // Duration in seconds. Lower is faster.
  pauseOnHover?: boolean
  className?: string
}

const DEFAULT_ITEMS = [
  "HOT SIPS",
  "EASY FEELS",
  "PURE BEANS",
  "SOFT LIGHT",
  "GOOD VIBES",
]

const StarbucksCupIcon = () => (
  <svg 
    className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-cup-swing" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Lid */}
    <path d="M4 8h16v-1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v1z" />
    {/* Cup Body */}
    <path d="M5.5 8l1.5 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1.5-13" />
    {/* Logo/Sleeve detail */}
    <path d="M6.2 12h11.6" />
    <path d="M6.7 16h10.6" />
    <circle cx="12" cy="14" r="1.2" fill="currentColor" />
  </svg>
)

export const Marquee = ({
  items = DEFAULT_ITEMS,
  speed = 150, // Much slower sliding speed as requested
  pauseOnHover = true,
  className = "",
}: MarqueeProps) => {
  // Multiply items to ensure it stretches well past the screen width before looping
  const repeatedItems = [...items, ...items, ...items, ...items, ...items, ...items]

  return (
    <>
      <style>{`
        @keyframes custom-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-custom-marquee {
          animation: custom-marquee ${speed}s linear infinite;
        }
        .animate-custom-marquee:hover {
          animation-play-state: ${pauseOnHover ? 'paused' : 'running'};
        }

        @keyframes cup-swing {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        .animate-cup-swing {
          animation: cup-swing 4s ease-in-out infinite;
          transform-origin: bottom center;
        }

        @keyframes strip-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-strip-float {
          animation: strip-float 8s ease-in-out infinite;
        }
      `}</style>
    
      <div className={`relative w-full overflow-hidden bg-[#F3B748] py-[16px] sm:py-[22px] md:py-[26px] animate-strip-float ${className}`}>
        {/* Torn Top Edge Overlay - Adjusted to match the exact organic layout from the image */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 text-white transform rotate-180">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[8px] sm:h-[12px] md:h-[16px] block" fill="currentColor">
            <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
          </svg>
        </div>

        <div className="flex w-max animate-custom-marquee">
          {/* Group 1 */}
          <div className="flex shrink-0 items-center justify-around gap-6 sm:gap-12 pr-6 sm:pr-12">
            {repeatedItems.map((text, i) => (
              <div key={`marquee-1-${i}`} className="flex items-center gap-6 sm:gap-12 shrink-0">
                <span 
                  className="text-[#1A422D] text-[16px] sm:text-[20px] md:text-[26px] font-black tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {text}
                </span>
                <div className="text-[#1A422D]">
                  <StarbucksCupIcon />
                </div>
              </div>
            ))}
          </div>
          
          {/* Group 2 (Exact Duplicate for Loop) */}
          <div className="flex shrink-0 items-center justify-around gap-6 sm:gap-12 pr-6 sm:pr-12" aria-hidden="true">
            {repeatedItems.map((text, i) => (
              <div key={`marquee-2-${i}`} className="flex items-center gap-6 sm:gap-12 shrink-0">
                <span 
                  className="text-[#1A422D] text-[16px] sm:text-[20px] md:text-[26px] font-black tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {text}
                </span>
                <div className="text-[#1A422D]">
                  <StarbucksCupIcon />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Torn Bottom Edge Overlay - Adjusted to match exact organic layout */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 text-white">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[8px] sm:h-[12px] md:h-[16px] block" fill="currentColor">
            <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
          </svg>
        </div>
      </div>
    </>
  )
}

export default Marquee
