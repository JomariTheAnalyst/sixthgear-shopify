"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type ComponentType } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Coffee, ShieldCheck, Users, Wrench } from "lucide-react"

import type { AboutWhyChooseUsSectionContent } from "@lib/cms/about-page-main"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { resolveSanityImage } from "@lib/util/sanity-image"
import { ABOUT_CONTAINER, ABOUT_PROSE } from "@modules/about/constants"
import { MOTION_OK } from "@modules/about/motion"
import {
  ABOUT_BODY,
  ABOUT_EYEBROW,
  ABOUT_SUBTITLE,
  ABOUT_TITLE,
} from "@modules/about/styles"
import type { AboutWhyChooseUsIconKey } from "@modules/about/types"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

gsap.registerPlugin(useGSAP)

interface WhyChooseUsProps {
  data: AboutWhyChooseUsSectionContent
}

/** How long an image item stays open before the next one opens. */
const IMAGE_DWELL_SECONDS = 7
/** A video that has not started by then falls back to the image timer. */
const VIDEO_START_TIMEOUT_MS = 2000
/** Below Tailwind's md breakpoint: tap only, no auto-advance. */
const PHONE_QUERY = "(max-width: 767px)"

const ICON_MAP: Record<
  AboutWhyChooseUsIconKey,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  wrench: Wrench,
  shield: ShieldCheck,
  users: Users,
  coffee: Coffee,
}

function WhyIcon({ iconKey }: { iconKey?: string | null }) {
  const Icon = ICON_MAP[(iconKey as AboutWhyChooseUsIconKey) || "wrench"] || Wrench
  return <Icon strokeWidth={1.5} className="h-6 w-6 text-[#F16D34] md:h-7 md:w-7" />
}

/** Plus that turns into a minus when its panel is open. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-current" />
      <span
        className={`absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-current transition-transform duration-300 motion-reduce:transition-none ${
          open ? "scale-y-0" : "scale-y-100"
        }`}
      />
    </span>
  )
}

/**
 * One item is always open. On tablet and desktop the open item's progress bar
 * fills over IMAGE_DWELL_SECONDS (or follows its video), then the next item
 * opens. Auto-advance pauses while hovered/focused or off screen, and stops for
 * the rest of the visit once the visitor clicks a row. Phones (below 768px)
 * and reduced motion never auto-advance: rows open on tap only and the open
 * row's bar shows full. A video that has not started within
 * VIDEO_START_TIMEOUT_MS, or errors, falls back to the image timer on its poster.
 */
