"use client"

import { useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import { inter, nationalCompressed, nationalCondensed } from "@lib/fonts"

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

const SERVICE_SUMMARIES: Record<string, string> = {
  "preventive-maintenance": "Scheduled care · inspections · ride-ready reliability",
  "repairs-diagnostics": "Professional diagnostics · repairs · dependable performance",
  "accessories-installation": "Clean fitment · electronics · protection · touring upgrades",
}

type FlowEdge = "top" | "bottom"

function getServiceSummary(service: ServicesWorkListItem) {
  return (
    (service.slug ? SERVICE_SUMMARIES[service.slug] : null) ||
    service.description
  )
}

function distanceSquared(x: number, y: number, x2: number, y2: number) {
  return (x - x2) * (x - x2) + (y - y2) * (y - y2)
}

function getClosestHorizontalEdge(
  event: MouseEvent,
  item: HTMLElement
): FlowEdge {
  const bounds = item.getBoundingClientRect()
  const x = event.clientX - bounds.left
  const y = event.clientY - bounds.top

  return distanceSquared(x, y, bounds.width / 2, 0) <
    distanceSquared(x, y, bounds.width / 2, bounds.height)
    ? "top"
    : "bottom"
}

export default function ServicesWorkList({
  title,
  description,
  services,
  viewAllHref,
}: ServicesWorkListProps) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current

      if (
        !root ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        return
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-flow-item]")
      )
      const rebuilders: Array<() => void> = []
      const destroyers: Array<() => void> = []
      let resizeTimer: ReturnType<typeof setTimeout> | null = null
      let cancelled = false

      items.forEach((item) => {
        const panel = item.querySelector<HTMLElement>("[data-flow-panel]")
        const strip = item.querySelector<HTMLElement>("[data-flow-strip]")
        const template = strip?.querySelector<HTMLElement>("[data-flow-part]")

        if (!panel || !strip || !template) {
          return
        }

        let loop: gsap.core.Tween | null = null

        // Pin transform ownership before any timeline reads the CSS transform.
        gsap.set(panel, { y: 0, yPercent: 101 })
        gsap.set(strip, { x: 0, y: 0, yPercent: 0 })

        const rebuild = () => {
          if (cancelled) {
            return
          }

          loop?.kill()
          loop = null

          while (strip.children.length > 1) {
            strip.lastElementChild?.remove()
          }

          const partWidth = template.offsetWidth

          if (partWidth <= 0) {
            return
          }

          const span = item.offsetWidth || window.innerWidth
          const wanted = Math.max(4, Math.ceil(span / partWidth) + 2)

          while (strip.children.length < wanted) {
            strip.append(template.cloneNode(true))
          }

          gsap.set(strip, { x: 0 })

          if (!reduceMotion) {
            loop = gsap.to(strip, {
              x: -partWidth,
              duration: 18,
              ease: "none",
              repeat: -1,
            })
          }
        }

        const enter = (event: MouseEvent) => {
          const edge = getClosestHorizontalEdge(event, item)
          const duration = reduceMotion ? 0.2 : 0.6
          const ease = reduceMotion ? "power1.out" : "expo.out"

          gsap.killTweensOf([panel, strip], "yPercent")
          gsap
            .timeline({ defaults: { duration, ease, overwrite: "auto" } })
            .set(panel, { y: 0, yPercent: edge === "top" ? -101 : 101 }, 0)
            .set(strip, { y: 0, yPercent: edge === "top" ? 101 : -101 }, 0)
            .to([panel, strip], { yPercent: 0 }, 0)
        }

        const leave = (event: MouseEvent) => {
          const edge = getClosestHorizontalEdge(event, item)
          const duration = reduceMotion ? 0.2 : 0.6
          const ease = reduceMotion ? "power1.out" : "expo.out"

          gsap.killTweensOf([panel, strip], "yPercent")
          gsap
            .timeline({ defaults: { duration, ease, overwrite: "auto" } })
            .to(panel, { yPercent: edge === "top" ? -101 : 101 }, 0)
            .to(strip, { yPercent: edge === "top" ? 101 : -101 }, 0)
        }

        item.addEventListener("mouseenter", enter)
        item.addEventListener("mouseleave", leave)
        rebuilders.push(rebuild)
        destroyers.push(() => {
          item.removeEventListener("mouseenter", enter)
          item.removeEventListener("mouseleave", leave)
          loop?.kill()
          gsap.killTweensOf([panel, strip])

          while (strip.children.length > 1) {
            strip.lastElementChild?.remove()
          }
        })
      })

      const rebuildAll = () => {
        if (!cancelled) {
          rebuilders.forEach((rebuild) => rebuild())
        }
      }

      const handleResize = () => {
        if (resizeTimer) {
          clearTimeout(resizeTimer)
        }

        resizeTimer = setTimeout(rebuildAll, 120)
      }

      rebuildAll()
      window.addEventListener("resize", handleResize)
      document.fonts?.ready.then(() => {
        if (!cancelled) {
          rebuildAll()
        }
      })

      if (!reduceMotion) {
        gsap.from("[data-flow-number]", {
          yPercent: 60,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
        })
      }

      return () => {
        cancelled = true
        window.removeEventListener("resize", handleResize)

        if (resizeTimer) {
          clearTimeout(resizeTimer)
        }

        destroyers.forEach((destroy) => destroy())
      }
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      aria-labelledby="homepage-services-heading"
      className="relative w-full overflow-hidden bg-white px-4 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20"
    >
      <div className="w-full">
        <header className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <h2
              id="homepage-services-heading"
              className={`${nationalCondensed.className} text-[clamp(2rem,3.6vw,3.6rem)] font-extrabold uppercase leading-none tracking-[-0.025em] text-[#14120F]`}
            >
              {title}
            </h2>
            <p className="sr-only">{description}</p>
          </div>
        </header>

        <ol className="border-b border-[#14120F]/25">
          {services.map((service, index) => {
            const number = String(index + 1).padStart(2, "0")

            return (
              <li key={service.key}>
                <Link
                  href={service.href}
                  data-flow-item
                  className="relative grid h-[clamp(6.2rem,9vw,8.5rem)] grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden border-t border-[#14120F]/25 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E0521F] md:grid-cols-[4rem_minmax(0,1fr)_auto] md:gap-6"
                >
                  <span
                    data-flow-number
                    className={`${inter.className} relative z-10 self-start pt-5 text-[0.68rem] font-bold tabular-nums tracking-[0.08em] text-[#E0521F] md:pt-7`}
                  >
                    {number}
                  </span>
                  <span className="relative z-10 min-w-0">
                    <span
                      className={`${nationalCompressed.className} block text-[clamp(2.45rem,5.8vw,6rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.02em] text-[#14120F]`}
                    >
                      {service.title}
                    </span>
                    <span
                      className={`${inter.className} mt-2 block max-w-[52rem] truncate text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[#7C766C] md:text-[0.68rem]`}
                    >
                      {getServiceSummary(service)}
                    </span>
                  </span>
                  <span
                    className={`${inter.className} relative z-10 hidden pr-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#7C766C] sm:block`}
                  >
                    View service
                  </span>

                  <span
                    data-flow-panel
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 block overflow-hidden bg-[#14120F] will-change-transform"
                    style={{ transform: "translate3d(0, 101%, 0)" }}
                  >
                    <span
                      data-flow-strip
                      className="flex h-full w-max items-center will-change-transform"
                    >
                      <span
                        data-flow-part
                        className="flex h-full shrink-0 items-center gap-[clamp(1.75rem,4vw,4rem)] pr-[clamp(1.75rem,4vw,4rem)]"
                      >
                        <span
                          className={`${nationalCompressed.className} whitespace-nowrap text-[clamp(3rem,7vw,7.5rem)] font-extrabold uppercase leading-none tracking-[-0.025em] text-[#F4F1EA]`}
                        >
                          {service.title}
                        </span>
                        <span
                          className="h-[62%] w-[clamp(120px,15vw,210px)] shrink-0 rounded-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${JSON.stringify(service.image)})`,
                          }}
                        />
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>

        <div className="pt-8 md:pt-10">
          <Link
            href={viewAllHref}
            className={`${inter.className} inline-flex min-h-12 items-center justify-center rounded-full bg-[#14120F] px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0521F] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none md:px-10 md:py-4`}
          >
            View all services
          </Link>
        </div>
      </div>
    </section>
  )
}
