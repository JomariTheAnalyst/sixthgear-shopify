"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Pause, Play } from "lucide-react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Video only where it is worth the bandwidth and motion is welcome.
const VIDEO_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"

interface FullWidthBannerProps {
  imageSrc: string
  imageAlt: string
  objectPosition: string
  videoUrl: string | null
  darkOverlay: boolean
  /** Copy block, already positioned by the parent. */
  children: ReactNode
}

export default function FullWidthBanner({
  imageSrc,
  imageAlt,
  objectPosition,
  videoUrl,
  darkOverlay,
  children,
}: FullWidthBannerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const userPausedRef = useRef(false)
  const [canPlayVideo, setCanPlayVideo] = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!videoUrl) return
    const query = window.matchMedia(VIDEO_QUERY)
    const sync = () => setCanPlayVideo(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [videoUrl])

  // preload="none" and no src until the banner is near the screen; pause once it leaves.
  useEffect(() => {
    const root = rootRef.current
    const video = videoRef.current
    if (!canPlayVideo || !videoUrl || !root || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause()
          return
        }
        if (!video.getAttribute("src")) video.src = videoUrl
        if (!userPausedRef.current) video.play().catch(() => {})
      },
      { rootMargin: "300px 0px" }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [canPlayVideo, videoUrl])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    userPausedRef.current = !paused
    if (paused) video.play().catch(() => {})
    else video.pause()
    setPaused(!paused)
  }

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const mm = gsap.matchMedia()

      // The media layer is 16% taller than the box (8% each side); ±6% of its
      // own height stays inside that margin, so no gap shows.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-banner-parallax]",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      })

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const zoom = (scale: number) => () =>
            gsap.to("[data-banner-zoom]", { scale, duration: 1.2, ease: "power2.out" })
          const zoomIn = zoom(1.06)
          const zoomOut = zoom(1)
          root.addEventListener("pointerenter", zoomIn)
          root.addEventListener("pointerleave", zoomOut)
          return () => {
            root.removeEventListener("pointerenter", zoomIn)
            root.removeEventListener("pointerleave", zoomOut)
          }
        }
      )
    },
    { scope: rootRef }
  )

  const showVideo = canPlayVideo && Boolean(videoUrl)

  return (
    <div
      ref={rootRef}
      className="relative aspect-[4/5] w-full overflow-hidden bg-black md:aspect-video lg:aspect-[21/9] lg:max-h-[720px]"
    >
      <div data-banner-parallax className="absolute inset-x-0 -bottom-[8%] -top-[8%]">
        <div data-banner-zoom className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            style={{ objectPosition }}
            sizes="100vw"
          />
          {showVideo && (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              onPlaying={() => setVideoVisible(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                videoVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ objectPosition }}
            />
          )}
        </div>
      </div>

      {darkOverlay && <div className="pointer-events-none absolute inset-0 bg-black/40" />}

      {children}

      {showVideo && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={paused ? "Play background video" : "Pause background video"}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:right-8 md:top-8"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
