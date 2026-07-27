"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { interDisplay, lato } from "@lib/fonts"
import type { SanityCoffeeShowcase } from "@lib/cms/types"
import { cleanSanityString } from "@lib/cms/visual-editing"
import { selectCoffeeShowcaseContent } from "./content"
import {
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react"

interface CoffeeShowcaseProps {
  data?: SanityCoffeeShowcase | null
}

const STORY_DURATION_MS = 5000
const STORY_TICK_MS = 50

export default function CoffeeShowcase({ data }: CoffeeShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [isInViewport, setIsInViewport] = useState(false)
  const [videoDurations, setVideoDurations] = useState<Record<string, number>>({})
  const sectionRef = useRef<HTMLElement | null>(null)
  const progressRef = useRef(0)
  const intervalRef = useRef<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const content = selectCoffeeShowcaseContent(data)
  const galleryMedia = content.coffeeItems
  const activeStory = galleryMedia[activeIndex] || galleryMedia[0]
  const activeDurationMs =
    activeStory?.type === "video"
      ? videoDurations[activeStory.src] || activeStory.durationMs || STORY_DURATION_MS
      : STORY_DURATION_MS

  const resetStory = () => {
    progressRef.current = 0
    setStoryProgress(0)
    setIsEnded(false)
  }

  const playVideoAtIndex = (index: number) => {
    const video = videoRefs.current[index]

    if (!video || !isInViewport) return

    video.muted = false
    video.play().catch(() => {
      setIsPaused(true)
    })
  }

  const handlePrevious = () => {
    resetStory()
    setIsPaused(false)
    setActiveIndex((prev) => (prev - 1 + galleryMedia.length) % galleryMedia.length)
  }

  const handleNext = () => {
    resetStory()
    setIsPaused(false)
    setActiveIndex((prev) => (prev + 1) % galleryMedia.length)
  }

  const handleProgressClick = (index: number) => {
    resetStory()
    setIsPaused(false)
    setActiveIndex(index)
  }

  const handleStoryControl = () => {
    if (isEnded) {
      resetStory()
      setActiveIndex(0)
      setIsPaused(false)
      return
    }

    if (isPaused) {
      playVideoAtIndex(activeIndex)
    }

    setIsPaused((current) => !current)
  }

  useEffect(() => {
    resetStory()
  }, [activeIndex])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    if (!("IntersectionObserver" in window)) {
      setIsInViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting)
      },
      {
        threshold: 0.35,
      }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return

      if (index !== activeIndex) {
        video.pause()
        video.currentTime = 0
        return
      }

      video.muted = false

      if (!isInViewport || isPaused || isEnded) {
        video.pause()
        return
      }

      const playPromise = video.play()

      if (playPromise) {
        playPromise.catch(() => {
          setIsPaused(true)
        })
      }
    })
  }, [activeIndex, isEnded, isInViewport, isPaused])

  useEffect(() => {
    if (galleryMedia.length === 0 || !isInViewport || isPaused || isEnded) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      return
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const totalTicks = activeDurationMs / STORY_TICK_MS

    intervalRef.current = window.setInterval(() => {
      progressRef.current += 1
      const nextProgress = (progressRef.current / totalTicks) * 100
      setStoryProgress(nextProgress)

      if (progressRef.current >= totalTicks) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        if (activeStory?.type === "video") {
          setStoryProgress(100)
          return
        }

        if (activeIndex < galleryMedia.length - 1) {
          setActiveIndex((index) => index + 1)
        } else {
          setStoryProgress(100)
          setIsPaused(true)
          setIsEnded(true)
        }
      }
    }, STORY_TICK_MS)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [activeDurationMs, activeIndex, activeStory?.type, galleryMedia.length, isEnded, isInViewport, isPaused])

  return (
    <section ref={sectionRef} className="relative">
      <div className="w-full -mb-1 relative z-10">
        <Image
          src="/images/firstgear-coffee/imgi_13_691aef1ff3fe8593c72c20e1_Frame 2147239539.svg"
          alt=""
          width={1600}
          height={120}
          className="w-full h-auto"
        />
      </div>

      <div className="bg-[#47271f] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] gap-14 lg:gap-16 items-center">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative w-full max-w-[390px] aspect-[9/14] sm:max-w-[420px]">
                <div className="absolute inset-0 rounded-[24px] overflow-hidden border border-white/70 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.32)] z-10">
                  <div
                    className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                  >
                    {galleryMedia.map((media, index) => (
                      <div
                        key={media.key}
                        className="relative h-full w-full flex-shrink-0"
                      >
                        {media.type === "video" ? (
                          <video
                            ref={(element) => {
                              videoRefs.current[index] = element
                            }}
                            src={cleanSanityString(media.src)}
                            aria-label={media.mediaAlt}
                            className="h-full w-full object-cover"
                            muted={false}
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={(event) => {
                              const duration = event.currentTarget.duration

                              if (!Number.isFinite(duration) || duration <= 0) return

                              setVideoDurations((durations) => ({
                                ...durations,
                                [media.src]: duration * 1000,
                              }))
                            }}
                            onEnded={() => {
                              if (index !== activeIndex) return

                              if (activeIndex < galleryMedia.length - 1) {
                                handleNext()
                              } else {
                                setStoryProgress(100)
                                setIsPaused(true)
                                setIsEnded(true)
                              }
                            }}
                          />
                        ) : (
                          <Image
                            src={cleanSanityString(media.src)}
                            alt={media.mediaAlt}
                            fill
                            sizes="(max-width: 1024px) 76vw, 430px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/0 to-black/75" />

                  <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4">
                    <div className="flex gap-1.5">
                      {galleryMedia.map((media, index) => {
                        const isActive = index === activeIndex
                        const isCompleted = index < activeIndex

                        return (
                          <button
                            key={media.key}
                            type="button"
                            onClick={() => handleProgressClick(index)}
                            aria-label={`Show coffee story ${index + 1}`}
                            className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35"
                          >
                            <span
                              className="block h-full rounded-full bg-[#f4a787] transition-[width] duration-100 ease-linear"
                              style={{
                                width: isActive
                                  ? `${storyProgress}%`
                                  : isCompleted
                                  ? "100%"
                                  : "0%",
                              }}
                            />
                          </button>
                        )
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#f4a787] bg-[#47271f]">
                          <Image
                            src={cleanSanityString(content.storyProfileLogoUrl)}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className={`${lato.className} truncate text-sm font-bold uppercase tracking-[0.08em] text-white`}>
                            {content.storyProfileName}
                          </p>
                          <p className={`${interDisplay.className} text-xs text-white/70`}>
                            {content.storyProfileSubtitle}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleStoryControl}
                        aria-label={
                          isEnded
                            ? "Replay coffee story"
                            : isPaused
                            ? "Play coffee story"
                            : "Pause coffee story"
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                      >
                        {isEnded ? (
                          <RotateCcw className="h-4 w-4" />
                        ) : isPaused ? (
                          <Play className="h-4 w-4 fill-current" />
                        ) : (
                          <Pause className="h-4 w-4 fill-current" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrevious}
                    aria-label="Previous coffee story"
                    className="absolute inset-y-20 left-0 z-20 w-1/3"
                  />
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next coffee story"
                    className="absolute inset-y-20 right-0 z-20 w-1/3"
                  />

                  <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-left text-white">
                    <p className={`${interDisplay.className} text-xs font-semibold uppercase tracking-[0.18em] text-[#f4a787]`}>
                      {activeStory.eyebrow}
                    </p>
                    <h3 className={`${lato.className} mt-2 max-w-[14rem] text-2xl font-bold uppercase leading-tight tracking-[0.04em] text-white`}>
                      {activeStory.title}
                    </h3>
                    <p className={`${interDisplay.className} mt-2 max-w-[18rem] text-sm leading-relaxed text-white/85`}>
                      {activeStory.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center lg:px-8">
              <Image
                src={cleanSanityString(content.coffeeIconUrl)}
                alt="First Gear Coffee icon"
                width={160}
                height={160}
                className="w-32 md:w-40 mb-8"
                style={{ height: "auto" }}
              />

              <h2
                className={`${lato.className} text-[#fff6ef] text-2xl md:text-3xl lg:text-[38px] font-bold uppercase tracking-[0.05em] leading-[1.18] whitespace-pre-line max-w-md mb-6`}
              >
                {content.sectionHeading}
              </h2>

              <p
                className={`${interDisplay.className} text-[#ead7cc] text-sm md:text-base font-medium leading-[1.75] max-w-md`}
              >
                {content.descriptionText}
              </p>

              {content.buttonText && content.buttonLink ? (
                <Link
                  href={cleanSanityString(content.buttonLink)}
                  className={`${lato.className} mt-8 inline-flex items-center gap-2 text-[#f4a787] text-sm md:text-base font-semibold uppercase tracking-[0.06em] border-b-2 border-[#f4a787] pb-1 hover:opacity-75 transition-opacity`}
                >
                  {content.buttonText}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full -mt-1 relative z-10">
        <Image
          src="/images/firstgear-coffee/imgi_16_691c021fe5be5a70061df439_Frame 2147239540.svg"
          alt=""
          width={1600}
          height={120}
          className="w-full h-auto block"
        />
      </div>
    </section>
  )
}
