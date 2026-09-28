"use client"

import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useState,
} from "react"

import { CAL_DIRECT_URL, openCalPopup } from "@modules/booking/lib/cal-embed"

type CalBookingTriggerProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  beforeOpen?: () => void
  children: ReactNode
}

/**
 * cal.com's embed.js loads on the first click, not on page load, so no
 * booking script runs for visitors who never book.
 */
export default function CalBookingTrigger({
  beforeOpen,
  children,
  onClick,
  ...props
}: CalBookingTriggerProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    event.stopPropagation()
    beforeOpen?.()
    onClick?.(event)

    const openPopup = () => {
      setIsLoading(true)
      openCalPopup()
        .catch(() => undefined)
        .finally(() => setIsLoading(false))
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
      aria-busy={isLoading || undefined}
      data-loading={isLoading || undefined}
      onClick={handleClick}
      className={`${props.className ?? ""} ${
        isLoading ? "cursor-progress opacity-70" : ""
      }`}
    >
      {children}
      {isLoading && (
        <span
          aria-hidden="true"
          className="ml-2 inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent align-[-2px]"
        />
      )}
      {isLoading && <span className="sr-only"> Loading booking…</span>}
    </a>
  )
}
