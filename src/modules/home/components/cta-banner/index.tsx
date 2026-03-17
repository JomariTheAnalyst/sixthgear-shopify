"use client"

import Link from "next/link"
import { inter, montserrat } from "@lib/fonts"
import { TextRoll } from "components/ui/text-roll"

interface CTABannerProps {
  preTitle?: string | null
  headline?: string | null
  headlineHighlight?: string | null
  buttonLabel?: string | null
  buttonLink?: string | null
  footerTagline?: string | null
  socialLinks?: {
    facebook?: string | null
    instagram?: string | null
    tiktok?: string | null
  } | null
}

export default function CTABanner({
  preTitle,
  headline,
  headlineHighlight,
  buttonLabel,
  buttonLink,
  footerTagline,
  socialLinks,
}: CTABannerProps) {
  const activePreTitle = preTitle || "Ready to upgrade your ride?"
  const activeHeadline = headline || "We've got\nthe gear\nwaiting for you."
  const activeHighlight = headlineHighlight || "for you."
  const activeButtonLabel = buttonLabel || "Shop Now"
  const activeButtonLink = buttonLink || "/store"

  const activeFooterTagline = footerTagline || "Sixth Gear Moto Supply® is a premium service center. Based in Makati City, Working nationwide."

  const activeSocialLinks = {
    instagram: socialLinks?.instagram || "https://www.instagram.com/sixthgear_moto_supply/",
    facebook: socialLinks?.facebook || "https://www.facebook.com/camille.sixthgear",
    tiktok: socialLinks?.tiktok || "https://www.tiktok.com/@sixthgear.moto.su",
  }

  const activeSocials = [
    activeSocialLinks.instagram && { name: "Instagram", url: activeSocialLinks.instagram },
    activeSocialLinks.facebook && { name: "Facebook", url: activeSocialLinks.facebook },
    activeSocialLinks.tiktok && { name: "TikTok", url: activeSocialLinks.tiktok },
  ].filter(Boolean)

  // Split headline into lines (preserving newlines as <br/>)
  // Then within each line, split by highlight text (case-insensitive)
  const renderHeadline = () => {
    const lines = activeHeadline.split("\n")

    return lines.map((line, lineIdx) => {
      // Case-insensitive find of the highlight within this line
      const highlightLower = activeHighlight.toLowerCase()
      const lineLower = line.toLowerCase()
      const matchIndex = lineLower.indexOf(highlightLower)

      return (
        <span key={lineIdx}>
          {matchIndex === -1 ? (
            // No match in this line — render entire line white
            line
          ) : (
            <>
              {line.slice(0, matchIndex)}
              <span className="text-[#F16D34]">
                {line.slice(matchIndex, matchIndex + activeHighlight.length)}
              </span>
              {line.slice(matchIndex + activeHighlight.length)}
            </>
          )}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="w-full bg-[#111111] rounded-[2rem] px-6 py-10 md:p-14 lg:px-20 lg:py-16 flex flex-col justify-between relative overflow-hidden min-h-[650px] md:min-h-[450px]">
        {/* Subtle Orange Gradient Accent (Minimal) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F16D34]/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        {/* Top/Main Container */}
        <div className="flex flex-col md:flex-row justify-between items-start z-10 w-full mb-12 md:mb-16">
          
          {/* Left Side: Headlines & Button */}
          <div className="max-w-2xl w-full">
            <p className={`${inter.className} text-white/90 text-[15px] md:text-lg font-bold mb-4 md:mb-6 tracking-tight`}>
              {activePreTitle}
            </p>

            <h2 
              className={`${montserrat.className} text-white text-[3.25rem] leading-[0.95] tracking-[0.02em] md:text-[5.5rem] lg:text-[6.5rem] md:leading-[0.9] md:tracking-[0.015em] font-bold mb-8 md:mb-10`}
            >
              {renderHeadline()}
            </h2>

            {/* Buttons Area */}
            <div className="flex items-center gap-3">
              <Link 
                href={activeButtonLink}
                className={`${montserrat.className} px-8 py-3.5 md:py-4 bg-[#F2F2F2] text-[#111] text-sm md:text-[15px] font-bold rounded-[2rem] transition-all hover:bg-[#F16D34] hover:text-white`}
              >
                {activeButtonLabel}
              </Link>
              <Link
                href={activeButtonLink}
                className="w-12 h-12 md:w-14 md:h-14 bg-[#F2F2F2] text-[#111] rounded-full flex items-center justify-center transition-all hover:bg-[#F16D34] hover:text-white"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Side: Social Links (Desktop) */}
          <div className="hidden md:flex flex-col gap-[2px] items-end pt-2">
            {activeSocials.map((social: any) => (
              <a 
                key={social.name}
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                className={`${inter.className} text-white text-base font-bold hover:text-[#F16D34] transition-colors`}
              >
                <TextRoll center={false}>{social.name}</TextRoll>
              </a>
            ))}
          </div>

        </div>

        {/* Mobile Spacer / Layout Divider element  */}
        <div className="flex-grow" />

        {/* Social Links (Mobile) */}
        <div className="md:hidden flex flex-col gap-1 items-start mt-8 w-full z-10 mb-12">
          {activeSocials.map((social: any) => (
              <a 
                key={social.name}
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                className={`${inter.className} text-white text-[1.4rem] font-bold hover:text-[#F16D34] transition-colors tracking-tight`}
              >
              <TextRoll center={false}>{social.name}</TextRoll>
            </a>
          ))}
        </div>

        {/* Bottom Footer Section */}
        <div className="w-full relative z-10">
          {/* Divider line spanning main content area (Desktop only) */}
          <div className="hidden md:flex justify-between items-center mb-6">
             <div className="w-[85%] h-[1px] bg-white/20" />
             <p className={`${inter.className} text-white/80 font-bold text-[11px] text-right`}>
                @sixthgearmoto, All Right Reserved
             </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-4">
            <p className={`${inter.className} text-white font-bold text-xs md:text-[13px] leading-snug md:leading-normal`}>
              {activeFooterTagline}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

