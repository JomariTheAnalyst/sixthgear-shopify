"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    __sixthgearConsoleGuardInitialized?: boolean
  }
}

const NOOP = () => {}

export function ConsoleGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return
    }

    if (window.__sixthgearConsoleGuardInitialized) {
      return
    }

    window.__sixthgearConsoleGuardInitialized = true

    const originalLog = console.log.bind(console)

    originalLog(
      "%c⚠️ Stop!%c\nThis is a browser tool for developers. If someone told you to paste something here, it could compromise your security. Close this window if you're not a developer.",
      "color: #dc2626; font-size: 28px; font-weight: 800;",
      "color: #6b7280; font-size: 13px; font-weight: 400;"
    )

    console.log = NOOP
    console.warn = NOOP
    console.info = NOOP
    console.debug = NOOP
  }, [])

  return null
}
