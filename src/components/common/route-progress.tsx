"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

const COMPLETE_DELAY_MS = 220
const FAILSAFE_DELAY_MS = 12000

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function isInternalNavigation(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href")
  if (!href || href.startsWith("#")) {
    return false
  }

  if (
    anchor.target === "_blank" ||
    anchor.hasAttribute("download") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false
  }

  const destination = new URL(anchor.href, window.location.href)
  const current = new URL(window.location.href)

  if (destination.origin !== current.origin) {
    return false
  }

  return destination.pathname !== current.pathname || destination.search !== current.search
}

export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [state, setState] = useState<"idle" | "loading" | "complete">("idle")
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const failsafeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const routeKey = useMemo(
    () => `${pathname}?${searchParams.toString()}`,
    [pathname, searchParams]
  )

  useEffect(() => {
    const clearTimers = () => {
      if (completeTimeoutRef.current) {
        clearTimeout(completeTimeoutRef.current)
        completeTimeoutRef.current = null
      }
      if (failsafeTimeoutRef.current) {
        clearTimeout(failsafeTimeoutRef.current)
        failsafeTimeoutRef.current = null
      }
    }

    const startProgress = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      const anchor = target.closest("a")
      if (!anchor || !isInternalNavigation(anchor)) {
        return
      }

      clearTimers()
      setState("loading")
      failsafeTimeoutRef.current = setTimeout(() => {
        setState("complete")
        completeTimeoutRef.current = setTimeout(() => {
          setState("idle")
        }, COMPLETE_DELAY_MS)
      }, FAILSAFE_DELAY_MS)
    }

    document.addEventListener("click", startProgress, true)

    return () => {
      document.removeEventListener("click", startProgress, true)
      clearTimers()
    }
  }, [])

  useEffect(() => {
    if (state !== "loading") {
      return
    }

    if (failsafeTimeoutRef.current) {
      clearTimeout(failsafeTimeoutRef.current)
      failsafeTimeoutRef.current = null
    }

    setState("complete")
    completeTimeoutRef.current = setTimeout(() => {
      setState("idle")
      completeTimeoutRef.current = null
    }, COMPLETE_DELAY_MS)
  }, [routeKey])

  return (
    <div
      aria-hidden="true"
      className={`fixed left-0 top-0 z-[9999] h-0.5 bg-[#F16D34] shadow-[0_0_12px_rgba(241,109,52,0.45)] transition-all ${
        state === "idle"
          ? "w-0 opacity-0 duration-0"
          : state === "loading"
            ? "w-[78%] opacity-100 duration-[9000ms] ease-out"
            : "w-full opacity-0 duration-200 ease-out"
      }`}
    />
  )
}
