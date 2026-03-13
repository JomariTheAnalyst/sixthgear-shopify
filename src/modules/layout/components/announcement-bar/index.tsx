"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import type { SanityAnnouncementBar } from "@lib/cms/types"

interface AnnouncementBarProps {
  data: SanityAnnouncementBar | null
}

export default function AnnouncementBar({ data }: AnnouncementBarProps) {
  const [idx, setIdx] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  const active = useMemo(() => {
    if (!data?.isActive || !data?.messages) return []
    return data.messages.filter((m) => m.isActive)
  }, [data])

  const speed = data?.rotationSpeed ?? 4
  const bgKey = data?.backgroundColor ?? "orange"

  const styles = useMemo(
    () =>
      ({
        orange: {
          bg: "bg-[#F16D34]",
          text: "text-white",
          muted: "text-white/70",
        },
        black: {
          bg: "bg-[#111111]",
          text: "text-white",
          muted: "text-white/70",
        },
        white: {
          bg: "bg-white border-b border-gray-200",
          text: "text-gray-900",
          muted: "text-gray-500",
        },
      })[bgKey] ?? {
        bg: "bg-[#F16D34]",
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
    } catch (e) {}
  }, [])

  useEffect(() => {
    if (active.length <= 1) return
    const t = setInterval(
      () => setIdx((p) => (p + 1) % active.length),
      speed * 1000
    )
    return () => clearInterval(t)
  }, [active.length, speed])

  const dismiss = useCallback(() => {
    setDismissed(true)
    try {
      sessionStorage.setItem("sg_bar_dismissed", "1")
    } catch (e) {}
  }, [])

  // All hooks above — guards below
  if (!data || !data.isActive) return null
  if (active.length === 0) return null
  if (!mounted) return null
  if (dismissed) return null

  const msg = active[idx]

  return (
    <div className={`w-full ${styles.bg} relative z-50`}>
      <div className="max-w-[1440px] mx-auto px-10 md:px-12 py-1.5 md:py-2 flex items-center justify-center min-h-[36px] relative">
        {/* Message */}
        {msg?.link ? (
          <Link
            href={msg.link}
            className={`${styles.text} text-xs md:text-sm font-medium hover:underline truncate block text-center max-w-[calc(100%-4rem)]`}
          >
            {msg.text}
          </Link>
        ) : (
          <span
            className={`${styles.text} text-xs md:text-sm font-medium truncate block text-center max-w-[calc(100%-4rem)]`}
          >
            {msg?.text}
          </span>
        )}

        {/* Dot indicators — desktop only */}
        {active.length > 1 && (
          <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 items-center gap-1.5">
            {active.map((_, i) => (
              <div
                key={i}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-opacity ${
                  i === idx ? "opacity-100" : "opacity-40"
                } ${styles.text.replace("text-", "bg-")}`}
              />
            ))}
          </div>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 min-w-[44px] min-h-[44px] flex items-center justify-center ${styles.muted} hover:opacity-100 transition-opacity`}
          aria-label="Dismiss"
        >
          <svg
            className="w-3.5 h-3.5"
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
    </div>
  )
}
