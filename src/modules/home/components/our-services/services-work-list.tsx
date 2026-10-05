"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, ChevronsRight } from "lucide-react"

import { nationalCompressed, outfit } from "@lib/fonts"
import { useLenis } from "@modules/common/components/lenis-provider"

gsap.registerPlugin(useGSAP, ScrollTrigger)

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
 * - Tablet/desktop with motion (768px+): the section slides over the block
 *   above it, then pins while the services step through a vertical image
 *   carousel. Each step is one viewport of scroll and snaps to a service.
 * - Phones and reduced motion: a stacked list, rolled up (phones) or faded
 *   (reduced motion) into view.
 * - PEEK_OPACITY dims the next image peeking in below the active one.
 */
const SECTION_X_PADDING = "px-5 xsmall:px-8 small:px-16 medium:px-24"
const ACCENT = "#f15a24"
const PEEK_OPACITY = 0.35
const STEP_EASE = "power2.inOut"

const TITLE_CLASS = `${nationalCompressed.className} uppercase leading-[0.86] tracking-[0.01em] text-white`
const LEARN_MORE_CLASS =
  "inline-flex min-h-11 items-center gap-1.5 rounded-[3px] bg-[#f15a24] px-4 text-sm font-bold uppercase tracking-[0.08em] text-black outline-none transition-colors duration-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"

/** Two diagonal squares: a small chequered-flag mark. */
function FlagMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill={ACCENT}>
      <rect x="0" y="0" width="12" height="12" />
      <rect x="12" y="12" width="12" height="12" />
    </svg>
  )
}

/** The nearest rendered element above the section, skipping wrappers it is
    the first child of (e.g. SanityEditTarget) and empty slots. */
function findElementAbove(section: HTMLElement) {
  for (let node: HTMLElement | null = section; node && node.tagName !== "MAIN"; node = node.parentElement) {
    for (let el = node.previousElementSibling; el; el = el.previousElementSibling) {
      if (el instanceof HTMLElement && el.offsetHeight > 0 && !["SCRIPT", "TEMPLATE"].includes(el.tagName)) {
        return el
      }
    }
  }
  return null
}

