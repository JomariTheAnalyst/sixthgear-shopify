"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import type { SanityPopupAd } from "@lib/cms/types"
import { interDisplay, lato } from "@lib/fonts"

interface PopupAdProps {
  data: SanityPopupAd | null
}

export default function PopupAd({ data }: PopupAdProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const KEY = `sg_popup_${data?._id}`

  const isWithinRange = useCallback(() => {
    if (!data) return false
    const now = new Date()
    if (data.startDate && now < new Date(data.startDate)) return false
    if (data.endDate && now > new Date(data.endDate)) return false
    return true
  }, [data])

  useEffect(() => {
    setIsMounted(true)
    if (!data || !data.enabled || !data.imageUrl) return
    if (!isWithinRange()) return

    try {
      const val = sessionStorage.getItem(KEY)
      if (val) return
    } catch (e) {}

    const delay = (data.delay ?? 5) * 1000
    const t = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(t)
  }, [data, KEY, isWithinRange])

  const dismiss = useCallback(() => {
    setIsVisible(false)
    try {
      sessionStorage.setItem(KEY, "1")
    } catch (e) {}
  }, [KEY])

  // All hooks above — guards below
  if (!data || !data.enabled || !data.imageUrl) return null
  if (!isMounted) return null
  if (!isVisible) return null

  const ImageWrapper = data.imageLink ? Link : "div"
  const imageWrapperProps = data.imageLink
    ? { href: data.imageLink, onClick: dismiss }
    : {}
  const imageWidth = data.imageDimensions?.width || 1200
  const imageHeight = data.imageDimensions?.height || 1500

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-end justify-center md:items-center p-4 md:p-6"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-[560px] overflow-hidden rounded-t-2xl bg-white md:max-w-[640px] md:rounded-2xl md:shadow-2xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-20 w-10 h-10 min-w-[44px] min-h-[44px] bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close popup"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Heading */}
        {data.heading && (
          <div className="px-4 pt-4 pb-2 md:px-5 md:pt-5 md:pb-3">
            <p className={`${lato.className} text-gray-900 font-black text-lg md:text-xl leading-tight`}>
              {data.heading}
            </p>
          </div>
        )}

        {/* Image */}
        <ImageWrapper
          {...(imageWrapperProps as any)}
          className={
            data.imageLink
              ? "flex cursor-pointer justify-center bg-white"
              : "flex justify-center bg-white"
          }
        >
          <Image
            src={data.imageUrl}
            alt={data.heading || "Promotional offer"}
            width={imageWidth}
            height={imageHeight}
            className="block h-auto max-h-[72vh] w-auto max-w-full object-contain"
            sizes="(max-width: 768px) 92vw, 640px"
          />
        </ImageWrapper>

        {/* Button */}
        {data.buttonLabel && (
          <div className="px-0">
            <Link
              href={data.buttonLink || data.imageLink || "#"}
              onClick={dismiss}
              className={`${interDisplay.className} w-full block bg-white text-gray-900 font-bold text-sm uppercase tracking-widest py-4 px-6 text-center border-t border-gray-200 hover:bg-gray-50 transition-colors`}
            >
              {data.buttonLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
