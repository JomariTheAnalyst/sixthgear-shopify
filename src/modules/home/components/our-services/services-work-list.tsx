"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowUpRight, ChevronDown } from "lucide-react"

import { outfit } from "@lib/fonts"

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
 */
const SECTION_X_PADDING =
  "px-5 xsmall:px-8 small:px-16 medium:px-24 large:px-[233px]"
const FOCUS_LEFT_RATIO = 0.36
const FOLLOW_DURATION = 0.6
const MAX_TILT_DEG = 8
const INACTIVE_OPACITY = "opacity-35"

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
  const wrapperRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Array<HTMLLIElement | null>>([])
  const motionRef = useRef<PreviewMotion | null>(null)
  const hasPositionRef = useRef(false)
  const lastPointerXRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useGSAP(
    () => {
      const preview = previewRef.current
      if (!preview) return

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
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

      return () => {
        motionRef.current?.settle?.kill()
        motionRef.current = null
      }
    },
    { scope: wrapperRef }
  )

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

  const handlePointerMove = (event: React.PointerEvent<HTMLOListElement>) => {
    const wrapper = wrapperRef.current
    const motion = motionRef.current
    if (event.pointerType !== "mouse" || !wrapper || !motion) return

    const rect = wrapper.getBoundingClientRect()
    movePreview(event.clientX - rect.left, event.clientY - rect.top)

    if (motion.tilt && lastPointerXRef.current !== null) {
      const deltaX = event.clientX - lastPointerXRef.current
      motion.tilt(gsap.utils.clamp(-MAX_TILT_DEG, MAX_TILT_DEG, deltaX * 0.5))
      motion.settle?.restart(true)
    }
    lastPointerXRef.current = event.clientX
  }

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
            className="relative border-b border-black/10"
            onPointerMove={handlePointerMove}
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
                  className={`border-t border-black/10 transition-opacity duration-300 motion-reduce:transition-none ${
                    isFaded ? INACTIVE_OPACITY : "opacity-100"
                  }`}
                >
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
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start gap-x-14 py-12 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f15a24] medium:gap-x-20 medium:py-14"
                  >
                    <h3 className="text-[32px] font-black uppercase leading-[32px] text-black">
                      {service.title}
                    </h3>
                    <p className="max-w-[58ch] justify-self-end text-xl font-light leading-[1.5] text-black">
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
              <li key={service.key} className="border-t border-black/10">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f15a24]"
                >
                  <span className="text-2xl font-black uppercase leading-[1.05] text-black">
                    {service.title}
                  </span>
                  <ChevronDown
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
                    <p className="pb-5 text-lg font-light leading-[1.5] text-black">
                      {service.description}
                    </p>
                    <Link
                      href={service.href}
                      tabIndex={isOpen ? 0 : -1}
                      aria-label={`View ${service.title}`}
                      className="relative mb-7 block aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-[#f15a24]"
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
