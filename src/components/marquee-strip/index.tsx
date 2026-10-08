"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { SOCIAL_LINKS } from "@lib/business"
import { nationalCompressed, nationalCondensed } from "@lib/fonts"

import { createSeamlessLoop, type SeamlessLoop } from "./seamless-loop"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const TOP_ROW_PHRASES = [
  "FOR MORE STORIES",
  "FOLLOW US",
  "FOR CONVERSATION",
  "FOLLOW US",
  "FOR UPDATES",
  "FOLLOW US",
  "TO INQUIRE",
  "FOLLOW US",
] as const

const SOCIAL_ITEMS = [
  { name: "TIKTOK", href: SOCIAL_LINKS.tiktok },
  { name: "FACEBOOK", href: SOCIAL_LINKS.facebook },
  { name: "INSTAGRAM", href: SOCIAL_LINKS.instagram },
] as const

const TOP_ROW_DURATION_SECONDS = 48
const BOTTOM_ROW_DURATION_SECONDS = 24
const BOTTOM_ROW_SLOW_SCALE = 0.35
const MINIMUM_COPIES = 2
/** Scroll velocity (px/s) that adds one extra resting speed. */
const VELOCITY_PER_BOOST = 250
const MAX_BOOST = 6

const topLabelClassName =
  "shrink-0 whitespace-nowrap text-[18px] font-normal uppercase leading-none tracking-[0.025em] sm:text-[22px] lg:text-[26px]"
const socialLabelClassName =
  "shrink-0 whitespace-nowrap text-[52px] font-bold uppercase leading-[0.86] tracking-[-0.025em] transition-colors duration-300 hover:text-[#F16D34] motion-reduce:transition-none sm:text-[72px] md:text-[92px] lg:text-[112px]"

function getGap(track: HTMLElement) {
  const styles = window.getComputedStyle(track)
  return Number.parseFloat(styles.columnGap || styles.gap) || 0
}

function getRequiredCopies(
  items: HTMLElement[],
  baseItemCount: number,
  viewportWidth: number
) {
  const firstRepeatedItem = items[baseItemCount]
  if (!firstRepeatedItem || viewportWidth <= 0) return MINIMUM_COPIES

  const baseWidth = firstRepeatedItem.offsetLeft - items[0].offsetLeft
  if (baseWidth <= 0) return MINIMUM_COPIES

  return Math.max(
    MINIMUM_COPIES,
    Math.ceil(viewportWidth / baseWidth) + 1
  )
}

