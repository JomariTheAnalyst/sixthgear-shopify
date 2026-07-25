"use client"

/**
 * Franchise Section
 *
 * Mobile  (< lg): clean stacked card — image row + text, no absolute overlap
 * Desktop (≥ lg): immersive absolute-column layout with hover animations
 *
 * Z-index discipline (desktop only):
 *   z-0  → gear SVG (decorative)
 *   z-10 → photos (outer columns)
 *   z-20 → floating badges
 *   z-30 → central text + CTA (always on top)
 */

import { useState } from "react"
import Image from "next/image"
import { interDisplay, lato } from "@lib/fonts"
import { cleanSanityString } from "@lib/cms/visual-editing"

// ── Gear decorative SVG ──────────────────────────────────────────────────────
const GearShape = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
    <path
      fill="#F16D34"
      fillOpacity="0.2"
      d="M100,10 L115,10 L120,30 L130,25 L140,40 L155,35 L160,55 L175,55 L175,70 L190,80 L180,95 L190,110 L175,120 L175,135 L160,140 L155,160 L140,155 L130,170 L120,165 L115,185 L100,185 L85,185 L80,165 L70,170 L60,155 L45,160 L40,140 L25,135 L25,120 L10,110 L20,95 L10,80 L25,70 L25,55 L40,55 L45,35 L60,40 L70,25 L80,30 L85,10 Z"
    />
    <circle cx="100" cy="100" r="50" fill="#F5F0E8" />
  </svg>
)

