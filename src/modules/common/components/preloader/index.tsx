"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef, useState } from "react"

import { isPreloaderFresh, PRELOADER_KEY } from "@lib/preloader-config"
import { useLenisScrollLock } from "@modules/common/components/lenis-provider"

import {
  LINE_LEFT_PATH,
  LINE_RIGHT_PATH,
  MARK_PATHS,
  SUB_PATHS,
  WORD_PATHS,
} from "./logo-paths"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const BLOCK_COUNT = 20
// CSS-only fallback in globals.css (sg-preloader-fallback): hides the overlay
// this long after first paint even if JS is slow or fails. Keep in sync.
const FALLBACK_MS = 7000
const FALLBACK_FADE_MS = 300
// Fade used when the scripts start too late to play the full animation.
const LATE_FADE_S = 0.3
const INK = "#0A0B0A"
const INK_CLEAR = "rgba(10, 11, 10, 0)"
const VIEWBOX_W = 2702
// MOTORCYCLE letters start spread out from this x, then close in.
const SUB_CENTER_X = 1350
const SUB_SPREAD = 0.35

type Phase = "idle" | "running" | "done"

// The <head> script decides on a full page load (sg-preloader-skip). The
// timestamp check covers a client-side remount of this layout, e.g. returning
// from checkout, where that script does not run again.
const shouldSkip = () => {
  if (document.documentElement.classList.contains("sg-preloader-skip")) {
    return true
  }
  // Reduced motion: no splash (CSS also hides it from first paint).
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true
  }
  try {
    return isPreloaderFresh(window.localStorage.getItem(PRELOADER_KEY))
  } catch {
    return false
  }
}

const markSeen = () => {
  try {
    window.localStorage.setItem(PRELOADER_KEY, String(Date.now()))
  } catch {}
}

const compact = <T,>(items: (T | null)[]) =>
  items.filter((item): item is T => item !== null)

/** Milliseconds the CSS fallback has been running, i.e. time since first paint. */
const getFallbackElapsed = (root: HTMLElement) => {
  const fallback = root
    .getAnimations?.()
    .find(
      (animation) =>
        (animation as CSSAnimation).animationName === "sg-preloader-fallback"
    )
  const time = Number(fallback?.currentTime ?? 0)
  return Number.isFinite(time) ? time : 0
}

