"use client"

import {
  type AnchorHTMLAttributes,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type TouchEvent,
  useEffect,
} from "react"

import {
  CAL_DIRECT_URL,
  initializePopupCal,
  openCalPopup,
  scheduleIdleCalInit,
} from "@modules/booking/lib/cal-embed"

const warmCal = () => {
  initializePopupCal().catch(() => undefined)
}

type CalBookingTriggerProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  beforeOpen?: () => void
  children: ReactNode
}

export default function CalBookingTrigger({
  beforeOpen,
  children,
  onClick,
  onFocus,
  onPointerEnter,
  onTouchStart,
  ...props
}: CalBookingTriggerProps) {
  // Load the embed after page load when idle, or earlier on first intent.
  useEffect(() => {
    scheduleIdleCalInit()
  }, [])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    event.stopPropagation()
    beforeOpen?.()
    onClick?.(event)

    const openPopup = () => {
      openCalPopup().catch(() => undefined)
    }

    if (beforeOpen) {
      window.requestAnimationFrame(openPopup)
      return
    }

    openPopup()
  }

  return (
    <a
      {...props}
      href={CAL_DIRECT_URL}
      aria-haspopup="dialog"
      onClick={handleClick}
      onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
        warmCal()
        onPointerEnter?.(event)
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        warmCal()
        onFocus?.(event)
      }}
      onTouchStart={(event: TouchEvent<HTMLAnchorElement>) => {
        warmCal()
        onTouchStart?.(event)
      }}
    >
      {children}
    </a>
  )
}
