"use client"

import { businessInfo } from "@lib/business"
import { useConsent } from "@modules/consent"
import CuratorEmbed from "./curator-embed"

/**
 * The Curator feed loads code from Meta (Facebook), so it waits for
 * Marketing consent. Until then a same-height placeholder offers to load it.
 */
export default function ConsentedCuratorEmbed() {
  const { status, gpc, hasConsent, grant } = useConsent()

  if (hasConsent("marketing")) {
    return <CuratorEmbed />
  }

  const instagramUrl = businessInfo.socialProfiles[1]

  return (
    <div
      data-testid="social-feed-placeholder"
      className="mx-4 flex min-h-[240px] flex-col items-center justify-center gap-4 border border-dashed border-black/20 bg-black/[0.02] px-6 py-10 text-center sm:mx-6"
    >
      {status !== "loading" && (
        <>
          <p className="max-w-md text-sm leading-relaxed text-black/70">
            {gpc
              ? "Your browser sends a Global Privacy Control signal, so we don't load our social media feed, which comes from Meta (Facebook)."
              : "Our social media feed is provided by Curator and loads code from Meta (Facebook), which may set marketing cookies."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!gpc && (
              <button
                type="button"
                onClick={() => grant("marketing")}
                className="inline-flex min-h-11 items-center justify-center bg-[#111111] px-6 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#111111]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              >
                Show our social feed
              </button>
            )}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold underline underline-offset-2"
              >
                See us on Instagram
              </a>
            )}
          </div>
        </>
      )}
    </div>
  )
}
