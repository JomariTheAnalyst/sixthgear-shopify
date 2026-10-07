"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { HOME_ABOUT } from "./config"
import styles from "./home-about.module.css"

const ROWS = 7
const COPIES = 8
/** Row drift in px per second when the page is not scrolling. */
const BASE_SPEED = 18
/** Photo parallax limit, in SVG units. */
const MAX_SHIFT = 22

const TOP_CLIP =
  "M295.9 25.7 Q300.0 0.0 326.0 0.0 L974.0 0.0 Q1000.0 0.0 1000.0 26.0 L1000.0 634.0 Q1000.0 660.0 974.0 660.0 L707.2 660.0 Q681.2 660.0 685.3 634.3 L716.8 437.7 Q720.9 412.0 694.9 412.0 L260.1 412.0 Q234.1 412.0 238.2 386.3 Z"
const BOTTOM_CLIP =
  "M0.0 456.0 Q0.0 430.0 26.0 430.0 L674.0 430.0 Q700.0 430.0 695.9 455.7 L612.9 974.3 Q608.8 1000.0 582.8 1000.0 L26.0 1000.0 Q0.0 1000.0 0.0 974.0 Z"

type AboutStageProps = {
  className?: string
  labelledBy: string
  /** The black text card, rendered on the server. */
  children: ReactNode
}

/**
 * Section shell plus the animated parts: the moving text rows and the photo
 * parallax.
 */
export default function AboutStage({
  className = "",
  labelledBy,
  children,
}: AboutStageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const rowsRef = useRef<HTMLDivElement>(null)
  // SVG <image> has no loading="lazy": set the photo hrefs within ~1 screen.
  const [loadPhotos, setLoadPhotos] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setLoadPhotos(true)
        observer.disconnect()
      },
      { rootMargin: "100% 0px" }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const rowsBox = rowsRef.current
    if (!section || !rowsBox) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let disposed = false

    // Text rows: odd rows (outlined) move left, even rows (filled) move right.
    const rows = Array.from(rowsBox.children as HTMLCollectionOf<HTMLElement>, (el, i) => {
      const even = (i + 1) % 2 === 0
      return { el, even, dir: even ? 1 : -1, x: -Math.random() * 400, unit: 0 }
    })
    const place = (el: HTMLElement, x: number) => {
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`
    }
    const measure = () => {
      if (disposed) return
      rows.forEach((r) => {
        r.unit = r.el.firstElementChild?.getBoundingClientRect().width ?? 0
        if (reduce) place(r.el, -r.unit / 3)
      })
    }
    measure()
    window.addEventListener("resize", measure)
    document.fonts?.ready.then(measure)

    if (reduce) {
      return () => {
        disposed = true
        window.removeEventListener("resize", measure)
      }
    }

    // Rows drift at BASE_SPEED and speed up with scroll speed (even rows up to
    // 7x, odd rows up to 2x), easing back to idle. Paused off screen.
    let rowsFrame = 0
    let boost = 0
    let lastY = 0
    let lastT = 0
    const frame = (now: number) => {
      const dt = Math.min(64, now - lastT) / 1000
      lastT = now
      const y = window.scrollY
      const v = Math.abs(y - lastY) / Math.max(dt, 0.001)
      lastY = y
      boost += (Math.min(v / 900, 3) - boost) * 0.12
      rows.forEach((r) => {
        r.x += r.dir * BASE_SPEED * (1 + boost * (r.even ? 7 : 2)) * dt
        if (r.unit) r.x = (((r.x % r.unit) + r.unit) % r.unit) - r.unit
        place(r.el, r.x)
      })
      rowsFrame = requestAnimationFrame(frame)
    }
    const rowsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !rowsFrame) {
          lastT = performance.now()
          lastY = window.scrollY
          rowsFrame = requestAnimationFrame(frame)
        } else if (!entry.isIntersecting && rowsFrame) {
          cancelAnimationFrame(rowsFrame)
          rowsFrame = 0
        }
      },
      { rootMargin: "200px" }
    )
    rowsObserver.observe(section)

    // Photo parallax: the two layers move in opposite directions.
    const layers = section.querySelectorAll<SVGGElement>("[data-speed]")
    let parallaxFrame = 0
    const updateParallax = () => {
      parallaxFrame = 0
      const r = section.getBoundingClientRect()
      const progress = window.innerHeight / 2 - (r.top + r.height / 2)
      layers.forEach((g) => {
        const y = Math.max(
          -MAX_SHIFT,
          Math.min(MAX_SHIFT, progress * Number(g.dataset.speed))
        )
        g.setAttribute("transform", `translate(0 ${y.toFixed(1)})`)
      })
    }
    const onScroll = () => {
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    updateParallax()

    return () => {
      disposed = true
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", onScroll)
      rowsObserver.disconnect()
      cancelAnimationFrame(rowsFrame)
      cancelAnimationFrame(parallaxFrame)
    }
  }, [])

  const { rowText, images } = HOME_ABOUT

  return (
    <section
      ref={sectionRef}
      id="homepage-about"
      aria-labelledby={labelledBy}
      className={`${styles.section} ${className}`}
    >
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.grayCard}`}>
          {/* Text comes from CSS (data-text) so the repeats stay out of the page text. */}
          <div ref={rowsRef} className={styles.rows} aria-hidden="true">
            {Array.from({ length: ROWS }, (_, i) => (
              <div
                key={i}
                className={`${styles.row} ${i % 2 ? styles.rowFill : styles.rowOutline}`}
              >
                {Array.from({ length: COPIES }, (_, k) => (
                  <span key={k} data-text={rowText} />
                ))}
              </div>
            ))}
          </div>

          <div className={styles.photos}>
            <div className={styles.compo}>
              <svg viewBox="0 0 1000 1000">
                <defs>
                  <clipPath id="home-about-clip-top">
                    <path d={TOP_CLIP} />
                  </clipPath>
                  <clipPath id="home-about-clip-bottom">
                    <path d={BOTTOM_CLIP} />
                  </clipPath>
                </defs>
                <g data-speed="-0.03">
                  <g className={styles.shape}>
                    <g clipPath="url(#home-about-clip-top)">
                      <image
                        href={loadPhotos ? images.top.src : undefined}
                        x="234"
                        y="0"
                        width="766"
                        height="660"
                        preserveAspectRatio="xMinYMid slice"
                        role="img"
                        aria-label={images.top.alt}
                      />
                    </g>
                  </g>
                </g>
                <g data-speed="0.04">
                  <g className={styles.shape}>
                    <g clipPath="url(#home-about-clip-bottom)">
                      <image
                        href={loadPhotos ? images.bottom.src : undefined}
                        x="0"
                        y="430"
                        width="700"
                        height="570"
                        preserveAspectRatio="xMinYMid slice"
                        role="img"
                        aria-label={images.bottom.alt}
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  )
}
