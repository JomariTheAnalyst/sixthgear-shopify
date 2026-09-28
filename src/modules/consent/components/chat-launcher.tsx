"use client"

import { useCallback, useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"

const TIDIO_KEY = process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY
const TIDIO_SCRIPT_ID = "tidio-chat-script"
const TIDIO_STATE_PREFIX = "tidio_state_"

type TidioWindow = Window & { tidioChatApi?: { open: () => void } }

// Injects Tidio's script once per page; resolves when its chat API is ready.
function loadTidio(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as TidioWindow).tidioChatApi) {
      resolve()
      return
    }

    document.addEventListener("tidioChat-ready", () => resolve(), { once: true })

    const existing = document.getElementById(TIDIO_SCRIPT_ID)
    if (existing) {
      existing.addEventListener("error", () => reject(), { once: true })
      return
    }

    const script = document.createElement("script")
    script.id = TIDIO_SCRIPT_ID
    script.src = `https://code.tidio.co/${TIDIO_KEY}.js`
    script.async = true
    // Blocked or offline: let the visitor try again.
    script.onerror = () => {
      script.remove()
      reject(new Error("Tidio failed to load"))
    }
    document.body.appendChild(script)
  })
}

function hasUsedChatBefore() {
  try {
    return Object.keys(window.localStorage).some((key) =>
      key.startsWith(TIDIO_STATE_PREFIX)
    )
  } catch {
    return false
  }
}

/**
 * Stand-in for Tidio's bubble: Tidio loads only when the visitor opens the
 * chat (that tap is the request), or on page load for visitors who have
 * chatted before, so their conversation continues. Once Tidio is ready its
 * own bubble takes over in the same spot.
 */
export default function ChatLauncher() {
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle")

  const start = useCallback((openChat: boolean) => {
    setState("loading")
    loadTidio()
      .then(() => {
        setState("ready")
        if (openChat) (window as TidioWindow).tidioChatApi?.open()
      })
      .catch(() => setState("idle"))
  }, [])

  useEffect(() => {
    if (TIDIO_KEY && hasUsedChatBefore()) start(false)
  }, [start])

  if (!TIDIO_KEY || state === "ready") return null

  const isLoading = state === "loading"

  return (
    <button
      type="button"
      onClick={() => {
        if (!isLoading) start(true)
      }}
      aria-label={isLoading ? "Opening chat" : "Chat with us"}
      aria-busy={isLoading || undefined}
      data-testid="chat-launcher"
      className="sg-chat-launcher fixed right-5 z-[65] inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#0A0B0A] text-white shadow-[0_6px_24px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A] focus-visible:ring-offset-2"
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-6 w-6 animate-spin rounded-full border-[3px] border-white border-r-transparent"
        />
      ) : (
        <MessageCircle className="h-7 w-7" strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  )
}