/**
 * Preloader shown when the last visit was over PRELOADER_TTL_MS ago, matching the approved
 * sixthgear-preloader-preview.html: the mark draws and fills, SIXTHGEAR
 * rises, the side lines and MOTORCYCLE close in, then the logo fades and 20
 * columns wipe away. The markup is server-rendered so it covers the page from
 * first paint; html.sg-preloader-skip (set before paint in app/layout.tsx)
 * hides it on repeat loads, and it is skipped for reduced motion.
 * It closes as soon as the animation ends (it never waits for page load). A
 * CSS fallback hides it FALLBACK_MS after first paint even without JS.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("idle")
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const logoLayerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const lineLeftRef = useRef<SVGPathElement | null>(null)
  const lineRightRef = useRef<SVGPathElement | null>(null)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const markRefs = useRef<(SVGPathElement | null)[]>([])
  const wordRefs = useRef<(SVGPathElement | null)[]>([])
  const subRefs = useRef<(SVGPathElement | null)[]>([])
  const finishedRef = useRef(false)
  // True once the overlay was actually shown, so the page needs one refresh.
  const ranRef = useRef(false)

  // Stops Lenis and locks body scroll only while the animation runs.
  useLenisScrollLock(phase === "running")

  // The overlay and its scroll lock are gone: recompute every ScrollTrigger once.
  useEffect(() => {
    if (phase !== "done" || !ranRef.current) return
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => window.cancelAnimationFrame(frame)
  }, [phase])

  useGSAP(
    () => {
      const root = rootRef.current
      const stage = stageRef.current
      const logoLayer = logoLayerRef.current
      const svg = svgRef.current
      const lineLeft = lineLeftRef.current
      const lineRight = lineRightRef.current
      if (
        !root ||
        !stage ||
        !logoLayer ||
        !svg ||
        !lineLeft ||
        !lineRight ||
        finishedRef.current
      ) {
        return
      }

      if (shouldSkip()) {
        finishedRef.current = true
        setPhase("done")
        return
      }

      ranRef.current = true
      const elapsed = getFallbackElapsed(root)
      const blocks = compact(blockRefs.current)
      const mark = compact(markRefs.current)
      const word = compact(wordRefs.current)
      const sub = compact(subRefs.current)
      let timeline: gsap.core.Timeline | null = null

      const finish = () => {
        if (finishedRef.current) return
        finishedRef.current = true
        timeline?.kill()
        markSeen()
        root.style.pointerEvents = "none"
        root.style.display = "none"
        setPhase("done")
      }

      // Matches the CSS fallback: never outlast the moment it hides the overlay.
      const capTimer = window.setTimeout(
        finish,
        Math.max(0, FALLBACK_MS + FALLBACK_FADE_MS - elapsed)
      )

      // Initial state. Stroke is always 1.5 screen pixels at any logo size.
      const strokeWidth =
        (1.5 * VIEWBOX_W) / (svg.getBoundingClientRect().width || VIEWBOX_W)
      mark.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeWidth,
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: INK_CLEAR,
        })
      })
      const subOffsets = sub.map((path) => {
        const box = path.getBBox()
        return (box.x + box.width / 2 - SUB_CENTER_X) * SUB_SPREAD
      })
      gsap.set(blocks, { scaleX: 1, transformOrigin: "right center" })
      gsap.set(logoLayer, { opacity: 1 })
      gsap.set(word, { yPercent: 120 })
      gsap.set(sub, { opacity: 0, x: (index: number) => subOffsets[index] })
      gsap.set(lineLeft, { scaleX: 0, transformOrigin: "100% 50%" })
      gsap.set(lineRight, { scaleX: 0, transformOrigin: "0% 50%" })

      const tl = gsap.timeline({ delay: 0.2, onComplete: finish })

      // 1. The mark draws itself: top, center, bottom.
      tl.to(mark, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.12,
      })
        // 2. The mark fills.
        .to(mark, { fill: INK, duration: 0.6, ease: "power2.out" }, "-=0.4")
        // 3. SIXTHGEAR rises letter by letter from behind the clip line.
        .to(
          word,
          { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.05 },
          "-=0.15"
        )
        // 4. Side lines grow outward; MOTORCYCLE closes in and fades up.
        .to(
          [lineLeft, lineRight],
          { scaleX: 1, duration: 0.7, ease: "power3.out" },
          "-=0.45"
        )
        .to(
          sub,
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: { each: 0.03, from: "center" },
          },
          "<"
        )
        // 5. Short hold, then the exit starts: the page stops being blocked.
        .addLabel("exit", "+=0.35")
        .call(() => {
          root.style.pointerEvents = "none"
        }, undefined, "exit")
        // 6. Logo fades, columns wipe away left to right.
        .to(logoLayer, { opacity: 0, duration: 0.3, ease: "power2.out" }, "exit")
        .to(
          blocks,
          { scaleX: 0, duration: 0.4, ease: "power2.out", stagger: 0.02 },
          "-=0.05"
        )

      // Scripts started too late to play it all before the CSS fallback:
      // skip the animation and fade the (still blank) overlay out instead.
      const animationMs = (tl.delay() + tl.duration()) * 1000
      if (FALLBACK_MS - elapsed < animationMs) {
        tl.kill()
        root.style.pointerEvents = "none"
        gsap.to(stage, {
          opacity: 0,
          duration: LATE_FADE_S,
          ease: "power2.out",
          onComplete: finish,
        })
      } else {
        timeline = tl
        gsap.set(svg, { visibility: "visible" })
        setPhase("running")
      }

      return () => {
        window.clearTimeout(capTimer)
      }
    },
    { scope: rootRef }
  )

  if (phase === "done") return null

  return (
    // .sg-preloader is owned by the CSS fallback (opacity, visibility,
    // pointer-events) and JS display/pointer-events; GSAP only animates inside
    // .sg-preloader-stage, so the two never fight over a property.
    <div ref={rootRef} className="sg-preloader" aria-hidden="true">
      <div ref={stageRef} className="sg-preloader-stage">
      <div className="sg-preloader-blocks">
        {Array.from({ length: BLOCK_COUNT }, (_, index) => (
          <div
            key={index}
            ref={(node) => {
              blockRefs.current[index] = node
            }}
            className="sg-preloader-block"
          />
        ))}
      </div>
      <div ref={logoLayerRef} className="sg-preloader-logo">
        <svg
          ref={svgRef}
          className="sg-preloader-svg"
          viewBox="0 -10 2702 1500"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <defs>
            <clipPath id="sg-preloader-word-clip">
              <rect x="0" y="1124" width="2702" height="196" />
            </clipPath>
          </defs>
          <g
            stroke={INK}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={INK_CLEAR}
          >
            {MARK_PATHS.map((path, index) => (
              <path
                key={path.id}
                ref={(node) => {
                  markRefs.current[index] = node
                }}
                id={path.id}
                d={path.d}
              />
            ))}
          </g>
          <g clipPath="url(#sg-preloader-word-clip)">
            <g fill={INK}>
              {WORD_PATHS.map((d, index) => (
                <path
                  key={index}
                  ref={(node) => {
                    wordRefs.current[index] = node
                  }}
                  d={d}
                />
              ))}
            </g>
          </g>
          <g fill={INK}>
            <path ref={lineLeftRef} id="sg-line-left" d={LINE_LEFT_PATH} />
            <path ref={lineRightRef} id="sg-line-right" d={LINE_RIGHT_PATH} />
          </g>
          <g fill={INK}>
            {SUB_PATHS.map((d, index) => (
              <path
                key={index}
                ref={(node) => {
                  subRefs.current[index] = node
                }}
                d={d}
                fillRule="evenodd"
              />
            ))}
          </g>
        </svg>
      </div>
      </div>
    </div>
  )
}
