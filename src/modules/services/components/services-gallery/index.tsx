"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react"

import { inter, montserrat } from "@lib/fonts"

type ServicesGalleryItem = {
  src: string
  label: string
}

const SERVICES_GALLERY_ITEMS: ServicesGalleryItem[] = [
  {
    src: "https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1779688482/services-gallery1_opnub5.mp4",
    label: "Sixthgear services gallery video 1",
  },
  {
    src: "https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1779688481/services-gallery6_wp4xru.mp4",
    label: "Sixthgear services gallery video 2",
  },
  {
    src: "https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1779688480/services-gallery4_ragdgc.mp4",
    label: "Sixthgear services gallery video 3",
  },
  {
    src: "https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1779688479/snapsave-app_1B4YD3Ug6a_hd_xyvrr1.mp4",
    label: "Sixthgear services gallery video 4",
  },
  {
    src: "https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1779688478/services-gallery5_d5dgo5.mp4",
    label: "Sixthgear services gallery video 5",
  },
  {
    src: "https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1779688477/services-gallery3_ephlaj.mp4",
    label: "Sixthgear services gallery video 6",
  },
  {
    src: "https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1779688477/services-gallery2_y14j4u.mp4",
    label: "Sixthgear services gallery video 7",
  },
]

const SIXTHGEAR_LOGO =
  "/images/logo/Sixthgear_Moto_Supply-removebg-preview.png"

export default function ServicesGallery() {
  const params = useParams()
  const countryCode =
    typeof params?.countryCode === "string" ? params.countryCode : null
  const contactHref = `/${countryCode || "ph"}/contact?subject=${encodeURIComponent(
    "Service Booking"
  )}`

  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [isInViewport, setIsInViewport] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    if (!("IntersectionObserver" in window)) {
      setIsInViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting)
      },
      { threshold: 0.35 }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return
      }

      if (index === currentIndex) {
        video.currentTime = 0
      } else {
        video.pause()
        video.currentTime = 0
      }
    })

    setProgress(0)
    setIsEnded(false)
  }, [currentIndex])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return
      }

      if (index !== currentIndex) {
        video.pause()
        return
      }

      if (!isInViewport || isPaused || isEnded) {
        video.pause()
        return
      }

      const playPromise = video.play()

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPaused(true)
        })
      }
    })
  }, [currentIndex, isEnded, isInViewport, isPaused])

  const goToStory = (index: number) => {
    const totalItems = SERVICES_GALLERY_ITEMS.length
    const normalizedIndex = (index + totalItems) % totalItems

    setCurrentIndex(normalizedIndex)
    setIsPaused(false)
    setIsEnded(false)
    setProgress(0)
  }

  const handleTimeUpdate = (video: HTMLVideoElement) => {
    if (!video.duration || Number.isNaN(video.duration)) {
      setProgress(0)
      return
    }

    setProgress((video.currentTime / video.duration) * 100)
  }

  const handleEnded = () => {
    if (currentIndex < SERVICES_GALLERY_ITEMS.length - 1) {
      goToStory(currentIndex + 1)
      return
    }

    setProgress(100)
    setIsPaused(true)
    setIsEnded(true)
  }

  const handleStoryControl = () => {
    const currentVideo = videoRefs.current[currentIndex]

    if (isEnded) {
      goToStory(0)
      return
    }

    if (isPaused) {
      currentVideo?.play().catch(() => {
        setIsPaused(true)
      })
      setIsPaused(false)
      return
    }

    currentVideo?.pause()
    setIsPaused(true)
  }

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-white py-20 md:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-[minmax(310px,0.82fr)_minmax(0,1fr)] lg:gap-16 lg:px-16">
        <div className="flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[390px] aspect-[9/14]">
            <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-black/10 bg-white p-2 shadow-[0_28px_80px_rgba(0,0,0,0.16)]">
              <div className="relative h-full overflow-hidden rounded-[22px] bg-black">
                <div
                  className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {SERVICES_GALLERY_ITEMS.map((item, index) => (
                    <div key={item.src} className="h-full w-full flex-shrink-0 bg-black">
                      <video
                        ref={(node) => {
                          videoRefs.current[index] = node
                        }}
                        className="h-full w-full object-cover"
                        src={item.src}
                        aria-label={item.label}
                        muted
                        playsInline
                        preload={index === 0 ? "auto" : "metadata"}
                        onTimeUpdate={(event) =>
                          handleTimeUpdate(event.currentTarget)
                        }
                        onEnded={handleEnded}
                      />
                    </div>
                  ))}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/0 to-black/20" />

                <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4">
                  <div className="flex gap-1.5">
                    {SERVICES_GALLERY_ITEMS.map((item, index) => {
                      const width =
                        index < currentIndex
                          ? "100%"
                          : index === currentIndex
                            ? `${progress}%`
                            : "0%"

                      return (
                        <button
                          key={item.src}
                          type="button"
                          onClick={() => goToStory(index)}
                          aria-label={`Show services story ${index + 1}`}
                          className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35"
                        >
                          <span
                            className="block h-full rounded-full bg-[#F16D34] transition-[width] duration-100 ease-linear"
                            style={{ width }}
                          />
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#F16D34] bg-white">
                        <Image
                          src={SIXTHGEAR_LOGO}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <p
                          className={`${montserrat.className} truncate text-sm font-black uppercase tracking-[0.08em] text-white`}
                        >
                          Sixthgear Moto
                        </p>
                        <p className={`${inter.className} text-xs text-white`}>
                          Workshop stories
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleStoryControl}
                      aria-label={
                        isEnded
                          ? "Replay services story"
                          : isPaused
                            ? "Play services story"
                            : "Pause services story"
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors hover:bg-white/22"
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
                  onClick={() => goToStory(currentIndex - 1)}
                  aria-label="Previous services story"
                  className="absolute inset-y-20 left-0 z-10 w-1/3"
                />
                <button
                  type="button"
                  onClick={() => goToStory(currentIndex + 1)}
                  aria-label="Next services story"
                  className="absolute inset-y-20 right-0 z-10 w-1/3"
                />

                <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => goToStory(currentIndex - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-md transition-colors hover:bg-white"
                    aria-label="Previous service video"
                  >
                    <ChevronLeft size={18} strokeWidth={2.4} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStory(currentIndex + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-md transition-colors hover:bg-white"
                    aria-label="Next service video"
                  >
                    <ChevronRight size={18} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">


          <h2
            className={`${montserrat.className} mt-4 text-[2.5rem] font-black uppercase leading-[0.92] tracking-[-0.06em] text-[#111] md:text-5xl lg:text-6xl`}
          >
            See the workshop before you book
          </h2>
          <p
            className={`${inter.className} mt-6 max-w-[560px] text-sm font-medium leading-7 text-black/62 md:text-base`}
          >
            A quick look inside the Sixthgear Moto service floor: real hands,
            real bikes, and the kind of careful workshop rhythm that turns a
            booking into a smoother, safer ride.
          </p>
          <Link
            href={contactHref}
            className={`${montserrat.className} mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#F16D34] px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]`}
          >
            Book Now
            <ChevronRight className="h-4 w-4" strokeWidth={2.8} />
          </Link>
        </div>
      </div>
    </section>
  )
}
