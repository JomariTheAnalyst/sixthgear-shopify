"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import Link from "next/link"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowUpRight, ChevronDown } from "lucide-react"

import { instrumentSerifItalic, outfit } from "@lib/fonts"

gsap.registerPlugin(useGSAP)

export type ServicesWorkListItem = {
  key: string
  title: string
  description: string
  image: string
  href: string
  slug?: string | null
}

type ServicesWorkListProps = {
  title: string
  description: string
  services: ServicesWorkListItem[]
  viewAllHref: string
}

/**
 * Tunable design values for this section.
 *
 * - SECTION_X_PADDING mirrors the About Us revamp: exact 233px sides at
 *   `large:` (1440px+), responsive reductions below, ~20px on mobile.
 * - Service titles target 32px / 32px / 900; descriptions 20px / 30px / 300.
 * - The floating preview trails the mouse cursor (FOLLOW_DURATION lag) and
 *   leans into horizontal movement (MAX_TILT_DEG). Keyboard focus parks it
 *   between the columns (FOCUS_LEFT_RATIO) on the focused row.
 * - INACTIVE_OPACITY controls how far non-active rows fade on hover/focus.
 * - Active row (hover, keyboard focus, open accordion item): an orange fill
 *   wipes up, the title crossfades to a cursive twin (TITLE_SHIFT px rise)
 *   and the text turns white. See createRowMotion.
 */
const SECTION_X_PADDING =
  "px-5 xsmall:px-8 small:px-16 medium:px-24 large:px-[233px]"
const FOCUS_LEFT_RATIO = 0.36
const FOLLOW_DURATION = 0.6
const MAX_TILT_DEG = 8
const INACTIVE_OPACITY = "opacity-35"
const TITLE_SHIFT = 7
const INK = "#000000"

/** Full-bleed orange fill: reaches both screen edges; the section's
    overflow-hidden clips the part under the scrollbar. */
const FILL_CLASS =
  "pointer-events-none absolute inset-y-0 left-[calc(50%-50vw)] -z-10 w-screen origin-bottom scale-y-0 bg-[#FB5A1F] will-change-transform"
const CURSIVE_CLASS = `${instrumentSerifItalic.className} [grid-area:1/1] font-normal normal-case tracking-normal text-white opacity-0`

type RowMotion = { on: () => void; off: () => void }

/**
 * Builds a row's orange state once: in and out timelines that are only
 * played, never recreated. invalidate() lets each start from wherever the
 * other stopped, so quick hovers never jump. `instant` (reduced motion)
 * swaps the state with no wipe.
 */
function createRowMotion(row: HTMLElement, instant: boolean): RowMotion {
  const fill = row.querySelector("[data-fill]")
  const title = row.querySelector("[data-title]")
  const cursive = row.querySelector("[data-title-cursive]")
  const ink = row.querySelectorAll("[data-ink]")
  const d = instant ? 0 : 1

  gsap.set(fill, { scaleY: 0, transformOrigin: "50% 100%" })
  gsap.set(cursive, { opacity: 0, y: TITLE_SHIFT })

  const enter = gsap
    .timeline({ paused: true, defaults: { ease: "power3.out" } })
    .to(fill, { scaleY: 1, duration: 0.45 * d }, 0)
    .to(title, { opacity: 0, y: -TITLE_SHIFT, duration: 0.3 * d }, 0)
    .to(cursive, { opacity: 1, y: 0, duration: 0.4 * d }, 0.05 * d)
    .to(ink, { color: "#ffffff", duration: 0.3 * d }, 0)
  const leave = gsap
    .timeline({ paused: true, defaults: { ease: "power3.out" } })
    .to(fill, { scaleY: 0, duration: 0.35 * d }, 0)
    .to(cursive, { opacity: 0, y: TITLE_SHIFT, duration: 0.25 * d }, 0)
    .to(title, { opacity: 1, y: 0, duration: 0.3 * d }, 0.05 * d)
    .to(ink, { color: INK, duration: 0.3 * d }, 0)

  return {
    on: () => {
      leave.pause()
      enter.invalidate().restart()
    },
    off: () => {
      enter.pause()
      leave.invalidate().restart()
    },
  }
}

/** Turns the previous row's orange state off and the new one's on. */
function useRowMotionFollow(
  motions: RefObject<Array<RowMotion | undefined>>,
  index: number | null
) {
  const previousRef = useRef<number | null>(null)

  useEffect(() => {
    const previous = previousRef.current
    if (previous === index) return
    if (previous !== null) motions.current[previous]?.off()
    if (index !== null) motions.current[index]?.on()
    previousRef.current = index
  }, [motions, index])
}

type PreviewMotion = {
  x: gsap.QuickToFunc
  y: gsap.QuickToFunc
  tilt: gsap.QuickToFunc | null
  settle: gsap.core.Tween | null
}

