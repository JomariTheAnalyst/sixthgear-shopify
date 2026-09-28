"use client"

import { useEffect, useId, useRef, useState } from "react"
import { MessageCircle, X } from "lucide-react"

import { CONSENT_REGISTRY } from "@lib/consent/registry"
import { useConsent } from "./consent-provider"

const tidio = CONSENT_REGISTRY.find((entry) => entry.id === "tidio")

type TidioWindow = Window & { tidioChatApi?: { open: () => void } }

// Opens the chat as soon as Tidio's API is ready. The listener lives on the
// document, so it still fires after this launcher unmounts.
function openChatWhenReady() {
  const tidioWindow = window as TidioWindow
  if (tidioWindow.tidioChatApi) {
    tidioWindow.tidioChatApi.open()
    return
  }

  document.addEventListener(
    "tidioChat-ready",
    () => (window as TidioWindow).tidioChatApi?.open(),
    { once: true }
  )
}

/**
 * Stand-in for the Tidio bubble while Functional consent is off. Asks for
 * consent, then loads Tidio (via ConsentScripts) and opens the chat.
 */
export default function ChatLauncher() {
  const { status, hasConsent, grant } = useConsent()
  const [asking, setAsking] = useState(false)
  const allowRef = useRef<HTMLButtonElement>(null)
  const promptId = useId()

  useEffect(() => {
    if (asking) allowRef.current?.focus()
  }, [asking])

  if (!tidio?.script || status === "loading" || hasConsent("functional")) {
    return null
  }

  const allowAndOpen = () => {
    openChatWhenReady()
    grant("functional")
  }

  return (
    <div className="sg-chat-launcher fixed right-4 z-[65] flex flex-col items-end gap-2">
      {asking && (
        <div
          id={promptId}
          role="dialog"
          aria-label="Start chat"
          onKeyDown={(event) => {
            if (event.key === "Escape") setAsking(false)
          }}
          className="w-[min(20rem,calc(100vw-2rem))] border border-black/10 bg-white p-4 text-[#0A0B0A] shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold">Chat with us</p>
            <button
              type="button"
              onClick={() => setAsking(false)}
              aria-label="Close"
              className="-mr-1 -mt-1 inline-flex h-8 w-8 items-center justify-center hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-black/70">
            Our chat is run by Tidio. Opening it lets Tidio store a visitor ID
            on your device and see the pages you visit.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              ref={allowRef}
              type="button"
              onClick={allowAndOpen}
              className="inline-flex min-h-10 items-center justify-center bg-[#0A0B0A] px-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-white hover:bg-[#0A0B0A]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A] focus-visible:ring-offset-2"
            >
              Allow and chat
            </button>
            <button
              type="button"
              onClick={() => setAsking(false)}
              className="inline-flex min-h-10 items-center justify-center border border-[#0A0B0A] px-3 text-[12px] font-semibold uppercase tracking-[0.06em] hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A] focus-visible:ring-offset-2"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAsking((open) => !open)}
        aria-expanded={asking}
        aria-controls={asking ? promptId : undefined}
        data-testid="chat-launcher"
        aria-label="Chat with us"
        className="inline-flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-[#0A0B0A] text-[13px] font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#0A0B0A]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A] focus-visible:ring-offset-2 sm:h-12 sm:w-auto sm:px-5"
      >
        <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5" strokeWidth={2} aria-hidden="true" />
        {/* Phones get a round icon button, the size of Tidio's own bubble. */}
        <span className="hidden sm:inline">Chat with us</span>
      </button>
    </div>
  )
}