// ── Props ────────────────────────────────────────────────────────────────────
interface FranchiseSectionProps {
  mainTitle?: string | null
  subtitle?: string | null
  badge1Text?: string | null
  badge2Text?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  leftImageUrl?: string | null
  rightImageUrl?: string | null
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Franchise({
  mainTitle,
  subtitle,
  badge1Text,
  badge2Text,
  ctaLabel,
  ctaLink,
  leftImageUrl,
  rightImageUrl,
}: FranchiseSectionProps) {
  const [isHovered, setIsHovered] = useState(false)

  const activeTitle    = mainTitle    || "Become A Franchise Partner"
  const activeSubtitle = subtitle     || "Become a franchise partner and offer your customers premium motorcycle gear, services, and great coffee at the highest level."
  const activeBadge1   = badge1Text   || "Do you dream of opening your own moto shop & café?"
  const activeBadge2   = badge2Text   || "With Sixthgear, you have the opportunity to become part of an innovative brand."
  const activeCtaLabel = ctaLabel     || "Contact us"
  const activeCtaLink  = cleanSanityString(ctaLink || "/contact")
  const activeLeftImg  = cleanSanityString(leftImageUrl || "/images/franchise/sixthgear-outside.jpg")
  const activeRightImg = cleanSanityString(rightImageUrl || "/images/franchise/sixthgear-inside.jpg")

  return (
    <section className="relative bg-white overflow-hidden">

      {/* ══════════════════════════════════════════════════
          MOBILE / TABLET layout  (hidden on lg+)
          Clean stacked card — no absolute overlaps
      ══════════════════════════════════════════════════ */}
      <div className="lg:hidden">

        {/* Two images side-by-side at the top */}
        <div className="flex gap-3 px-4 pt-10 pb-6">
          <div className="flex-1 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <Image
              src={activeLeftImg}
              alt="Sixthgear Store Outside"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 40vw"
            />
          </div>
          <div className="flex-1 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <Image
              src={activeRightImg}
              alt="Sixthgear Store Inside"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 40vw"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="px-5 pb-4 text-center">
          <h2
            className={`${lato.className} text-5xl sm:text-6xl uppercase leading-[0.88] tracking-[0.045em]`}
            style={{
              color: "transparent",
              WebkitTextStroke: "2px #3D2314",
            }}
          >
            {activeTitle}
          </h2>
          <p
            className={`${interDisplay.className} text-[#3D2314]/70 text-sm sm:text-base mt-5 leading-relaxed max-w-sm mx-auto`}
          >
            {activeSubtitle}
          </p>

          {/* CTA */}
          <a
            href={activeCtaLink}
            className={`${interDisplay.className} mt-7 inline-flex items-center gap-2 px-7 py-4 bg-[#F16D34] text-white text-sm font-semibold uppercase tracking-wider rounded-full transition-colors duration-300 hover:bg-[#3D2314]`}
          >
            {activeCtaLabel}
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Badges — shown as horizontal chips at the bottom */}
        <div className="flex flex-col sm:flex-row gap-3 px-5 pb-10 pt-2">
          <div className="bg-[#F16D34] text-white px-4 py-2 rounded-lg shadow-md flex-1">
            <p
              className={`${interDisplay.className} text-[11px] font-bold uppercase tracking-wide leading-snug text-center`}
            >
              {activeBadge1}
            </p>
          </div>
          <div className="bg-[#FFD700] text-[#3D2314] px-4 py-2 rounded-lg shadow-md flex-1">
            <p
              className={`${interDisplay.className} text-[11px] font-bold uppercase tracking-wide leading-snug text-center`}
            >
              {activeBadge2}
            </p>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          DESKTOP layout  (hidden below lg)
          Absolute-column layout with hover animations
      ══════════════════════════════════════════════════ */}
      <div
        className="hidden lg:block relative"
        style={{ minHeight: "720px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* z-0 — Gear SVG (decorative, behind everything) */}
        <div
          className={`
            pointer-events-none
            absolute inset-0 flex items-center justify-center z-0
            transition-all duration-700 ease-out
            ${isHovered ? "opacity-100 scale-100 rotate-[15deg]" : "opacity-0 scale-75 rotate-0"}
          `}
        >
          <div className="w-[480px] xl:w-[580px] aspect-square">
            <GearShape />
          </div>
        </div>

        {/* z-10 — Left image, vertically centred in outer-left column */}
        <div
          className={`
            absolute z-10
            top-1/2 -translate-y-1/2
            left-10 xl:left-16
            w-[240px] xl:w-[290px]
            transition-all duration-700 ease-out
            ${isHovered
              ? "opacity-100 translate-x-0 rotate-[-8deg]"
              : "opacity-0 -translate-x-10 rotate-[-8deg]"}
          `}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src={activeLeftImg}
              alt="Sixthgear Store Outside"
              fill
              className="object-cover"
              sizes="290px"
            />
          </div>
        </div>

        {/* z-10 — Right image, vertically centred in outer-right column */}
        <div
          className={`
            absolute z-10
            top-1/2 -translate-y-1/2
            right-10 xl:right-16
            w-[240px] xl:w-[290px]
            transition-all duration-700 ease-out
            ${isHovered
              ? "opacity-100 translate-x-0 rotate-[6deg]"
              : "opacity-0 translate-x-10 rotate-[6deg]"}
          `}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src={activeRightImg}
              alt="Sixthgear Store Inside"
              fill
              className="object-cover"
              sizes="290px"
            />
          </div>
        </div>

        {/* z-20 — Orange badge, top-left safe zone */}
        <div
          className={`
            absolute z-20 top-10 left-[18%] xl:left-[20%]
            max-w-[230px] xl:max-w-[260px]
            transition-all duration-500 ease-out
            ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
          `}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="bg-[#F16D34] text-white px-4 py-2 xl:px-5 xl:py-3 rounded-sm rotate-[-4deg] shadow-lg">
            <p
              className={`${interDisplay.className} text-xs xl:text-sm font-bold uppercase tracking-wide leading-snug`}
            >
              {activeBadge1}
            </p>
          </div>
        </div>

        {/* z-20 — Yellow badge, bottom-right safe zone */}
        <div
          className={`
            absolute z-20 bottom-10 right-[18%] xl:right-[20%]
            max-w-[230px] xl:max-w-[260px]
            transition-all duration-500 ease-out
            ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="bg-[#FFD700] text-[#3D2314] px-4 py-2 xl:px-5 xl:py-3 rounded-sm rotate-[3deg] shadow-lg">
            <p
              className={`${interDisplay.className} text-xs xl:text-sm font-bold uppercase tracking-wide leading-snug`}
            >
              {activeBadge2}
            </p>
          </div>
        </div>

        {/* z-30 — Central content, always on top */}
        <div
          className="
            relative z-30
            flex items-center justify-center
            min-h-[720px] py-24
            px-[300px] xl:px-[330px]
          "
        >
          <div className="w-full text-center">

            {/* Title — dual-layer fill animation */}
            <div className="relative inline-block">
              <h2
                className={`${lato.className} text-7xl xl:text-8xl 2xl:text-9xl uppercase leading-[0.88] tracking-[0.045em]`}
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px #3D2314",
                }}
              >
                {activeTitle}
              </h2>
              <h2
                className={`${lato.className} absolute inset-0 text-7xl xl:text-8xl 2xl:text-9xl uppercase leading-[0.88] tracking-[0.045em] overflow-hidden`}
                style={{
                  color: "#F16D34",
                  clipPath: isHovered ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                  transition: "clip-path 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
                }}
              >
                {activeTitle}
              </h2>
            </div>

            {/* Subtitle */}
            <p
              className={`
                ${interDisplay.className} text-[#3D2314]/70 text-base xl:text-lg mt-8 leading-relaxed mx-auto max-w-sm
                transition-opacity duration-500 ease-out
                ${isHovered ? "opacity-100" : "opacity-70"}
              `}
            >
              {activeSubtitle}
            </p>

            {/* CTA button */}
            <div
              className={`
                mt-10 transition-all duration-500 ease-out
                ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              style={{ transitionDelay: "500ms" }}
            >
              <a
                href={activeCtaLink}
                className={`${interDisplay.className} inline-flex items-center gap-3 px-8 py-4 bg-[#F16D34] text-white text-sm xl:text-base font-semibold uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-[#3D2314] hover:scale-105`}
              >
                {activeCtaLabel}
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

          </div>
        </div>

      </div>

    </section>
  )
}
