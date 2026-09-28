"use client"

/**
 * Store Location Section
 * Interactive Google Maps embed with built-in marker
 * Allows zoom/pan with marker staying at coordinates
 */

import { useState } from "react"
import { MapPin } from "lucide-react"
import { inter, montserrat } from "@lib/fonts"
import { storeDirectionsUrl, storeInfo, storeMapEmbedUrl } from "@lib/store-info"
import { cleanSanityString } from "@lib/cms/visual-editing"

interface StoreLocationProps {
  storeName?: string | null
  address?: string | null
  phone?: string | null
  hours?: string | null
  googleMapsUrl?: string | null
}

export default function StoreLocation({
  storeName,
  address,
  phone,
  hours,
  googleMapsUrl,
}: StoreLocationProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const activeName = storeName || storeInfo.name
  const activeAddress = address || storeInfo.address
  const activePhone = phone || storeInfo.phone
  const activeHours = hours || storeInfo.hours
  const activeGoogleMapsUrl = cleanSanityString(googleMapsUrl || storeInfo.googleMapsUrl)

  const handleGetDirections = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      window.open(storeDirectionsUrl, "_blank")
    } else {
      window.open(activeGoogleMapsUrl, "_blank")
    }
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mb-12 md:mb-16 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center">
          <h2
            className={`${montserrat.className} whitespace-nowrap text-center text-[clamp(1.85rem,4.15vw,3.65rem)] font-black leading-[0.9] tracking-[-0.05em] text-[#191b22]`}
          >
            Store Location
          </h2>
          <p
            className={`${inter.className} mx-auto mt-4 max-w-[760px] text-base font-medium leading-[1.35] tracking-[-0.02em] text-black/70 md:text-xl lg:text-2xl`}
          >
            Visit us at our store in Makati City for premium motorcycle gear,
            professional services, and great coffee.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden border-y border-black/10 shadow-2xl min-h-[520px] md:min-h-[620px] lg:min-h-[720px] bg-[#e8efe6]">
        {/* Google Maps loads only when the visitor opens it (sets Google cookies). */}
        {isMapOpen ? (
          <iframe
            src={storeMapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "520px" }}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title="Sixthgear Store Location"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
          {/* Self-hosted illustration; nothing is requested from Google until "Open map". */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/store-location/store-map-static.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            data-testid="map-placeholder"
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-4 pb-8 text-center md:pb-10"
          >
            <p
              className={`${inter.className} max-w-sm bg-[#f7f2e9]/90 px-3 py-1 text-sm leading-relaxed text-[#102229]/80`}
            >
              The interactive map loads from Google when you open it.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className={`${montserrat.className} inline-flex min-h-12 items-center gap-2 bg-[#142224] px-6 text-sm font-semibold uppercase tracking-[0.04em] text-white shadow-[0_18px_36px_rgba(0,0,0,0.16)] transition-colors hover:bg-[#142224]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#142224] focus-visible:ring-offset-2`}
              >
                <MapPin className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
                Open map
              </button>
              <a
                href={activeGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${montserrat.className} inline-flex min-h-12 items-center border border-[#142224]/30 bg-[#f7f2e9]/95 px-6 text-sm font-semibold uppercase tracking-[0.04em] text-[#142224] transition-colors hover:border-[#142224]`}
              >
                View on Google Maps
              </a>
            </div>
          </div>
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-black/5" />

        <div className="pointer-events-none relative z-10 p-4 md:p-6 lg:p-8 h-full flex items-start">
          {isDetailsOpen ? (
            <div className="pointer-events-auto relative w-full max-w-[680px] bg-[#f7f2e9]/95 backdrop-blur-sm border border-black/10 shadow-[0_24px_60px_rgba(0,0,0,0.16)] px-6 py-7 md:px-10 md:py-9 lg:px-12 lg:py-10">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                aria-label="Close store details"
                className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center border border-black/15 bg-white/80 text-[#142224] transition-colors hover:text-[#F16D34] md:right-5 md:top-5"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.25}
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              </button>

              <h3
                className={`${montserrat.className} pr-14 text-[34px] leading-none md:text-[52px] lg:text-[64px] font-black uppercase tracking-[-0.03em] text-[#142224]`}
              >
                {storeInfo.shortName}
              </h3>

              <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.9fr] md:gap-10">
                <div>
                  <p
                    className={`${inter.className} text-[#102229] text-xl md:text-[2rem] leading-[1.35]`}
                  >
                    {activeAddress}
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <p
                      className={`${inter.className} text-[#102229] text-lg md:text-[1.15rem] leading-relaxed`}
                    >
                      <span className="font-semibold">Tel:</span> {activePhone}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${inter.className} text-[#102229] text-lg md:text-[1.15rem] leading-relaxed`}
                    >
                      <span className="font-semibold">Hours:</span> {activeHours}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${inter.className} text-[#102229] text-base md:text-lg leading-relaxed`}
                    >
                      {activeName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-10">
                <button
                  onClick={handleGetDirections}
                  className={`${montserrat.className} inline-flex items-center gap-3 text-[#102229] text-base md:text-lg font-semibold uppercase tracking-[-0.01em] transition-colors hover:text-[#F16D34]`}
                >
                  <svg
                    className="h-5 w-5 md:h-6 md:w-6 text-[#F16D34]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.25}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  View on Google Maps
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className={`${montserrat.className} pointer-events-auto inline-flex items-center gap-3 border border-black/15 bg-[#f7f2e9]/95 px-5 py-4 text-sm md:text-base font-semibold uppercase tracking-[-0.01em] text-[#142224] shadow-[0_18px_36px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-colors hover:text-[#F16D34]`}
            >
              <svg
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.25}
                  d="M12 5v14m7-7H5"
                />
              </svg>
              Show Store Details
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
