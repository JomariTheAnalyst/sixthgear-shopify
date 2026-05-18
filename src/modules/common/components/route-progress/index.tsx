"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const START_EVENT = "sixthgear:route-progress:start"
const DONE_EVENT = "sixthgear:route-progress:done"

export function startRouteProgress() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(START_EVENT))
}

export function completeRouteProgress() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(DONE_EVENT))
}

function shouldTrackClick(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  ) {
    return false
  }

  const anchor = (event.target as Element | null)?.closest?.("a")
  if (!anchor) return false

  const href = anchor.getAttribute("href")
  const target = anchor.getAttribute("target")

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    anchor.hasAttribute("download") ||
    (target && target !== "_self")
  ) {
    return false
  }

  const nextUrl = new URL(href, window.location.href)
  const currentUrl = new URL(window.location.href)

  if (nextUrl.origin !== currentUrl.origin) return false

  return (
    nextUrl.pathname !== currentUrl.pathname ||
    nextUrl.search !== currentUrl.search
  )
}

export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const activeRef = useRef(false)
  const trickleTimerRef = useRef<number | null>(null)
  const failsafeTimerRef = useRef<number | null>(null)
  const hideTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const clearTimers = () => {
      if (trickleTimerRef.current) {
        window.clearInterval(trickleTimerRef.current)
        trickleTimerRef.current = null
      }

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }

      if (failsafeTimerRef.current) {
        window.clearTimeout(failsafeTimerRef.current)
        failsafeTimerRef.current = null
      }
    }

    const start = () => {
      clearTimers()
      activeRef.current = true
      setIsVisible(true)
      setProgress(8)

      trickleTimerRef.current = window.setInterval(() => {
        setProgress((current) => {
          if (current >= 88) return current
          return current + Math.max(2, (88 - current) * 0.08)
        })
      }, 180)

      failsafeTimerRef.current = window.setTimeout(() => {
        done()
      }, 8000)
    }

    const done = () => {
      if (!activeRef.current) return

      activeRef.current = false

      if (trickleTimerRef.current) {
        window.clearInterval(trickleTimerRef.current)
        trickleTimerRef.current = null
      }

      if (failsafeTimerRef.current) {
        window.clearTimeout(failsafeTimerRef.current)
        failsafeTimerRef.current = null
      }

      setProgress(100)
      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 220)
    }

    const handleClick = (event: MouseEvent) => {
      if (shouldTrackClick(event)) {
        start()
      }
    }

    window.addEventListener(START_EVENT, start)
    window.addEventListener(DONE_EVENT, done)
    document.addEventListener("click", handleClick, true)

    return () => {
      clearTimers()
      window.removeEventListener(START_EVENT, start)
      window.removeEventListener(DONE_EVENT, done)
      document.removeEventListener("click", handleClick, true)
    }
  }, [])

  useEffect(() => {
    completeRouteProgress()
  }, [pathname, searchParams])

  return (
    <div
      aria-hidden="true"
      className={`fixed left-0 top-0 z-[9999] h-[3px] w-full transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-[#F16D34] shadow-[0_0_12px_rgba(241,109,52,0.45)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
