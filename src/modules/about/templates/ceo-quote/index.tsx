"use client"

/**
 * About Mission Section
 * CEO Quote with profile
 */

import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface AboutMissionProps {
  quoteText: string
  highlightedPhrase?: string
  ceoName: string
  ceoTitle: string
  ceoPhoto: string
  ceoPhotoDescription: string
}

export default function AboutMission({
  quoteText,
  highlightedPhrase,
  ceoName,
  ceoTitle,
  ceoPhoto,
  ceoPhotoDescription,
}: AboutMissionProps) {
  // Function to highlight phrase within quote text
  const renderQuoteWithHighlight = () => {
    if (!highlightedPhrase || !quoteText.includes(highlightedPhrase)) {
      return quoteText
    }

    const parts = quoteText.split(highlightedPhrase)
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-[#F16D34] font-semibold">
                {highlightedPhrase}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    )
  }

  return (
    <section className="bg-[#FAFAFA] py-20 md:py-28 lg:py-36 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
          style={{
            background: "radial-gradient(circle, #F16D34 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="text-center">
          {/* Quote Mark */}
          <div className="mb-6">
            <span
              className="text-[#F16D34]/20 text-[100px] md:text-[140px] leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              "
            </span>
          </div>

          {/* CEO Quote */}
          <blockquote
            className="text-xl md:text-2xl lg:text-3xl text-[#1a1a1a] leading-relaxed -mt-16 md:-mt-20 mb-12"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            {renderQuoteWithHighlight()}
          </blockquote>

          {/* CEO Profile */}
          <div className="flex flex-col items-center gap-4">
            {/* CEO Image */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[#F16D34]/20">
              <Image
                src={ceoPhoto}
                alt={ceoPhotoDescription}
                fill
                className="object-cover"
              />
            </div>

            {/* CEO Info */}
            <div className="text-center">
              <h4
                className="text-lg md:text-xl font-bold text-[#1a1a1a]"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {ceoName}
              </h4>
              <p
                className="text-sm md:text-base text-[#F16D34] font-medium"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {ceoTitle}
              </p>
            </div>

            <LocalizedClientLink
              href="/about/ceo-story"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#191b22] px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#F16D34]"
              style={{ fontFamily: "Inter Display, sans-serif" }}
            >
              Read Story
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
