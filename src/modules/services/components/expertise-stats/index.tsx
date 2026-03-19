"use client"

import Link from "next/link"
import { SanityServicesExpertiseStats } from "@lib/cms/types"

export const FALLBACK_EXPERTISE_STATS = {
  sectionHeading: "Comprehensive Care for\nPremium Motorcycles",
  sectionDescription:
    "From routine maintenance to performance upgrades and emergency recovery, we provide end-to-end solutions. Our expert technicians combine advanced diagnostics with quality parts to keep your ride at its peak.",
  buttonText: "Book a Service",
  buttonLink: "/contact",
  stats: [
    {
      number: "8",
      label: "Core Service\nCategories",
    },
    {
      number: "45+",
      label: "Specialized\nProcedures",
    },
    {
      number: "100%",
      label: "Precision\n& Quality",
    },
    {
      number: "24/7",
      label: "Roadside\nRecovery",
    },
  ],
} as const

type ExpertiseStatsProps = {
  countryCode: string
  data?: SanityServicesExpertiseStats | null
}

export default function ExpertiseStats({
  countryCode,
  data,
}: ExpertiseStatsProps) {
  const normalizedButtonLink = (data?.buttonLink || FALLBACK_EXPERTISE_STATS.buttonLink).trim()
  const buttonHref = /^https?:\/\//i.test(normalizedButtonLink)
    ? normalizedButtonLink
    : `/${countryCode}${normalizedButtonLink.startsWith("/") ? normalizedButtonLink : `/${normalizedButtonLink}`}`

  const activeContent = {
    sectionHeading:
      data?.sectionHeading?.trim() || FALLBACK_EXPERTISE_STATS.sectionHeading,
    sectionDescription:
      data?.sectionDescription?.trim() ||
      FALLBACK_EXPERTISE_STATS.sectionDescription,
    buttonText:
      data?.buttonText?.trim() || FALLBACK_EXPERTISE_STATS.buttonText,
    stats:
      data?.stats && data.stats.length > 0
        ? data.stats.map((stat, index) => ({
            number:
              stat.number?.trim() ||
              FALLBACK_EXPERTISE_STATS.stats[index]?.number ||
              "",
            label:
              stat.label?.trim() ||
              FALLBACK_EXPERTISE_STATS.stats[index]?.label ||
              "",
          }))
        : [...FALLBACK_EXPERTISE_STATS.stats],
  }

  return (
    <section className="bg-white py-20 md:py-32 w-full border-b border-[#EAEAEA]">
      <div className="w-full lg:max-w-[95%] xl:max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 w-full text-left">
            <h2
              className="text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] text-[#111] leading-tight mb-8 font-semibold"
              style={{
                fontFamily: "'Inter Display', sans-serif",
                letterSpacing: "normal",
              }}
            >
              {activeContent.sectionHeading.split("\n").map((line, index, lines) => (
                <span key={index}>
                  {line}
                  {index < lines.length - 1 && (
                    <>
                      <br className="hidden sm:block" />
                      <span className="sm:hidden"> </span>
                    </>
                  )}
                </span>
              ))}
            </h2>

            <p
              className="text-[#111]/80 text-base md:text-lg lg:text-xl leading-relaxed mb-10 font-normal lg:max-w-[90%]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {activeContent.sectionDescription}
            </p>

            <Link
              href={buttonHref}
              className="inline-flex items-center justify-center px-8 py-3.5 lg:px-10 lg:py-4 border border-[#111] rounded-md bg-transparent text-[#111] font-medium text-sm md:text-base transition-colors hover:bg-[#111] hover:text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {activeContent.buttonText}
            </Link>
          </div>

          <div className="w-full lg:w-[50%] grid grid-cols-2 gap-5 md:gap-8">
            {activeContent.stats.map((stat, index) => (
              <div
                key={`${stat.number}-${index}`}
                className="bg-white rounded-[1.25rem] p-8 md:p-12 border border-[#EAEAEA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300"
              >
                <span
                  className="text-[#111] text-[4rem] md:text-[5rem] leading-none font-bold mb-3 tracking-tighter"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  {stat.number}
                </span>
                <span
                  className="text-[#111] text-sm md:text-base font-medium leading-snug whitespace-pre-line"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
