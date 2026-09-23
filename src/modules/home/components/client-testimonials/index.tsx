"use client"

import { useRef } from "react"
import { inter, montserrat, outfit } from "@lib/fonts"

/**
 * Client Testimonials Section
 * Hardcoded fallback data ensures the section always renders.
 * CMS data (sectionTitle, sectionDescription, testimonials) is
 * overlaid on top when provided by the parent.
 */

// ── Types ────────────────────────────────────────────────────────────────────
interface Testimonial {
  id: string | number
  name: string
  role: string
  quote: string
  avatar: string
}

interface ClientTestimonialsProps {
  sectionTitle?: string | null
  sectionDescription?: string | null
  testimonials?: Testimonial[] | null
}

// ── Hardcoded fallback testimonials ──────────────────────────────────────────
const testimonialsFallback: Testimonial[] = [
  {
    id: 1,
    name: "Jones Charles",
    role: "Big Bike Owner",
    quote:
      "Sixth Gear handled my PMS and accessory installs with care and transparency. Clean work, proper tools, and honest advice. You can tell this shop is run by riders who actually care.",
    avatar: "",
  },
  {
    id: 2,
    name: "Mike Shinoda",
    role: "Adventure Rider",
    quote:
      "I've had multiple bikes serviced here. From diagnostics to detailing, the quality is consistent. Plus, having good coffee while waiting is a big bonus.",
    avatar: "",
  },
  {
    id: 3,
    name: "Peter Jaksen",
    role: "Touring Enthusiast",
    quote:
      "Fast turnaround without compromising quality. They explained everything clearly and didn't upsell unnecessary work. Highly recommended for premium motorcycles.",
    avatar: "",
  },
  {
    id: 4,
    name: "Anama Menen",
    role: "Daily Rider",
    quote:
      "From emergency towing to full service, Sixth Gear delivered. Professional team, clean shop, and very approachable staff. This is now my go-to moto shop.",
    avatar: "",
  },
  {
    id: 5,
    name: "Carlo Reyes",
    role: "Sportbike Rider",
    quote:
      "They installed my exhaust, lights, and accessories perfectly. Wiring was clean and properly routed. Attention to detail here is on another level.",
    avatar: "",
  },
  {
    id: 6,
    name: "Mark Villanueva",
    role: "Big Bike First-Time Owner",
    quote:
      "As a new big bike owner, I appreciated how patient and informative the team was. They guided me through proper maintenance and safety checks.",
    avatar: "",
  },
  {
    id: 7,
    name: "Jason Lim",
    role: "Cafe Racer Builder",
    quote:
      "Great balance of technical skill and taste. They helped me with parts selection and installation without rushing the process. Solid workmanship.",
    avatar: "",
  },
  {
    id: 8,
    name: "Paolo Santos",
    role: "Weekend Rider",
    quote:
      "Dropped by for detailing and ended up staying for coffee and conversation. Friendly atmosphere with serious service capability. Rare combination.",
    avatar: "",
  },
  {
    id: 9,
    name: "Kevin Tan",
    role: "Long-Distance Rider",
    quote:
      "I trust Sixth Gear before any long ride. Pre-ride inspections are thorough, and they don't cut corners. Peace of mind every time.",
    avatar: "",
  },
  {
    id: 10,
    name: "Andrew Cruz",
    role: "Motorcycle Enthusiast",
    quote:
      "Good service, fair pricing, and clear communication. You always know what you're paying for and why. That alone sets them apart.",
    avatar: "",
  },
]

// ── Sub-components ───────────────────────────────────────────────────────────
const QuoteIcon = () => (
  <svg
    width="32"
    height="24"
    viewBox="0 0 32 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-black"
  >
    <path
      d="M0 15.6C0 9.8 1.6 5.6 4.8 3C8 0.4 11.6 -0.6 15.6 0L13.8 4.8C11.8 4.8 10 5.4 8.4 6.6C6.8 7.8 6 9.4 6 11.4V12H12V24H0V15.6ZM18 15.6C18 9.8 19.6 5.6 22.8 3C26 0.4 29.6 -0.6 33.6 0L31.8 4.8C29.8 4.8 28 5.4 26.4 6.6C24.8 7.8 24 9.4 24 11.4V12H30V24H18V15.6Z"
      fill="currentColor"
    />
  </svg>
)

// Star rating display
const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5 justify-center mb-4">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-4 h-4 text-[#F16D34]" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-[#eeeeee] rounded-2xl p-6 md:p-8 flex flex-col h-full border border-[#e0e0e0] hover:shadow-lg hover:border-[#F16D34]/20 transition-all duration-300 min-w-[300px] md:min-w-[360px] max-w-[360px]">
    {/* Quote icon */}
    <div className="mb-3 flex justify-center">
      <QuoteIcon />
    </div>

    {/* Quote text */}
    <p
      className={`${inter.className} text-gray-700 text-sm md:text-base leading-relaxed flex-grow mb-6 italic text-center`}
    >
      &quot;{testimonial.quote}&quot;
    </p>

    {/* Divider */}
    <div className="w-12 h-0.5 bg-black/20 mx-auto mb-4" />

    {/* Author */}
    <div className="flex flex-col items-center text-center mt-auto">

      <span
        className={`${montserrat.className} text-gray-900 text-base font-bold mb-1`}
      >
        {testimonial.name}
      </span>
      <span className={`${inter.className} text-black/60 text-xs uppercase tracking-wider font-semibold`}>
        {testimonial.role}
      </span>
    </div>
  </div>
)

// ── Main component ───────────────────────────────────────────────────────────
export default function ClientTestimonials({
  sectionTitle,
  sectionDescription,
  testimonials,
}: ClientTestimonialsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Resolve values — CMS data takes priority, fallback ensures section always renders
  const activeTitle       = sectionTitle       || "What Clients Say"
  const activeDescription = sectionDescription || "Trusted Motorcycle Service, Gear & Rider Experience"
  const activeTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : testimonialsFallback

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360 + 32 // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">

        {/* Header row */}
        <div className="mb-10 md:mb-14 lg:mb-16">
          <div className="mx-auto w-full max-w-[1200px] text-center">
            <h2
              className={`${outfit.className} mb-3 text-[clamp(2.5rem,4.3vw,4.75rem)] font-black leading-[0.98] tracking-[-0.04em] text-[#241015] [text-wrap:balance] md:mb-4`}
            >
              {activeTitle}
            </h2>
            <p className={`${inter.className} mx-auto max-w-[760px] text-base font-medium leading-[1.35] tracking-[-0.02em] text-black/70 md:text-xl lg:text-2xl`}>
              {activeDescription}
            </p>
          </div>

        </div>

        {/* Testimonials carousel */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 gap-6 md:gap-8 snap-x snap-mandatory scrollbar-hide -mx-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {activeTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="snap-center flex-shrink-0">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-2 md:mt-4">
          <button
            onClick={() => scroll("left")}
            className="w-12 h-12 flex items-center justify-center bg-[#FF5000] hover:bg-[#e54800] text-white transition-all duration-300 active:scale-95"
            aria-label="Previous testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-12 h-12 flex items-center justify-center bg-[#FF5000] hover:bg-[#e54800] text-white transition-all duration-300 active:scale-95"
            aria-label="Next testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll hint on mobile */}
        <p className={`${inter.className} text-gray-400 text-xs text-center mt-4 md:hidden`}>
          Swipe to read more reviews
        </p>

      </div>
    </section>
  )
}