export default function WhyChooseUs({ data }: WhyChooseUsProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = data.source === "sanity"
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [inView, setInView] = useState(false)
  const [nearScreen, setNearScreen] = useState(false)
  const [isPhone, setIsPhone] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [userStopped, setUserStopped] = useState(false)
  const [failedVideos, setFailedVideos] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const barRefs = useRef<(HTMLSpanElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const sectionImage = resolveSanityImage(data.bottomImageSource, data.bottomImageUrl)
  const items = data.items.map((item) => ({
    ...item,
    media: item.imageUrl
      ? resolveSanityImage(item.imageSource, item.imageUrl)
      : sectionImage,
    alt: item.imageAlt || data.bottomImageAlt,
  }))
  const count = items.length
  const autoAdvance = !isPhone && !reducedMotion && !userStopped
  const running = autoAdvance && inView && !hovered
  const activeVideoFailed = failedVideos.includes(active)
  const next = () => setActive((index) => (index + 1) % count)

  useEffect(() => {
    const phone = window.matchMedia(PHONE_QUERY)
    const motion = window.matchMedia(MOTION_OK)
    const sync = () => {
      setIsPhone(phone.matches)
      setReducedMotion(!motion.matches)
    }
    sync()
    phone.addEventListener("change", sync)
    motion.addEventListener("change", sync)
    return () => {
      phone.removeEventListener("change", sync)
      motion.removeEventListener("change", sync)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const visible = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    )
    // Start loading the video one screen ahead of the section.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNearScreen(true)
        near.disconnect()
      },
      { rootMargin: "100% 0px" }
    )
    visible.observe(section)
    near.observe(section)
    return () => {
      visible.disconnect()
      near.disconnect()
    }
  }, [])

  // Progress for the open item: a tween for images, the playhead for videos.
  useGSAP(
    () => {
      const bar = barRefs.current[active]
      if (!bar) return
      const video = activeVideoFailed ? null : videoRefs.current[active]

      barRefs.current.forEach((el) => el && el !== bar && gsap.set(el, { scaleX: 0 }))
      videoRefs.current.forEach((el, index) => {
        if (el && index !== active) {
          el.pause()
          el.currentTime = 0
        }
      })

      if (!autoAdvance) {
        gsap.set(bar, { scaleX: 1 })
        return
      }

      if (video) {
        gsap.set(bar, { scaleX: 0 })
        const onTime = () =>
          gsap.set(bar, {
            scaleX: video.duration ? video.currentTime / video.duration : 0,
          })
        video.addEventListener("timeupdate", onTime)
        video.addEventListener("ended", next)
        return () => {
          video.removeEventListener("timeupdate", onTime)
          video.removeEventListener("ended", next)
        }
      }

      tweenRef.current = gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: IMAGE_DWELL_SECONDS,
          ease: "none",
          paused: true,
          onComplete: next,
        }
      )
      return () => {
        tweenRef.current?.kill()
        tweenRef.current = null
      }
    },
    {
      scope: sectionRef,
      dependencies: [active, count, autoAdvance, activeVideoFailed],
    }
  )

  // Pause/resume without restarting progress; play the open video.
  useEffect(() => {
    tweenRef.current?.paused(!running)

    const video = videoRefs.current[active]
    if (!video || activeVideoFailed) return

    const shouldPlay = !reducedMotion && inView && !(autoAdvance && hovered)
    if (!shouldPlay) {
      video.pause()
      return
    }

    // Never stall the accordion on a video that will not start.
    const fail = () => {
      video.pause()
      setFailedVideos((list) => (list.includes(active) ? list : [...list, active]))
    }
    const timer =
      autoAdvance && video.currentTime === 0
        ? window.setTimeout(fail, VIDEO_START_TIMEOUT_MS)
        : undefined
    const onPlaying = () => window.clearTimeout(timer)
    video.addEventListener("playing", onPlaying)
    video.addEventListener("error", fail)
    video.play().catch((error: unknown) => {
      // AbortError only means a pause() interrupted play(); not a failure.
      if (!(error instanceof DOMException && error.name === "AbortError")) fail()
    })

    return () => {
      window.clearTimeout(timer)
      video.removeEventListener("playing", onPlaying)
      video.removeEventListener("error", fail)
    }
  }, [running, active, activeVideoFailed, autoAdvance, hovered, inView, reducedMotion])

  const activeItem = items[active]

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-why-heading"
      className="bg-white py-20 md:py-28 lg:py-32"
    >
      <div className={ABOUT_CONTAINER}>
        <header className={ABOUT_PROSE}>
          <p className={ABOUT_EYEBROW}>{data.sectionLabel}</p>
          <h2 id="about-why-heading" className={`${ABOUT_TITLE} mt-4 text-[#1a1a1a]`}>
            {data.heading}
          </h2>
          <p className={`${ABOUT_BODY} mt-5 text-[#1a1a1a]/70`}>{data.subtitle}</p>
        </header>

        {/* Accordion left, media right: equal columns, centred on each other. */}
        <div
          className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
        >
          <ul className="border-t border-black/10 lg:order-1">
            {items.map((item, index) => {
              const open = active === index
              const buttonId = `about-why-button-${index}`
              const panelId = `about-why-panel-${index}`

              return (
                <li
                  key={item.key}
                  data-sanity={
                    sanitySource
                      ? createSanityDataAttribute(visualEditingEnabled, {
                          documentId: "aboutPage",
                          documentType: "aboutPage",
                          path: keyedSanityPath("whyChooseUs.items", item.key),
                        })
                      : undefined
                  }
                  className="relative border-b border-black/10"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => {
                        setUserStopped(true)
                        setActive(index)
                      }}
                      className="flex w-full items-center gap-4 py-6 text-left text-[#1a1a1a] transition-colors hover:text-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34] md:gap-6 md:py-8"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F16D34]/10 md:h-14 md:w-14">
                        <WhyIcon iconKey={item.icon} />
                      </span>
                      <span className={`${ABOUT_SUBTITLE} flex-1 text-[clamp(1.5rem,2.4vw,2.5rem)]`}>
                        {item.title}
                      </span>
                      <PlusMinus open={open} />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    inert={!open}
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`${ABOUT_BODY} ${ABOUT_PROSE} pb-7 text-[#1a1a1a]/70 sm:pl-16 md:pb-8 md:pl-20`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar on the row's bottom border. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-px left-0 h-0.5 w-full overflow-hidden"
                  >
                    <span
                      ref={(el) => {
                        barRefs.current[index] = el
                      }}
                      className="block h-full w-full origin-left scale-x-0 bg-[#F16D34]"
                    />
                  </span>
                </li>
              )
            })}
          </ul>

          {/* Same frame as the Who We Are image. */}
          <div className="relative isolate aspect-square overflow-hidden rounded-[20px] bg-grey-10 lg:order-2">
            {items.map((item, index) => {
              const open = active === index
              return (
                <div
                  key={item.key}
                  aria-hidden={!open}
                  className={`absolute inset-0 -z-10 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.videoUrl ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el
                      }}
                      src={item.videoUrl}
                      poster={item.media.url}
                      muted
                      playsInline
                      preload={nearScreen ? "auto" : "none"}
                      aria-label={item.alt}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.media.url}
                      alt={item.alt}
                      data-sanity={
                        sanitySource && !item.imageUrl
                          ? createSanityDataAttribute(visualEditingEnabled, {
                              documentId: "aboutPage",
                              documentType: "aboutPage",
                              path: "whyChooseUs.bottomImage",
                            })
                          : undefined
                      }
                      fill
                      sizes="(max-width: 1023px) 100vw, (max-width: 1760px) 50vw, 800px"
                      className="object-cover"
                      style={{ objectPosition: item.media.objectPosition }}
                    />
                  )}
                </div>
              )
            })}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
            />

            {/* Decorative: the title is already the open row's heading. */}
            <p
              key={activeItem?.key}
              aria-hidden="true"
              className={`${ABOUT_SUBTITLE} absolute inset-x-0 bottom-0 p-6 text-[clamp(2rem,3.4vw,3.5rem)] text-white sm:p-8 lg:p-10`}
            >
              {activeItem?.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