export default function ServicesWorkList({
  title,
  description,
  services,
  viewAllHref,
}: ServicesWorkListProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Array<HTMLLIElement | null>>([])
  const accordionRowRefs = useRef<Array<HTMLLIElement | null>>([])
  const rowMotionsRef = useRef<Array<RowMotion | undefined>>([])
  const accordionMotionsRef = useRef<Array<RowMotion | undefined>>([])
  const motionRef = useRef<PreviewMotion | null>(null)
  const hasPositionRef = useRef(false)
  const lastPointerXRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Moves the preview to a point inside the wrapper; the first move snaps
  // so the card never flies in from a stale position.
  const movePreview = (x: number, y: number) => {
    const motion = motionRef.current
    if (!motion) return

    if (hasPositionRef.current) {
      motion.x(x)
      motion.y(y)
    } else {
      motion.x(x, x)
      motion.y(y, y)
      hasPositionRef.current = true
    }
  }

  useGSAP(
    () => {
      const wrapper = wrapperRef.current
      const list = listRef.current
      const preview = previewRef.current
      if (!wrapper || !list || !preview) return

      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reducedMotion = Boolean(context.conditions?.reduce)
          const duration = reducedMotion ? 0 : FOLLOW_DURATION

          gsap.set(preview, { xPercent: -50, yPercent: -50 })

          const tilt = reducedMotion
            ? null
            : gsap.quickTo(preview, "rotation", { duration: 0.8, ease: "power3.out" })

          motionRef.current = {
            x: gsap.quickTo(preview, "x", { duration, ease: "power3.out" }),
            y: gsap.quickTo(preview, "y", { duration, ease: "power3.out" }),
            tilt,
            // Straightens the card shortly after the cursor stops.
            settle: tilt ? gsap.delayedCall(0.12, () => tilt(0)).pause() : null,
          }

          const build = (row: HTMLLIElement | null) =>
            row ? createRowMotion(row, reducedMotion) : undefined
          rowMotionsRef.current = rowRefs.current.map(build)
          accordionMotionsRef.current = accordionRowRefs.current.map(build)

          return () => {
            motionRef.current?.settle?.kill()
            motionRef.current = null
            rowMotionsRef.current = []
            accordionMotionsRef.current = []
          }
        }
      )

      // The wrapper's position is read on enter, scroll and resize, never in
      // pointermove, so following the cursor causes no layout work.
      let wrapperRect: DOMRect | null = null
      const measure = () => {
        wrapperRect = wrapper.getBoundingClientRect()
      }
      const onPointerLeave = () => {
        wrapperRect = null
      }
      const onScrollOrResize = () => {
        if (wrapperRect) measure()
      }
      const onPointerMove = (event: PointerEvent) => {
        const motion = motionRef.current
        if (event.pointerType !== "mouse" || !wrapperRect || !motion) return

        movePreview(event.clientX - wrapperRect.left, event.clientY - wrapperRect.top)

        if (motion.tilt && lastPointerXRef.current !== null) {
          const deltaX = event.clientX - lastPointerXRef.current
          motion.tilt(gsap.utils.clamp(-MAX_TILT_DEG, MAX_TILT_DEG, deltaX * 0.5))
          motion.settle?.restart(true)
        }
        lastPointerXRef.current = event.clientX
      }

      list.addEventListener("pointerenter", measure, { passive: true })
      list.addEventListener("pointerleave", onPointerLeave, { passive: true })
      list.addEventListener("pointermove", onPointerMove, { passive: true })
      window.addEventListener("scroll", onScrollOrResize, { passive: true })
      window.addEventListener("resize", onScrollOrResize, { passive: true })

      return () => {
        list.removeEventListener("pointerenter", measure)
        list.removeEventListener("pointerleave", onPointerLeave)
        list.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("scroll", onScrollOrResize)
        window.removeEventListener("resize", onScrollOrResize)
        mm.revert()
      }
    },
    { scope: sectionRef }
  )

  useRowMotionFollow(rowMotionsRef, activeIndex)
  useRowMotionFollow(accordionMotionsRef, openIndex)

  const focusRow = (index: number) => {
    const wrapper = wrapperRef.current
    const row = rowRefs.current[index]

    if (wrapper && row) {
      const wrapperRect = wrapper.getBoundingClientRect()
      const rowRect = row.getBoundingClientRect()
      movePreview(
        wrapperRect.width * FOCUS_LEFT_RATIO,
        rowRect.top - wrapperRect.top + rowRect.height / 2
      )
    }

    setActiveIndex(index)
  }

  const clearActiveRow = () => {
    setActiveIndex(null)
    hasPositionRef.current = false
    lastPointerXRef.current = null
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="homepage-services-heading"
      className={`${outfit.className} overflow-hidden bg-white py-14 text-black antialiased small:py-20 medium:py-24 ${SECTION_X_PADDING}`}
    >
      <div className="mx-auto max-w-[1454px]">
        <header className="flex flex-col items-start gap-6 small:flex-row small:items-end small:justify-between small:gap-10">
          <div className="flex flex-col items-start">
            <h2
              id="homepage-services-heading"
              className="text-[clamp(2.25rem,4.6vw,5.25rem)] font-black uppercase leading-[1] tracking-[-0.025em] text-black"
            >
              {title}
            </h2>
            <p className="sr-only">{description}</p>
          </div>

          <Link
            href={viewAllHref}
            className="group inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-[#111111] py-1.5 pl-7 pr-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#f15a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
          >
            View all services
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111111] transition-transform duration-300 group-hover:rotate-45"
            >
              <ArrowUpRight size={18} strokeWidth={2} />
            </span>
          </Link>
        </header>

        {/* Desktop: editorial rows with hover/focus preview. */}
        <div
          ref={wrapperRef}
          className="relative mt-10 hidden small:block medium:mt-14"
        >
          <ol
            ref={listRef}
            className="relative border-b border-black/10"
            onMouseLeave={clearActiveRow}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                clearActiveRow()
              }
            }}
          >
            {services.map((service, index) => {
              const isFaded = activeIndex !== null && activeIndex !== index

              return (
                <li
                  key={service.key}
                  ref={(node) => {
                    rowRefs.current[index] = node
                  }}
                  className={`relative isolate border-t border-black/10 transition-opacity duration-300 motion-reduce:transition-none ${
                    isFaded ? INACTIVE_OPACITY : "opacity-100"
                  }`}
                >
                  <span data-fill aria-hidden="true" className={FILL_CLASS} />
                  <Link
                    href={service.href}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={(event) => {
                      // Mouse clicks also focus the link; only keyboard focus parks the preview.
                      if (event.currentTarget.matches(":focus-visible")) {
                        focusRow(index)
                      } else {
                        setActiveIndex(index)
                      }
                    }}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start gap-x-14 py-12 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white medium:gap-x-20 medium:py-14"
                  >
                    {/* Both title styles share one grid cell, so the row keeps
                        the taller one's height and nothing jumps. */}
                    <h3 className="grid">
                      <span
                        data-title
                        className="[grid-area:1/1] text-[32px] font-black uppercase leading-[32px] text-black"
                      >
                        {service.title}
                      </span>
                      <span
                        data-title-cursive
                        aria-hidden="true"
                        className={`${CURSIVE_CLASS} text-[42px] leading-[0.95]`}
                      >
                        {service.title}
                      </span>
                    </h3>
                    <p
                      data-ink
                      className="max-w-[58ch] justify-self-end text-xl font-light leading-[1.5] text-black">
                      {service.description}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ol>

          {/* Cursor-following preview; GSAP moves the outer layer, CSS handles
              reveal and crossfade. Never blocks clicks. */}
          <div
            ref={previewRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 w-[clamp(220px,19vw,290px)] will-change-transform"
          >
            <div
              className={`relative aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-neutral-100 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                activeIndex !== null ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              {services.map((service, index) => (
                <Image
                  key={service.key}
                  src={service.image}
                  alt=""
                  fill
                  className={`object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                    index === activeIndex
                      ? "scale-100 opacity-100"
                      : "scale-110 opacity-0"
                  }`}
                  sizes="290px"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / touch: single-open accordion. */}
        <ul className="mt-8 border-b border-black/10 small:hidden">
          {services.map((service, index) => {
            const isOpen = openIndex === index
            const panelId = `homepage-service-panel-${service.key}`

            return (
              <li
                key={service.key}
                ref={(node) => {
                  accordionRowRefs.current[index] = node
                }}
                className="relative isolate border-t border-black/10"
              >
                <span data-fill aria-hidden="true" className={FILL_CLASS} />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111111]"
                >
                  <span className="grid">
                    <span
                      data-title
                      className="[grid-area:1/1] text-2xl font-black uppercase leading-[1.05] text-black"
                    >
                      {service.title}
                    </span>
                    <span
                      data-title-cursive
                      aria-hidden="true"
                      className={`${CURSIVE_CLASS} text-[32px] leading-[0.95]`}
                    >
                      {service.title}
                    </span>
                  </span>
                  <ChevronDown
                    data-ink
                    size={22}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={`shrink-0 text-black transition-transform duration-300 motion-reduce:transition-none ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p data-ink className="pb-5 text-lg font-light leading-[1.5] text-black">
                      {service.description}
                    </p>
                    <Link
                      href={service.href}
                      tabIndex={isOpen ? 0 : -1}
                      aria-label={`View ${service.title}`}
                      className="relative mb-7 block aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
                    >
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 1023px) 92vw, 400px"
                      />
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
