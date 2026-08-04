"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

gsap.registerPlugin(useGSAP)

interface MarqueeStripProps {
  messages?: string[]
  backgroundColor?: string
  textColor?: string
  speed?: number
}

const DEFAULT_MESSAGES = [
  "\u{1F389} 30% OFF on all motorcycle parts this January 2026!",
  "\u2615 Buy 2 Get 1 FREE on all coffee drinks - Limited time only!",
  "\u{1F3CD}\uFE0F FREE PMS check-up for new customers!",
  "\u{1F525} Hot Deals: Premium riding gear up to 50% OFF!",
]

function MessageSequence({
  messages,
  textColor,
  measureRef,
  hidden = false,
}: {
  messages: string[]
  textColor: string
  measureRef?: React.RefObject<HTMLDivElement | null>
  hidden?: boolean
}) {
  return (
    <div
      ref={measureRef}
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {messages.map((message, index) => (
        <span
          key={`${message}-${index}`}
          className="inline-block shrink-0 px-8 text-sm font-medium"
          style={{ color: textColor }}
        >
          {message}
        </span>
      ))}
    </div>
  )
}

export default function MarqueeStrip({
  messages = DEFAULT_MESSAGES,
  backgroundColor = "#000000",
  textColor = "#FFFFFF",
  speed = 50,
}: MarqueeStripProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [copiesPerGroup, setCopiesPerGroup] = useState(1)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const firstGroupRef = useRef<HTMLDivElement | null>(null)
  const baseSequenceRef = useRef<HTMLDivElement | null>(null)
  const messageKey = useMemo(() => messages.join("\u001F"), [messages])

  useEffect(() => {
    const dismissed = localStorage.getItem("sg_marquee_dismissed")
    if (dismissed === "true") setIsDismissed(true)
  }, [])

  useGSAP(
    () => {
      const viewport = viewportRef.current
      const track = trackRef.current
      const firstGroup = firstGroupRef.current
      const baseSequence = baseSequenceRef.current

      if (!viewport || !track || !firstGroup || !baseSequence) return

      let tween: gsap.core.Tween | null = null
      let allowMotion = true
      let active = true

      const rebuild = () => {
        const baseWidth = baseSequence.getBoundingClientRect().width
        const viewportWidth = viewport.getBoundingClientRect().width

        if (baseWidth <= 0 || viewportWidth <= 0) return

        const requiredCopies = Math.max(
          1,
          Math.ceil(viewportWidth / baseWidth)
        )

        if (requiredCopies !== copiesPerGroup) {
          setCopiesPerGroup(requiredCopies)
          return
        }

        const groupWidth = firstGroup.getBoundingClientRect().width
        if (groupWidth <= 0) return

        tween?.kill()
        gsap.set(track, { x: 0 })

        if (!allowMotion) return

        tween = gsap.to(track, {
          x: -groupWidth,
          duration: Math.max(speed, 1),
          ease: "none",
          repeat: -1,
        })
      }

      const resizeCall = gsap.delayedCall(0.1, rebuild).pause()
      const resizeObserver = new ResizeObserver(() => {
        resizeCall.restart(true)
      })
      resizeObserver.observe(viewport)
      resizeObserver.observe(baseSequence)

      const media = gsap.matchMedia()
      media.add(
        {
          allowMotion: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          allowMotion = Boolean(context.conditions?.allowMotion)
          rebuild()
        }
      )

      document.fonts?.ready.then(() => {
        if (active) resizeCall.restart(true)
      })

      return () => {
        active = false
        tween?.kill()
        resizeCall.kill()
        resizeObserver.disconnect()
        media.revert()
      }
    },
    {
      scope: rootRef,
      dependencies: [copiesPerGroup, messageKey, speed],
      revertOnUpdate: true,
    }
  )

  const handleDismiss = () => {
    localStorage.setItem("sg_marquee_dismissed", "true")
    setIsDismissed(true)
  }

  if (isDismissed || messages.length === 0) return null

  return (
    <div
      ref={rootRef}
      className="fixed left-0 right-0 top-0 z-[100] overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="relative flex h-10 items-center">
        <div ref={viewportRef} className="flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max whitespace-nowrap will-change-transform motion-reduce:transform-none motion-reduce:will-change-auto"
          >
            <div ref={firstGroupRef} className="flex shrink-0">
              {Array.from({ length: copiesPerGroup }, (_, index) => (
                <MessageSequence
                  key={`primary-${index}`}
                  messages={messages}
                  textColor={textColor}
                  measureRef={index === 0 ? baseSequenceRef : undefined}
                  hidden={index > 0}
                />
              ))}
            </div>

            <div className="flex shrink-0" aria-hidden="true">
              {Array.from({ length: copiesPerGroup }, (_, index) => (
                <MessageSequence
                  key={`duplicate-${index}`}
                  messages={messages}
                  textColor={textColor}
                  hidden
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="absolute right-2 flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-white/10"
          aria-label="Dismiss announcement"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: textColor }}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