export default function MarqueeStrip() {
  const stripRef = useRef<HTMLElement | null>(null)
  const topViewportRef = useRef<HTMLDivElement | null>(null)
  const bottomViewportRef = useRef<HTMLDivElement | null>(null)
  const topTrackRef = useRef<HTMLDivElement | null>(null)
  const bottomTrackRef = useRef<HTMLDivElement | null>(null)
  const hoverRef = useRef({ scale: 1 })
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null)
  const [topCopies, setTopCopies] = useState(MINIMUM_COPIES)
  const [bottomCopies, setBottomCopies] = useState(MINIMUM_COPIES)

  useGSAP(
    () => {
      const topViewport = topViewportRef.current
      const bottomViewport = bottomViewportRef.current
      const topTrack = topTrackRef.current
      const bottomTrack = bottomTrackRef.current

      if (!topViewport || !bottomViewport || !topTrack || !bottomTrack) return

      const topItems = gsap.utils.toArray<HTMLElement>(topTrack.children)
      const bottomItems = gsap.utils.toArray<HTMLElement>(
        bottomTrack.children
      )

      const requiredTopCopies = getRequiredCopies(
        topItems,
        TOP_ROW_PHRASES.length,
        topViewport.clientWidth
      )
      const requiredBottomCopies = getRequiredCopies(
        bottomItems,
        SOCIAL_ITEMS.length,
        bottomViewport.clientWidth
      )

      if (
        requiredTopCopies !== topCopies ||
        requiredBottomCopies !== bottomCopies
      ) {
        if (requiredTopCopies !== topCopies) setTopCopies(requiredTopCopies)
        if (requiredBottomCopies !== bottomCopies) {
          setBottomCopies(requiredBottomCopies)
        }
        return
      }

      let topLoop: SeamlessLoop | null = createSeamlessLoop(topItems, {
        durationSeconds: TOP_ROW_DURATION_SECONDS,
        paddingRight: () => getGap(topTrack),
      })
      let bottomLoop: SeamlessLoop | null = createSeamlessLoop(bottomItems, {
        durationSeconds: BOTTOM_ROW_DURATION_SECONDS,
        paddingRight: () => getGap(bottomTrack),
      })

      const media = gsap.matchMedia()
      media.add(
        {
          allowMotion: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const allowMotion = Boolean(context.conditions?.allowMotion)

          if (allowMotion) {
            topLoop?.timeline.play()
            bottomLoop?.timeline.play()

            // A loop playing forward moves right to left. Scrolling down (the
            // default) runs the top row left to right and the bottom row the
            // other way; scrolling up flips both. Scroll speed adds a boost
            // that eases back to the resting speed.
            const state = { direction: 1, boost: 0 }
            const applySpeed = () => {
              const speed = state.direction * (1 + state.boost)
              topLoop?.timeline.timeScale(-speed)
              bottomLoop?.timeline.timeScale(speed * hoverRef.current.scale)
            }
            applySpeed()
            gsap.ticker.add(applySpeed)

            let boostTween: gsap.core.Tween | null = null
            const scroll = ScrollTrigger.create({
              start: 0,
              end: "max",
              onUpdate: (self) => {
                state.direction = self.direction
                state.boost = Math.max(
                  state.boost,
                  Math.min(Math.abs(self.getVelocity()) / VELOCITY_PER_BOOST, MAX_BOOST)
                )
                boostTween?.kill()
                boostTween = gsap.to(state, {
                  boost: 0,
                  duration: 1.2,
                  ease: "power2.out",
                })
              },
            })

            return () => {
              gsap.ticker.remove(applySpeed)
              boostTween?.kill()
              scroll.kill()
            }
          } else {
            topLoop?.timeline.pause(0)
            bottomLoop?.timeline.pause(0)
          }
        }
      )

      const refreshLoops = () => {
        const nextTopCopies = getRequiredCopies(
          topItems,
          TOP_ROW_PHRASES.length,
          topViewport.clientWidth
        )
        const nextBottomCopies = getRequiredCopies(
          bottomItems,
          SOCIAL_ITEMS.length,
          bottomViewport.clientWidth
        )

        if (nextTopCopies !== topCopies || nextBottomCopies !== bottomCopies) {
          if (nextTopCopies !== topCopies) setTopCopies(nextTopCopies)
          if (nextBottomCopies !== bottomCopies) {
            setBottomCopies(nextBottomCopies)
          }
          return
        }

        topLoop?.refresh()
        bottomLoop?.refresh()
      }

      const resizeCall = gsap.delayedCall(0.12, refreshLoops).pause()
      const resizeObserver = new ResizeObserver(() => {
        resizeCall.restart(true)
      })
      resizeObserver.observe(topViewport)
      resizeObserver.observe(bottomViewport)

      let active = true
      document.fonts?.ready.then(() => {
        if (active) resizeCall.restart(true)
      })

      return () => {
        active = false
        hoverTweenRef.current?.kill()
        hoverTweenRef.current = null
        resizeCall.kill()
        resizeObserver.disconnect()
        media.revert()
        topLoop?.kill()
        bottomLoop?.kill()
        topLoop = null
        bottomLoop = null
      }
    },
    {
      scope: stripRef,
      dependencies: [topCopies, bottomCopies],
      revertOnUpdate: true,
    }
  )

  /** Hover/focus slows the social row; the scroll speed multiplies it. */
  const setBottomSpeed = (scale: number) => {
    hoverTweenRef.current?.kill()
    hoverTweenRef.current = gsap.to(hoverRef.current, {
      scale,
      duration: 0.6,
      ease: "power2.out",
    })
  }

  return (
    <section
      ref={stripRef}
      aria-label="Follow SixthGearMoto on social media"
      className="w-full overflow-hidden bg-white py-8 text-[#10232E] sm:py-10 lg:py-12"
    >
      <div ref={topViewportRef} className="overflow-hidden">
        <div
          ref={topTrackRef}
          className={`${nationalCondensed.className} flex w-max items-center gap-10 will-change-transform motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-start motion-reduce:gap-x-8 motion-reduce:gap-y-3 motion-reduce:transform-none motion-reduce:will-change-auto sm:gap-12 lg:gap-16`}
        >
          {Array.from({ length: topCopies }, (_, copyIndex) =>
            TOP_ROW_PHRASES.map((phrase, phraseIndex) => (
              <span
                key={`${copyIndex}-${phrase}-${phraseIndex}`}
                aria-hidden={copyIndex > 0 || undefined}
                className={`${topLabelClassName} ${
                  copyIndex > 0 ? "motion-reduce:hidden" : ""
                }`}
              >
                {phrase}
              </span>
            ))
          )}
        </div>
      </div>

      <div
        ref={bottomViewportRef}
        className="mt-8 overflow-hidden sm:mt-10 lg:mt-12"
      >
        <div
          ref={bottomTrackRef}
          className={`${nationalCompressed.className} flex w-max items-center gap-7 will-change-transform motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-start motion-reduce:gap-x-8 motion-reduce:gap-y-2 motion-reduce:transform-none motion-reduce:will-change-auto sm:gap-9 lg:gap-11`}
        >
          {Array.from({ length: bottomCopies }, (_, copyIndex) =>
            SOCIAL_ITEMS.map((social) => (
              <a
                key={`${copyIndex}-${social.name}`}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  copyIndex === 0
                    ? `${social.name}, opens in a new tab`
                    : undefined
                }
                aria-hidden={copyIndex > 0 || undefined}
                tabIndex={copyIndex > 0 ? -1 : undefined}
                onMouseEnter={() => setBottomSpeed(BOTTOM_ROW_SLOW_SCALE)}
                onMouseLeave={() => setBottomSpeed(1)}
                onFocus={() => setBottomSpeed(BOTTOM_ROW_SLOW_SCALE)}
                onBlur={() => setBottomSpeed(1)}
                className={`${socialLabelClassName} ${
                  copyIndex > 0 ? "motion-reduce:hidden" : ""
                } focus-visible:text-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F16D34]`}
              >
                {social.name}
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
