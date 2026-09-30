"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

import {
  CONSENT_CATEGORIES,
  getVisibleOptionalCategories,
  type OptionalCategoryId,
} from "@lib/consent/registry"
import { useConsent } from "./consent-provider"

export const CONSENT_BUTTON_CLASS =
  "inline-flex min-h-11 w-full items-center justify-center border border-[#0A0B0A] bg-[#0A0B0A] px-3 py-2 text-center text-[12px] font-semibold uppercase leading-tight tracking-[0.06em] text-white transition-colors hover:bg-[#0A0B0A]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0B0A] focus-visible:ring-offset-2 sm:text-[13px]"

// Analytics / marketing categories that currently have registry entries.
const CONSENT_CATEGORIES_IN_USE = getVisibleOptionalCategories()
const CONSENT_PURPOSES = CONSENT_CATEGORIES.filter((category) =>
  CONSENT_CATEGORIES_IN_USE.includes(category.id as OptionalCategoryId)
)
  .map((category) => category.bannerText ?? `${category.label.toLowerCase()} cookies`)
  .join(" and ")

/**
 * Non-blocking bottom bar, shown only while the registry has an analytics or
 * marketing entry and the visitor has not chosen yet. Publishes its height as
 * --sg-consent-offset so page content stays uncovered.
 */
export default function ConsentBanner() {
  const { status, settingsOpen, acceptAll, rejectAll, openSettings } =
    useConsent()
  const params = useParams()
  const countryCode =
    typeof params?.countryCode === "string" ? params.countryCode : "ph"
  const barRef = useRef<HTMLElement>(null)
  const visible =
    CONSENT_CATEGORIES_IN_USE.length > 0 && status === "unset" && !settingsOpen

  useEffect(() => {
    const bar = barRef.current
    const root = document.documentElement
    if (!visible || !bar) return

    const publish = () =>
      root.style.setProperty("--sg-consent-offset", `${bar.offsetHeight}px`)
    publish()

    const observer = new ResizeObserver(publish)
    observer.observe(bar)

    return () => {
      observer.disconnect()
      root.style.removeProperty("--sg-consent-offset")
    }
  }, [visible])

  if (!visible) return null

  return (
    <section
      ref={barRef}
      role="region"
      aria-label="Cookie consent"
      data-testid="consent-banner"
      className="sg-consent-banner fixed inset-x-0 z-[70] border-t border-black/10 bg-white text-[#0A0B0A] shadow-[0_-12px_32px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:gap-8 md:px-8 md:py-5">
        <p className="text-[13px] leading-relaxed text-black/75 md:flex-1 md:text-sm">
          We use necessary cookies to run this site. With your OK, we would
          also use {CONSENT_PURPOSES}. Chat, booking, maps, videos, and our
          social media feed load with the page. See our{" "}
          <Link
            href={`/${countryCode}/cookies`}
            className="font-semibold text-[#0A0B0A] underline underline-offset-2"
          >
            Cookie Policy
          </Link>
          .
        </p>
        <div className="grid grid-cols-3 gap-2 md:w-[30rem] md:shrink-0">
          <button type="button" onClick={acceptAll} className={CONSENT_BUTTON_CLASS}>
            Accept all
          </button>
          <button type="button" onClick={rejectAll} className={CONSENT_BUTTON_CLASS}>
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={openSettings}
            aria-haspopup="dialog"
            className={CONSENT_BUTTON_CLASS}
          >
            Customize
          </button>
        </div>
      </div>
    </section>
  )
}
