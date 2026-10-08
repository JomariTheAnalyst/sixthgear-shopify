"use client"

import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"

import type { VideoFeatureContent } from "@lib/cms/video-feature"
import { nationalCompressed } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

gsap.registerPlugin(useGSAP, MorphSVGPlugin)

const PLAY_PATH =
  "M3.5 5L3.50049 3.9468C3.50049 3.177 4.33382 2.69588 5.00049 3.08078L20.0005 11.741C20.6672 12.1259 20.6672 13.0882 20.0005 13.4731L17.2388 15.1412L17.0055 15.2759M3.50049 8L3.50049 21.2673C3.50049 22.0371 4.33382 22.5182 5.00049 22.1333L14.1192 16.9423L14.4074 16.7759"
const PAUSE_PATH =
  "M15.5004 4.05859V5.0638V5.58691V8.58691V15.5869V19.5869V21.2549M8.5 3.96094V10.3721V17V19L8.5 21"

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00"
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function isExternalLink(value: string) {
  return /^https?:\/\//i.test(value)
}

type YouTubeMessage = {
  event?: string
  info?: number | Record<string, unknown>
}

export default function VideoFeature({ data }: { data: VideoFeatureContent }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const playerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const youtubeRef = useRef<HTMLIFrameElement | null>(null)
  const iconPathRef = useRef<SVGPathElement | null>(null)
  const controlVisualRef = useRef<HTMLSpanElement | null>(null)
  const playButtonRef = useRef<HTMLButtonElement | null>(null)
  const overlayCopyRef = useRef<HTMLDivElement | null>(null)
  const playerControlsRef = useRef<HTMLDivElement | null>(null)
  const chromeHideTweenRef = useRef<gsap.core.Tween | null>(null)
  const shadeRef = useRef<HTMLDivElement | null>(null)
  const syncPlaybackStateRef = useRef<(playing: boolean) => void>(() => {})
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(data.startMuted)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const { contextSafe } = useGSAP({ scope: sectionRef })

  const getChromeTargets = () =>
    [
      controlVisualRef.current,
      overlayCopyRef.current,
      playerControlsRef.current,
    ].filter((target): target is HTMLElement => target !== null)

  const hideChrome = contextSafe((delay = 0) => {
    const targets = getChromeTargets()
    if (!targets.length) return

    chromeHideTweenRef.current?.kill()
    chromeHideTweenRef.current = gsap.to(targets, {
      autoAlpha: 0,
      delay,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 0.3,
      ease: "power2.out",
      overwrite: "auto",
    })
  })

  const showChrome = contextSafe((autoHide = isPlaying) => {
    const targets = getChromeTargets()
    if (!targets.length) return

    chromeHideTweenRef.current?.kill()
    gsap.to(targets, {
      autoAlpha: 1,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 0.18,
      ease: "power2.out",
      overwrite: "auto",
    })

    if (autoHide) hideChrome(1.5)
  })

  const syncPlaybackState = contextSafe((playing: boolean) => {
    setIsPlaying(playing)

    // The controls bar hides while paused; keep keyboard focus on the player.
    if (!playing && playerControlsRef.current?.contains(document.activeElement)) {
      playButtonRef.current?.focus()
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    showChrome(false)
    if (playing) hideChrome(1)

    if (iconPathRef.current) {
      gsap.to(iconPathRef.current, {
        duration: reduceMotion ? 0 : 0.5,
        morphSVG: {
          shape: playing ? PAUSE_PATH : PLAY_PATH,
          type: "rotational",
          map: "complexity",
        },
        ease: "power4.inOut",
        overwrite: "auto",
      })
    }

    if (shadeRef.current) {
      gsap.to(shadeRef.current, {
        opacity: playing ? 0.2 : 0.55,
        duration: reduceMotion ? 0 : 0.45,
        ease: "power2.out",
        overwrite: "auto",
      })
    }
  })
  syncPlaybackStateRef.current = syncPlaybackState

  const postYouTubeCommand = (func: string, args: unknown[] = []) => {
    youtubeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    )
  }

  const initializeYouTubePlayer = () => {
    youtubeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: "homepage-feature-youtube" }),
      "*"
    )
    postYouTubeCommand("addEventListener", ["onReady"])
    postYouTubeCommand("addEventListener", ["onStateChange"])
  }

  useEffect(() => {
    if (data.media.kind !== "youtube") return

    const handleMessage = (event: MessageEvent<string | YouTubeMessage>) => {
      if (!/^https:\/\/([a-z0-9-]+\.)?youtube(?:-nocookie)?\.com$/i.test(event.origin)) {
        return
      }

      let message: YouTubeMessage
      try {
        message =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data
      } catch {
        return
      }

      if (message.event === "onReady") {
        postYouTubeCommand(data.startMuted ? "mute" : "unMute")
        initializeYouTubePlayer()
      }

      if (message.event === "onStateChange" && typeof message.info === "number") {
        if (message.info === 1) syncPlaybackStateRef.current(true)
        if (message.info === 0 || message.info === 2) {
          syncPlaybackStateRef.current(false)
          if (message.info === 0 && !data.loop) setCurrentTime(0)
        }
      }

      if (message.event === "infoDelivery" && message.info && typeof message.info === "object") {
        const info = message.info
        if (typeof info.currentTime === "number") setCurrentTime(info.currentTime)
        if (typeof info.duration === "number") setDuration(info.duration)
        if (typeof info.muted === "boolean") setIsMuted(info.muted)
      }
    }

    window.addEventListener("message", handleMessage)
    const poll = window.setInterval(() => {
      postYouTubeCommand("getCurrentTime")
      postYouTubeCommand("getDuration")
      postYouTubeCommand("isMuted")
    }, 500)

    return () => {
      window.removeEventListener("message", handleMessage)
      window.clearInterval(poll)
    }
  }, [data.loop, data.media.kind, data.startMuted])

  useGSAP(
    () => () => {
      chromeHideTweenRef.current?.kill()
    },
    { scope: sectionRef }
  )

  // Idle play button: soft pulse rings and a slow breathe, only while paused.
  useGSAP(
    () => {
      if (isPlaying) return
      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-play-ring]",
          { scale: 1, opacity: 0.55 },
          {
            scale: 1.7,
            opacity: 0,
            duration: 2,
            ease: "power2.out",
            repeat: -1,
            stagger: 1,
          }
        )
        gsap.to("[data-play-face]", {
          scale: 1.06,
          duration: 1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      })
      return () => media.revert()
    },
    { scope: sectionRef, dependencies: [isPlaying], revertOnUpdate: true }
  )

  const togglePlayback = () => {
    if (data.media.kind === "youtube") {
      postYouTubeCommand(isPlaying ? "pauseVideo" : "playVideo")
      return
    }

    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      void video.play().catch(() => syncPlaybackState(false))
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    if (data.media.kind === "youtube") {
      postYouTubeCommand(isMuted ? "unMute" : "mute")
      setIsMuted(!isMuted)
      return
    }

    if (videoRef.current) videoRef.current.muted = !videoRef.current.muted
  }

  const seekTo = (nextTime: number) => {
    const safeTime = Math.max(0, Math.min(nextTime, duration || 0))
    setCurrentTime(safeTime)
    if (data.media.kind === "youtube") {
      postYouTubeCommand("seekTo", [safeTime, true])
    } else if (videoRef.current) {
      videoRef.current.currentTime = safeTime
    }
  }

  const toggleFullscreen = async () => {
    const player = playerRef.current
    if (!player) return

    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await player.requestFullscreen()
    }
  }

  const cta = data.ctaLabel && data.ctaLink
  const ctaClassName =
    "inline-flex min-h-10 items-center justify-center rounded-full bg-[#F16D34] px-7 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-[#10232E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F16D34]"

  return (
    <section
      ref={sectionRef}
      aria-labelledby="homepage-video-feature-title"
      className="w-full bg-white px-4 py-12 sm:py-16 md:px-8 lg:py-20 min-[1484px]:px-0"
    >
      <div className="mx-auto w-full max-w-[1420px]">
        <div
          ref={playerRef}
          className="relative aspect-[1420/798] overflow-hidden bg-[#111]"
          onPointerEnter={() => showChrome(isPlaying)}
          onPointerMove={() => showChrome(isPlaying)}
          onPointerLeave={() => isPlaying && hideChrome(0.15)}
          onFocusCapture={() => showChrome(false)}
          onBlurCapture={() => isPlaying && hideChrome(0.5)}
        >
          {data.media.kind === "native" ? (
            <video
              ref={videoRef}
              src={data.media.url}
              poster={data.media.posterUrl ?? undefined}
              preload="none"
              playsInline
              muted={data.startMuted}
              loop={data.loop}
              className="h-full w-full object-cover"
              aria-label={data.videoLabel}
              onPlay={() => syncPlaybackState(true)}
              onPause={() => syncPlaybackState(false)}
              onEnded={() => syncPlaybackState(false)}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onDurationChange={(event) => setDuration(event.currentTarget.duration)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
            />
          ) : (
            <iframe
              id="homepage-feature-youtube"
              ref={youtubeRef}
              src={data.media.embedUrl}
              title={data.videoLabel}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={initializeYouTubePlayer}
              className="h-full w-full border-0 object-cover"
            />
          )}

          <div
            ref={shadeRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10 opacity-55"
          />

          <button
            ref={playButtonRef}
            type="button"
            data-play-pause="toggle"
            aria-label={isPlaying ? "Pause video" : "Play video"}
            aria-pressed={isPlaying}
            onClick={togglePlayback}
            className="group absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
          >
            <span
              ref={controlVisualRef}
              className="pointer-events-none relative flex h-16 w-16 items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none sm:h-20 sm:w-20"
            >
              <span data-play-ring aria-hidden="true" className="absolute inset-0 rounded-full bg-[#F16D34] opacity-0" />
              <span data-play-ring aria-hidden="true" className="absolute inset-0 rounded-full bg-[#F16D34] opacity-0" />
              {/* Face: top-lit orange gradient, inner bevel and a warm drop shadow for depth. */}
              <span
                data-play-face
                className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#FF8A55] to-[#D9531C] shadow-[0_18px_36px_-10px_rgba(241,109,52,0.75),0_8px_16px_rgba(0,0,0,0.35),inset_0_2px_1px_rgba(255,255,255,0.45),inset_0_-5px_10px_rgba(0,0,0,0.28)]"
              >
              <svg aria-hidden="true" viewBox="0 0 24 25" fill="none" className="h-8 w-8 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] sm:h-10 sm:w-10">
                <path
                  ref={iconPathRef}
                  data-play-pause="path"
                  d={PLAY_PATH}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="16"
                  strokeLinecap="round"
                />
              </svg>
              </span>
            </span>
          </button>

          <div
            ref={overlayCopyRef}
            className="pointer-events-none absolute inset-x-0 top-1/2 z-20 mt-12 px-5 text-center text-white sm:mt-14"
          >
            <h2
              id="homepage-video-feature-title"
              className={`${nationalCompressed.className} text-[34px] uppercase leading-none tracking-[0.025em] sm:text-[48px] lg:text-[64px]`}
            >
              {data.title}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm font-medium sm:text-base">
              {data.description}
            </p>
          </div>

          <div
            ref={playerControlsRef}
            role="group"
            aria-label="Video controls"
            className={`absolute inset-x-0 bottom-0 z-30 items-center gap-2 bg-black/95 px-3 py-3 text-white sm:gap-3 sm:px-5 ${isPlaying ? "flex" : "hidden"}`}
          >
            <button type="button" onClick={togglePlayback} aria-label={isPlaying ? "Pause video" : "Play video"} className="shrink-0 p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
              {isPlaying ? (
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path d="M4 3h4v14H4zM12 3h4v14h-4z" /></svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path d="m5 3 12 7-12 7z" /></svg>
              )}
            </button>
            <button type="button" onClick={toggleMute} aria-label={isMuted ? "Unmute video" : "Mute video"} className="shrink-0 p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-[18px] sm:w-[18px]">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                {isMuted ? (
                  <path d="m17 9 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </svg>
            </button>
            <span className="w-9 shrink-0 text-right text-[11px] tabular-nums sm:w-10 sm:text-xs">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 0)}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => seekTo(Number(event.currentTarget.value))}
              aria-label="Video progress"
              className="h-1 min-w-0 flex-1 cursor-pointer accent-white"
            />
            <span className="w-11 shrink-0 text-[11px] tabular-nums sm:w-12 sm:text-xs">-{formatTime(Math.max(duration - currentTime, 0))}</span>
            <button type="button" onClick={() => void toggleFullscreen()} aria-label="Toggle fullscreen" className="shrink-0 p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></svg>
            </button>
          </div>
        </div>

        {cta && (
          <div className="mt-4 flex justify-center sm:mt-5">
            {isExternalLink(data.ctaLink!) ? (
              <a href={data.ctaLink!} className={ctaClassName} target="_blank" rel="noreferrer">
                {data.ctaLabel}
              </a>
            ) : (
              <LocalizedClientLink href={data.ctaLink!} className={ctaClassName}>
                {data.ctaLabel}
              </LocalizedClientLink>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
