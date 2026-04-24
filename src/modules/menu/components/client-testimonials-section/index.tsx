"use client"

import { useRef, useState } from "react"
import { inter, montserrat } from "@lib/fonts"

type Testimonial = {
  id: number
  name: string
  role: string
  quote: string
  avatar: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Jones Charles",
    role: "Big Bike Owner",
    quote:
      "Sixth Gear handled my PMS and accessory installs with care and transparency. Clean work, proper tools, and honest advice. You can tell this shop is run by riders who actually care.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 2,
    name: "Mike Shinoda",
    role: "Adventure Rider",
    quote:
      "I've had multiple bikes serviced here. From diagnostics to detailing, the quality is consistent. Plus, having good coffee while waiting is a big bonus.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 3,
    name: "Peter Jaksen",
    role: "Touring Enthusiast",
    quote:
      "Fast turnaround without compromising quality. They explained everything clearly and didn't upsell unnecessary work. Highly recommended for premium motorcycles.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 4,
    name: "Anama Menen",
    role: "Daily Rider",
    quote:
      "From emergency towing to full service, Sixth Gear delivered. Professional team, clean shop, and very approachable staff. This is now my go-to moto shop.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 5,
    name: "Carlo Reyes",
    role: "Sportbike Rider",
    quote:
      "They installed my exhaust, lights, and accessories perfectly. Wiring was clean and properly routed. Attention to detail here is on another level.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 6,
    name: "Mark Villanueva",
    role: "Big Bike First-Time Owner",
    quote:
      "As a new big bike owner, I appreciated how patient and informative the team was. They guided me through proper maintenance and safety checks.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 7,
    name: "Jason Lim",
    role: "Cafe Racer Builder",
    quote:
      "Great balance of technical skill and taste. They helped me with parts selection and installation without rushing the process. Solid workmanship.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 8,
    name: "Paolo Santos",
    role: "Weekend Rider",
    quote:
      "Dropped by for detailing and ended up staying for coffee and conversation. Friendly atmosphere with serious service capability. Rare combination.",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 9,
    name: "Kevin Tan",
    role: "Long-Distance Rider",
    quote:
      "I trust Sixth Gear before any long ride. Pre-ride inspections are thorough, and they don't cut corners. Peace of mind every time.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&q=80&fit=crop&crop=faces",
  },
  {
    id: 10,
    name: "Andrew Cruz",
    role: "Motorcycle Enthusiast",
    quote:
      "Good service, fair pricing, and clear communication. You always know what you're paying for and why. That alone sets them apart.",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=160&q=80&fit=crop&crop=faces",
  },
]

const Stars = () => (
  <div className="flex justify-center gap-1 text-[#ff5000]">
    {Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className="h-8 w-8 sm:h-9 sm:w-9"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: Testimonial
  index: number
}) => {
  const offsetClass = index % 2 === 0 ? "lg:mt-5" : "lg:mt-0"

  return (
    <article
      className={`${offsetClass} relative flex h-[470px] w-[305px] flex-none flex-col items-center overflow-hidden rounded-[24px] bg-[#f6f1e8] px-7 py-10 text-center sm:h-[500px] sm:w-[350px] md:w-[370px] lg:h-[540px] lg:w-[390px]`}
    >
      <Stars />

      <h3
        className={`${montserrat.className} mt-8 max-w-[280px] text-[24px] font-black uppercase leading-[1.08] tracking-[-0.06em] text-[#1f1f1f] sm:text-[29px]`}
      >
        {testimonial.role}
      </h3>

      <p
        className={`${inter.className} mt-5 max-w-[292px] text-[14px] font-medium leading-7 text-[#4c4c4c] sm:text-[15px]`}
      >
        {testimonial.quote}
      </p>

      <div className="mt-auto flex flex-col items-center">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="h-16 w-16 rounded-[18px] object-cover"
        />
        <p className={`${inter.className} mt-3 text-sm font-semibold text-[#4b4b4b]`}>
          {testimonial.name}
        </p>
      </div>
    </article>
  )
}

const ClientTestimonialsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return

    const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth ?? 340
    const gap = window.innerWidth >= 640 ? 8 : 8
    const nextIndex = Math.max(0, Math.min(TESTIMONIALS.length - 1, index))

    setActiveIndex(nextIndex)
    scrollContainerRef.current.scrollTo({
      left: nextIndex * (cardWidth + gap),
      behavior: "smooth",
    })
  }

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <style>{`
        .first-gear-testimonials::-webkit-scrollbar { display: none; }
        .first-gear-testimonials { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="first-gear-testimonials flex gap-2 overflow-x-auto scroll-smooth pl-0 pr-5 pb-8 pt-2 sm:pr-8 lg:pr-[max(32px,calc((100vw-1180px)/2))]"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        <div className="mx-auto flex max-w-[1180px] items-center justify-center gap-5 px-5">
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5000] text-white transition-transform hover:scale-105 active:scale-95"
            aria-label="Previous testimonials"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            {TESTIMONIALS.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => scrollToIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  activeIndex === index ? "bg-[#ff5000]" : "bg-[#e4d9ca]"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5000] text-white transition-transform hover:scale-105 active:scale-95"
            aria-label="Next testimonials"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ClientTestimonialsSection
