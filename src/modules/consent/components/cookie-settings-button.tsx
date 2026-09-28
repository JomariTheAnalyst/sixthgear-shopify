"use client"

import type { ButtonHTMLAttributes } from "react"

import { useConsent } from "./consent-provider"

/** Reopens the Cookie settings panel (footer link, /cookies page). */
export default function CookieSettingsButton({
  children = "Cookie settings",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openSettings } = useConsent()

  return (
    <button type="button" aria-haspopup="dialog" onClick={openSettings} {...props}>
      {children}
    </button>
  )
}
