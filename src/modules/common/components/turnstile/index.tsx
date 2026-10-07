"use client"

import Script from "next/script"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"
import { clientEnv } from "@lib/env"

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: Record<string, unknown>
  ) => string | undefined
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
  getResponse: (widgetId: string) => string | undefined
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

export type TurnstileHandle = {
  /** Current token, or undefined while the challenge is not solved yet. */
  getToken: () => string | undefined
  /** Fetch a fresh token. Tokens are single use, so call after each submit. */
  reset: () => void
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

/**
 * Cloudflare Turnstile widget. The script loads only when a form renders this
 * component. Inside a <form> it adds the hidden cf-turnstile-response input.
 * Managed mode is set on the site key in the Cloudflare dashboard.
 */
const Turnstile = forwardRef<TurnstileHandle, { className?: string }>(
  function Turnstile({ className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | undefined>(undefined)

    const renderWidget = useCallback(() => {
      const container = containerRef.current
      if (!window.turnstile || !container || widgetIdRef.current) return

      const sitekey = clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      if (!sitekey) {
        console.error("[turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set")
        return
      }

      widgetIdRef.current = window.turnstile.render(container, {
        sitekey,
        theme: "light",
        // Flexible needs 300px; fall back to compact on narrow phones.
        size: container.clientWidth >= 300 ? "flexible" : "compact",
      })
    }, [])

    useEffect(() => {
      // Covers the script already being loaded by an earlier form.
      renderWidget()
      return () => {
        if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current)
        widgetIdRef.current = undefined
      }
    }, [renderWidget])

    useImperativeHandle(
      ref,
      () => ({
        getToken: () =>
          (widgetIdRef.current &&
            window.turnstile?.getResponse(widgetIdRef.current)) ||
          undefined,
        reset: () => {
          if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current)
        },
      }),
      []
    )

    return (
      <>
        <Script src={SCRIPT_SRC} onReady={renderWidget} />
        {/* Reserves the widget's height so the form doesn't jump. */}
        <div ref={containerRef} className={`min-h-[65px] ${className ?? ""}`} />
      </>
    )
  }
)

export default Turnstile
