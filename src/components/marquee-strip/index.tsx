"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Star } from "lucide-react"

gsap.registerPlugin(useGSAP)

const TAGLINES = [
  "RIDER-BUILT EXPERIENCE",
  "TRUSTED BY RIDERS",
  "FAST TURNAROUND",
  "GENUINE PARTS AND EXPERIENCE",
]

function MarqueePhraseSet({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={hidden ? "true" : undefined}
    >
      {TAGLINES.map((tagline) => (
        <div
          key={tagline}
          className="flex shrink-0 items-center gap-5 px-5 sm:gap-7 sm:px-7 md:gap-9 md:px-9"
        >
          <span
            className="whitespace-nowrap text-[22px] font-normal uppercase leading-none text-[#141414] sm:text-[30px] md:text-[38px] lg:text-[44px]"
            style={{ fontFamily: "Tanker, var(--font-montserrat), sans-serif" }}
          >
            {tagline}
          </span>
          <Star
            aria-hidden="true"
            className="h-5 w-5 shrink-0 fill-[#141414] text-[#141414] sm:h-6 sm:w-6 md:h-7 md:w-7"
            strokeWidth={2.25}
          />
        </div>
      ))}
    </div>
  )
}

export default function MarqueeStrip() {
  const stripRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      if (!trackRef.current) return

      const media = gsap.matchMedia()

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(trackRef.current, { xPercent: 0 })
        const timeline = gsap.timeline({ paused: true })
        timelineRef.current = timeline

        return () => {
          timeline.kill()
          timelineRef.current = null
        }
      })

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(trackRef.current, { xPercent: 0 })
        const timeline = gsap.timeline({
          repeat: -1,
          ease: "none",
          defaults: { ease: "none" },
        })

        timeline.to(trackRef.current, {
          xPercent: -50,
          duration: 24,
          ease: "none",
        })

        timelineRef.current = timeline

        return () => {
          timeline.kill()
          timelineRef.current = null
        }
      })

      return () => media.revert()
    },
    { scope: stripRef }
  )

  const slowTimeline = () => {
    if (!timelineRef.current) return

    gsap.to(timelineRef.current, {
      timeScale: 0.25,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  const restoreTimeline = () => {
    if (!timelineRef.current) return

    gsap.to(timelineRef.current, {
      timeScale: 1,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  return (
    <section
      ref={stripRef}
      className="w-full overflow-hidden bg-[#F5841F] py-3 sm:py-4 md:py-5"
      aria-label="SixthGearMoto highlights"
      onMouseEnter={slowTimeline}
      onMouseLeave={restoreTimeline}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <MarqueePhraseSet />
        <MarqueePhraseSet hidden />
      </div>
    </section>
  )
}
