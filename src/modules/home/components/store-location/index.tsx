"use client"

/**
 * Store Location Section
 * Interactive Google Maps embed with built-in marker
 * Allows zoom/pan with marker staying at coordinates
 */

import { useEffect, useRef, useState } from "react"
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
  const mapRef = useRef<HTMLDivElement>(null)
  // The Google embed pulls in the Maps JS API from inside its iframe, so the
  // iframe is only mounted once the map is within about one screen.
  const [isMapNear, setIsMapNear] = useState(false)
  const activeName = storeName || storeInfo.name
  const activeAddress = address || storeInfo.address
  const activePhone = phone || storeInfo.phone
  const activeHours = hours || storeInfo.hours
  const activeGoogleMapsUrl = cleanSanityString(googleMapsUrl || storeInfo.googleMapsUrl)

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsMapNear(true)
        observer.disconnect()
      },
      { rootMargin: "100% 0px" }
    )
    observer.observe(map)
    return () => observer.disconnect()
  }, [])

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

      <div
        ref={mapRef}
        className="relative overflow-hidden border-y border-black/10 shadow-2xl min-h-[520px] md:min-h-[620px] lg:min-h-[720px] bg-[#e8efe6]"
      >
        {isMapNear && (
          <iframe
            src={storeMapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "520px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Sixthgear Store Location"
            className="absolute inset-0 h-full w-full"
          />
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
