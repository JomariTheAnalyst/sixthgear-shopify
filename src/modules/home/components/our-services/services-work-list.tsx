"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, ChevronDown } from "lucide-react"

import { outfit } from "@lib/fonts"

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
 * - The floating preview is anchored between the title and description
 *   columns (PREVIEW_LEFT), vertically centered on the active row, and
 *   clamped so it never escapes the list.
 * - INACTIVE_OPACITY controls how far non-active rows fade on hover/focus.
 */
const SECTION_X_PADDING =
  "px-5 xsmall:px-8 small:px-16 medium:px-24 large:px-[233px]"
const PREVIEW_LEFT = "36%"
const PREVIEW_CLAMP_PX = 190 // half preview height + breathing room
const INACTIVE_OPACITY = "opacity-35"

export default function ServicesWorkList({
  title,
  description,
  services,
  viewAllHref,
}: ServicesWorkListProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const rowRefs = useRef<Array<HTMLLIElement | null>>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [previewTop, setPreviewTop] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const activateRow = (index: number) => {
    const list = listRef.current
    const row = rowRefs.current[index]

    if (list && row) {
      const listRect = list.getBoundingClientRect()
      const rowRect = row.getBoundingClientRect()
      const center = rowRect.top - listRect.top + rowRect.height / 2
      const clamped = Math.min(
        Math.max(center, PREVIEW_CLAMP_PX),
        Math.max(listRect.height - PREVIEW_CLAMP_PX, PREVIEW_CLAMP_PX)
      )
      setPreviewTop(clamped)
    }

    setActiveIndex(index)
  }

  const clearActiveRow = () => setActiveIndex(null)

  const activeService = activeIndex === null ? null : services[activeIndex]

  return (
    <section
      aria-labelledby="homepage-services-heading"
      className={`${outfit.className} overflow-hidden bg-white py-14 text-black antialiased small:py-20 medium:py-24 ${SECTION_X_PADDING}`}
    >
      <div className="mx-auto max-w-[1454px]">
        <header className="flex flex-col items-start gap-6 small:flex-row small:items-end small:justify-between small:gap-10">
          <div className="flex flex-col items-start">
            <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-700">
              Our Services
            </span>
            <h2
              id="homepage-services-heading"
              className="mt-6 text-[clamp(2.25rem,4.6vw,5.25rem)] font-black uppercase leading-[1] tracking-[-0.025em] text-black"
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
        <div className="relative mt-10 hidden small:block medium:mt-14">
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
                  className={`border-t border-black/10 transition-opacity duration-300 motion-reduce:transition-none ${
                    isFaded ? INACTIVE_OPACITY : "opacity-100"
                  }`}
                >
                  <Link
                    href={service.href}
                    onMouseEnter={() => activateRow(index)}
                    onFocus={() => activateRow(index)}
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

          {/* Floating preview for the active service; never blocks clicks. */}
          <div
            aria-hidden="true"
            style={{ top: previewTop, left: PREVIEW_LEFT }}
            className={`pointer-events-none absolute z-10 hidden w-[clamp(220px,19vw,290px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px] bg-neutral-100 transition-[top,opacity,transform] duration-300 ease-out will-change-transform motion-reduce:transition-none small:block ${
              activeService
                ? "scale-100 opacity-100"
                : "translate-y-[calc(-50%+10px)] scale-[0.98] opacity-0"
            }`}
          >
            <div className="relative aspect-[3/4] w-full">
              {activeService ? (
                <Image
                  src={activeService.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="290px"
                />
              ) : null}
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
