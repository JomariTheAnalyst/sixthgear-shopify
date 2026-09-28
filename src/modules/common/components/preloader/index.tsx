"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef, useState } from "react"

import { isPreloaderFresh, PRELOADER_KEY } from "@lib/preloader-config"
import { useLenisScrollLock } from "@modules/common/components/lenis-provider"

import {
  LINE_LEFT_PATH,
  LINE_RIGHT_PATH,
  MARK_PATHS,
  SUB_PATHS,
  WORD_PATHS,
} from "./logo-paths"

gsap.registerPlugin(useGSAP)

const BLOCK_COUNT = 20
const MAX_WAIT_MS = 5000
const SAFETY_NET_MS = 11000
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

/**
 * Preloader shown when the last visit was over PRELOADER_TTL_MS ago, matching the approved
 * sixthgear-preloader-preview.html: the mark draws and fills, SIXTHGEAR
 * rises, the side lines and MOTORCYCLE close in, then the logo fades and 20
 * columns wipe away. The markup is server-rendered so it covers the page from
 * first paint; html.sg-preloader-skip (set before paint in app/layout.tsx)
 * hides it on repeat loads.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("idle")
  const rootRef = useRef<HTMLDivElement | null>(null)
  const logoLayerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const lineLeftRef = useRef<SVGPathElement | null>(null)
  const lineRightRef = useRef<SVGPathElement | null>(null)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const markRefs = useRef<(SVGPathElement | null)[]>([])
  const wordRefs = useRef<(SVGPathElement | null)[]>([])
  const subRefs = useRef<(SVGPathElement | null)[]>([])
  const finishedRef = useRef(false)

  // Stops Lenis and locks body scroll only while the animation runs.
  useLenisScrollLock(phase === "running")

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      const logoLayer = logoLayerRef.current
      const svg = svgRef.current
      const lineLeft = lineLeftRef.current
      const lineRight = lineRightRef.current
      if (
        !root ||
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

      setPhase("running")

      const blocks = compact(blockRefs.current)
      const mark = compact(markRefs.current)
      const word = compact(wordRefs.current)
      const sub = compact(subRefs.current)
      const timers: number[] = []
      const pending: (() => void)[] = []
      let loaded = document.readyState === "complete"
      let disposed = false

      const finish = () => {
        if (finishedRef.current) return
        finishedRef.current = true
        markSeen()
        root.style.pointerEvents = "none"
        root.style.display = "none"
        setPhase("done")
      }

      // Runs `callback` once the page has loaded, or MAX_WAIT_MS after this
      // call, whichever comes first.
      const whenReady = (callback: () => void) => {
        let called = false
        const run = () => {
          if (called || disposed) return
          called = true
          callback()
        }
        if (loaded) {
          queueMicrotask(run)
        } else {
          pending.push(run)
        }
        timers.push(window.setTimeout(run, MAX_WAIT_MS))
      }

      const onLoad = () => {
        loaded = true
        pending.splice(0).forEach((run) => run())
      }

      if (!loaded) window.addEventListener("load", onLoad)
      // Never leave the site stuck behind the overlay.
      timers.push(window.setTimeout(finish, SAFETY_NET_MS))

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

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      if (reducedMotion) {
        // Full logo, already filled, then one fade once the page is ready.
        gsap.set(mark, { strokeDashoffset: 0, fill: INK })
        gsap.set(word, { yPercent: 0 })
        gsap.set(sub, { opacity: 1, x: 0 })
        gsap.set([lineLeft, lineRight], { scaleX: 1 })
        gsap.set(svg, { visibility: "visible" })

        const fadeOut = () => {
          gsap.to(root, { opacity: 0, duration: 0.4, onComplete: finish })
        }
        whenReady(contextSafe ? contextSafe(fadeOut) : fadeOut)
      } else {
        gsap.set(svg, { visibility: "visible" })

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
          // 5. Short hold, then wait for the page (max MAX_WAIT_MS).
          .addPause("+=0.35", () => whenReady(() => tl.resume()))
          // 6. Logo fades, columns wipe away left to right.
          .to(logoLayer, { opacity: 0, duration: 0.3, ease: "power2.out" })
          .to(
            blocks,
            { scaleX: 0, duration: 0.4, ease: "power2.out", stagger: 0.02 },
            "-=0.05"
          )
      }

      return () => {
        disposed = true
        window.removeEventListener("load", onLoad)
        timers.forEach((id) => window.clearTimeout(id))
      }
    },
    { scope: rootRef }
  )

  if (phase === "done") return null

  return (
    <div ref={rootRef} className="sg-preloader" aria-hidden="true">
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
  )
}
