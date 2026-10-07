"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { nationalCompressed } from "@lib/fonts"
import { MOTION_OK } from "@modules/about/motion"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type MarqueeBrand = { id: string; name: string }

/** Resting speed in px per second. */
const BASE_SPEED = 45
/** Scroll velocity (px/s) that adds one extra "base speed". */
const VELOCITY_PER_BOOST = 250
const MAX_BOOST = 8

const LIST_CLASS =
  "flex shrink-0 items-center gap-12 md:gap-20 motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:px-4"
const WORDMARK_CLASS = `${nationalCompressed.className} whitespace-nowrap uppercase leading-none text-black text-[clamp(1.75rem,3.2vw,3rem)]`

/**
 * Brand names from the Shopify brand collections as black wordmarks.
 * Moves left to right; scrolling up turns it right to left. Scroll speed adds a
 * boost that eases back to the resting speed in the last direction.
 *
 * ponytail: brand names, not logo images. The brand collection images are
 * photos or logos on solid backgrounds, which brightness(0) turns into black
 * boxes. Swap in logo files once each brand has a transparent logo.
 */
export default function BrandMarquee({ brands }: { brands: MarqueeBrand[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      const list = listRef.current
      if (!track || !list) return

      const media = gsap.matchMedia()

      media.add(MOTION_OK, () => {
        const state = { x: 0, direction: 1, boost: 0 }
        let loopWidth = 0

        const measure = () => {
          const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
          loopWidth = list.offsetWidth + gap
          state.x = gsap.utils.wrap(-loopWidth, 0, state.x || -loopWidth)
        }
        measure()
        document.fonts?.ready.then(measure)

        const setX = gsap.quickSetter(track, "x", "px")
        const tick = (_time: number, deltaMs: number) => {
          if (!loopWidth) return
          state.x += state.direction * BASE_SPEED * (1 + state.boost) * (deltaMs / 1000)
          state.x = gsap.utils.wrap(-loopWidth, 0, state.x)
          setX(state.x)
        }
        gsap.ticker.add(tick)

        let boostTween: gsap.core.Tween | null = null
        const scroll = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            // Down (1) keeps left to right; up (-1) runs right to left.
            state.direction = self.direction
            const target = Math.min(
              Math.abs(self.getVelocity()) / VELOCITY_PER_BOOST,
              MAX_BOOST
            )
            state.boost = Math.max(state.boost, target)
            boostTween?.kill()
            boostTween = gsap.to(state, {
              boost: 0,
              duration: 1.2,
              ease: "power2.out",
            })
          },
        })

        window.addEventListener("resize", measure)

        return () => {
          window.removeEventListener("resize", measure)
          gsap.ticker.remove(tick)
          boostTween?.kill()
          scroll.kill()
          gsap.set(track, { clearProps: "transform" })
        }
      })

      return () => media.revert()
    },
    { scope: rootRef, dependencies: [brands.length] }
  )

  if (brands.length === 0) return null

  return (
    <div ref={rootRef} className="overflow-hidden bg-grey-10 py-8 md:py-11">
      <div className="[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] motion-reduce:[mask-image:none]">
        <div
          ref={trackRef}
          className="flex w-max gap-12 will-change-transform md:gap-20 motion-reduce:w-full motion-reduce:justify-center motion-reduce:will-change-auto"
        >
          <ul ref={listRef} aria-label="Brands we carry" className={LIST_CLASS}>
            {brands.map((brand) => (
              <li key={brand.id} className={WORDMARK_CLASS}>
                {brand.name}
              </li>
            ))}
          </ul>
          {/* Copy for the seamless loop; hidden from screen readers. */}
          <ul aria-hidden="true" className={`${LIST_CLASS} motion-reduce:hidden`}>
            {brands.map((brand) => (
              <li key={brand.id} className={WORDMARK_CLASS}>
                {brand.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
