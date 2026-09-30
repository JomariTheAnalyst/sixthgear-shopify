"use client"

import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useEffect,
} from "react"

import {
  CAL_DIRECT_URL,
  initializePopupCal,
  openCalPopup,
} from "@modules/booking/lib/cal-embed"

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
  ...props
}: CalBookingTriggerProps) {
  useEffect(() => {
    initializePopupCal().catch(() => undefined)
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
    >
      {children}
    </a>
  )
}