export default function ServicesWorkList({
  title,
  description,
  services,
  viewAllHref,
}: ServicesWorkListProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const stageTriggerRef = useRef<ScrollTrigger | null>(null)
  const activeRef = useRef(0)
  const refreshTimerRef = useRef<number | undefined>(undefined)
  const [active, setActive] = useState(0)
  const lenis = useLenis()
  const count = services.length

  // Pin positions depend on final heights; images and fonts can change them.
  const refresh = () => {
    window.clearTimeout(refreshTimerRef.current)
    refreshTimerRef.current = window.setTimeout(() => ScrollTrigger.refresh(), 150)
  }

  useEffect(() => {
    let mounted = true
    document.fonts?.ready.then(() => mounted && ScrollTrigger.refresh())
    return () => {
      mounted = false
    }
  }, [])

  useGSAP(
    () => {
      const section = sectionRef.current
      const stage = stageRef.current
      if (!section || !stage) return

      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // Slide-over: the block above holds still while this section rises over it.
        const above = findElementAbove(section)
        if (above) {
          ScrollTrigger.create({
            trigger: above,
            start: "bottom bottom",
            endTrigger: section,
            end: "top top",
            pin: true,
            pinSpacing: false,
          })
        }

        if (count < 2) return

        const titles = gsap.utils.toArray<HTMLElement>("[data-stage-title]", stage)
        const copies = gsap.utils.toArray<HTMLElement>("[data-stage-copy]", stage)
        const slides = gsap.utils.toArray<HTMLElement>("[data-stage-slide]", stage)
        const track = stage.querySelector("[data-stage-track]")
        const step = () => slides[1].offsetTop - slides[0].offsetTop

        // Server markup hides all but the first text (opacity-0); GSAP takes over.
        gsap.set([...titles.slice(1), ...copies.slice(1)], { yPercent: 100, opacity: 1 })
        gsap.set(slides.slice(1), { opacity: PEEK_OPACITY })

        const tl = gsap.timeline({
          defaults: { duration: 1, ease: STEP_EASE },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${window.innerHeight * (count - 1)}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            snap: {
              snapTo: "labelsDirectional",
              duration: { min: 0.25, max: 0.7 },
              delay: 0.05,
              ease: STEP_EASE,
            },
            onUpdate: (self) => {
              const index = Math.round(self.progress * (count - 1))
              if (index !== activeRef.current) {
                activeRef.current = index
                setActive(index)
              }
            },
          },
        })

        for (let i = 0; i < count - 1; i++) {
          tl.addLabel(`service-${i}`, i)
            .to(track, { y: () => -(i + 1) * step() }, i)
            .to(slides[i], { opacity: 0 }, i)
            .to(slides[i + 1], { opacity: 1 }, i)
            .to([titles[i], copies[i]], { yPercent: -100 }, i)
            .to([titles[i + 1], copies[i + 1]], { yPercent: 0 }, i)
        }
        tl.addLabel(`service-${count - 1}`, count - 1)
        stageTriggerRef.current = tl.scrollTrigger ?? null

        return () => {
          stageTriggerRef.current = null
          activeRef.current = 0
          setActive(0)
        }
      })

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-block]", section).forEach((block) => {
          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: block, start: "top 85%", once: true },
            })
            .from(block.querySelector("[data-roll]"), { yPercent: 100, duration: 0.8 })
            .from(block.querySelectorAll("[data-rise]"), { y: 40, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.15)
        })
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-block]", section).forEach((block) => {
          gsap.from(block, {
            opacity: 0,
            duration: 0.6,
            ease: "none",
            scrollTrigger: { trigger: block, start: "top 90%", once: true },
          })
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [count] }
  )

  // Keyboard: tabbing to a hidden service's link scrolls the carousel to it.
  const scrollToService = (index: number) => {
    const trigger = stageTriggerRef.current
    if (!trigger || index === activeRef.current) return

    const top = trigger.start + (trigger.end - trigger.start) * (index / (count - 1))
    if (lenis) lenis.scrollTo(top)
    else window.scrollTo({ top })
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="homepage-services-heading"
      className={`${outfit.className} relative z-10 bg-black text-white antialiased`}
    >
      <header
        className={`flex flex-col items-start gap-6 pb-10 pt-14 small:flex-row small:items-end small:justify-between small:gap-10 small:pt-20 ${SECTION_X_PADDING}`}
      >
        <div className="flex flex-col items-start">
          <h2
            id="homepage-services-heading"
            className={`${TITLE_CLASS} text-[clamp(2.75rem,5.4vw,6rem)]`}
          >
            {title}
          </h2>
          <p className="sr-only">{description}</p>
        </div>

        <Link
          href={viewAllHref}
          className="group inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-white py-1.5 pl-7 pr-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-colors duration-300 hover:bg-[#f15a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          View all services
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45"
          >
            <ArrowUpRight size={18} strokeWidth={2} />
          </span>
        </Link>
      </header>

      {/* Tablet/desktop with motion: pinned carousel. */}
      <div
        ref={stageRef}
        className={`relative hidden h-[100svh] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-[clamp(2rem,5vw,6rem)] overflow-hidden md:motion-safe:grid ${SECTION_X_PADDING}`}
      >
        <div className="grid overflow-hidden">
          {services.map((service, index) => (
            <h3
              key={service.key}
              data-stage-title
              className={`${TITLE_CLASS} flex flex-col justify-center text-[clamp(2.75rem,5.2vw,6.25rem)] [grid-area:1/1] ${index ? "opacity-0" : ""}`}
            >
              {service.title}
            </h3>
          ))}
        </div>

        <div className="relative aspect-square w-[min(30vw,56svh)]">
          <div data-stage-track className="absolute inset-x-0 top-0 flex flex-col gap-12">
            {services.map((service) => (
              <div
                key={service.key}
                data-stage-slide
                className="relative aspect-square w-full overflow-hidden rounded-[4px] bg-neutral-900"
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 30vw, 100vw"
                  onLoad={refresh}
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 grid -translate-x-1/2">
            {services.map((service, index) => (
              <Link
                key={service.key}
                href={service.href}
                aria-label={`Learn more about ${service.title}`}
                onFocus={() => scrollToService(index)}
                className={`${LEARN_MORE_CLASS} whitespace-nowrap [grid-area:1/1] ${
                  index === active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                Learn more
                <ChevronsRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid overflow-hidden">
          {services.map((service, index) => (
            <p
              key={service.key}
              data-stage-copy
              className={`flex max-w-[44ch] flex-col justify-center text-base font-light leading-[1.6] text-white/75 [grid-area:1/1] medium:text-lg ${index ? "opacity-0" : ""}`}
            >
              {service.description}
            </p>
          ))}
        </div>

        <p
          aria-hidden="true"
          className={`${nationalCompressed.className} absolute bottom-8 right-5 flex items-center gap-3 text-[2.5rem] leading-none text-white xsmall:right-8 small:right-16 medium:right-24`}
        >
          <FlagMark />
          <span>
            {active + 1}/{count}
          </span>
        </p>
      </div>

      {/* Phones and reduced motion: stacked services. */}
      <ol
        className={`mx-auto flex max-w-3xl flex-col gap-16 pb-16 md:motion-safe:hidden ${SECTION_X_PADDING}`}
      >
        {services.map((service) => (
          <li key={service.key} data-block>
            <div className="overflow-hidden">
              <h3
                data-roll
                className={`${TITLE_CLASS} text-[clamp(2.75rem,12vw,4.5rem)]`}
              >
                {service.title}
              </h3>
            </div>
            <div
              data-rise
              className="relative mt-5 aspect-square w-full overflow-hidden rounded-[4px] bg-neutral-900"
            >
              <Image
                src={service.image}
                alt=""
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 767px) 92vw, 768px"
                onLoad={refresh}
              />
            </div>
            <p data-rise className="mt-5 text-base font-light leading-[1.6] text-white/75">
              {service.description}
            </p>
            <div data-rise className="mt-6">
              <Link
                href={service.href}
                aria-label={`Learn more about ${service.title}`}
                className={LEARN_MORE_CLASS}
              >
                Learn more
                <ChevronsRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
