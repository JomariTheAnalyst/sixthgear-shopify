"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Link from "next/link"

import type { SanityAnnouncementBar } from "@lib/cms/types"
import {
  cleanSanityString,
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

gsap.registerPlugin(useGSAP)

interface AnnouncementBarProps {
  data: SanityAnnouncementBar | null
}

interface AnnouncementSequenceProps {
  messages: SanityAnnouncementBar["messages"]
  textClassName: string
  visualEditingEnabled: boolean
  duplicate?: boolean
}

function AnnouncementSequence({
  messages,
  textClassName,
  visualEditingEnabled,
  duplicate = false,
}: AnnouncementSequenceProps) {
  return (
    <div
      className="flex min-w-[100vw] shrink-0 items-center justify-around"
      aria-hidden={duplicate || undefined}
    >
      {messages?.map((message, index) => {
        const editTarget =
          !duplicate && message._key
            ? createSanityDataAttribute(visualEditingEnabled, {
                documentId: "marketing",
                documentType: "marketing",
                path: keyedSanityPath(
                  "announcementBar.messages",
                  message._key
                ),
              })
            : undefined
        const messageClassName = `${textClassName} block shrink-0 px-5 text-xs font-medium md:px-7 md:text-sm`

        return (
          <div
            key={
              message._key ??
              `${duplicate ? "duplicate" : "message"}-${index}`
            }
            className="flex shrink-0 items-center"
          >
            {message.link ? (
              <Link
                href={cleanSanityString(message.link)}
                data-sanity={editTarget}
                tabIndex={duplicate ? -1 : undefined}
                className={`${messageClassName} hover:underline`}
              >
                {message.text}
              </Link>
            ) : (
              <span data-sanity={editTarget} className={messageClassName}>
                {message.text}
              </span>
            )}
            <span
              aria-hidden="true"
              className={`mx-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70 ${textClassName}`}
            />
          </div>
        )
      })}
    </div>
  )
}

export default function AnnouncementBar({ data }: AnnouncementBarProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const barRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  const active = useMemo(() => {
    if (!data?.isActive || !data.messages) return []

    return data.messages.filter(
      (message) =>
        message.isActive &&
        cleanSanityString(message.text).trim().length > 0
    )
  }, [data])

  const configuredSpeed = data?.rotationSpeed
  const secondsPerMessage =
    typeof configuredSpeed === "number" &&
    Number.isFinite(configuredSpeed) &&
    configuredSpeed > 0
      ? configuredSpeed
      : 4
  const marqueeDuration = Math.max(active.length * secondsPerMessage, 12)
  const bgKey = cleanSanityString(data?.backgroundColor ?? "orange")

  const styles = useMemo(
    () =>
      ({
        orange: {
          bg: "bg-[#F16D34]",
          closeBg: "bg-[#F16D34]",
          text: "text-white",
          muted: "text-white/70",
        },
        black: {
          bg: "bg-[#111111]",
          closeBg: "bg-[#111111]",
          text: "text-white",
          muted: "text-white/70",
        },
        white: {
          bg: "bg-white border-b border-gray-200",
          closeBg: "bg-white",
          text: "text-gray-900",
          muted: "text-gray-500",
        },
      })[bgKey] ?? {
        bg: "bg-[#F16D34]",
        closeBg: "bg-[#F16D34]",
        text: "text-white",
        muted: "text-white/70",
      },
    [bgKey]
  )

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem("sg_bar_dismissed") === "1") {
        setDismissed(true)
      }
    } catch {}
  }, [])

  useGSAP(
    () => {
      if (!mounted || dismissed || !trackRef.current || active.length === 0) {
        return
      }

      const media = gsap.matchMedia()

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(trackRef.current, { xPercent: 0 })
        const timeline = gsap.timeline({ paused: true })
        timelineRef.current = timeline

        return () => {
          timeline.kill()
          timelineRef.current = null
        }
      })

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(trackRef.current, { xPercent: 0 })
        const timeline = gsap.timeline({
          repeat: -1,
          ease: "none",
          defaults: { ease: "none" },
        })

        timeline.to(trackRef.current, {
          xPercent: -50,
          duration: marqueeDuration,
          ease: "none",
        })

        timelineRef.current = timeline

        return () => {
          timeline.kill()
          timelineRef.current = null
        }
      })

      return () => media.revert()
    },
    {
      scope: barRef,
      dependencies: [active.length, dismissed, marqueeDuration, mounted],
      revertOnUpdate: true,
    }
  )

  const slowTimeline = () => {
    if (!timelineRef.current) return

    gsap.to(timelineRef.current, {
      timeScale: 0.25,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  const restoreTimeline = () => {
    if (!timelineRef.current) return

    gsap.to(timelineRef.current, {
      timeScale: 1,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  const dismiss = useCallback(() => {
    setDismissed(true)
    try {
      sessionStorage.setItem("sg_bar_dismissed", "1")
    } catch {}
  }, [])

  if (!data?.isActive || active.length === 0 || !mounted || dismissed) {
    return null
  }

  return (
    <div
      ref={barRef}
      data-sanity={createSanityDataAttribute(visualEditingEnabled, {
        documentId: "marketing",
        documentType: "marketing",
        path: "announcementBar",
      })}
      className={`relative w-full overflow-hidden ${styles.bg}`}
      role="region"
      aria-label="Announcements"
      onMouseEnter={slowTimeline}
      onMouseLeave={restoreTimeline}
      onFocusCapture={slowTimeline}
      onBlurCapture={restoreTimeline}
    >
      <div
        ref={trackRef}
        className="flex min-h-[36px] w-max items-center whitespace-nowrap py-1.5 will-change-transform md:py-2"
      >
        <AnnouncementSequence
          messages={active}
          textClassName={styles.text}
          visualEditingEnabled={visualEditingEnabled}
        />
        <AnnouncementSequence
          messages={active}
          textClassName={styles.text}
          visualEditingEnabled={visualEditingEnabled}
          duplicate
        />
      </div>

      <button
        type="button"
        onClick={dismiss}
        className={`absolute right-0 top-1/2 z-10 flex h-full min-h-[44px] w-12 min-w-[44px] -translate-y-1/2 items-center justify-center ${styles.closeBg} ${styles.muted} transition-opacity hover:opacity-100`}
        aria-label="Dismiss announcements"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
