"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { inter, lato, montserrat } from "@lib/fonts"
import type { SanityServiceBrandsSectionQueryResult } from "@lib/cms/types"
import { selectServiceBrandsContent } from "@lib/cms/service-brands"
import { cleanSanityHref, cleanSanityString, createSanityDataAttribute, keyedSanityPath } from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

interface BrandsSectionProps {
  data?: SanityServiceBrandsSectionQueryResult | null
}

export default function Brands({ data }: BrandsSectionProps) {
  const content = selectServiceBrandsContent(data)
  const activeBrands = content.brands
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const activeBrand =
    activeIndex !== null
      ? activeBrands[activeIndex] || activeBrands[0]
      : activeBrands[0]

  return (
    <section data-sanity={createSanityDataAttribute(visualEditingEnabled, {
      documentId: "homepage",
      documentType: "homepage",
      path: sanitySource ? "serviceBrandsSection" : "serviceBrandsSection.useSanityContent",
    })} className="py-14 md:py-18 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="mb-10 text-center md:mb-14 lg:mb-16">
          <div className="mx-auto w-full max-w-[1200px] text-center">
          <h2
            className={`${montserrat.className} whitespace-normal text-center text-[clamp(1.45rem,3.7vw,3.35rem)] font-black leading-[0.9] tracking-[-0.05em] text-[#191b22] mb-3 md:mb-4 md:whitespace-nowrap`}
          >
            {content.sectionTitle}
          </h2>
          <p
            className={`${inter.className} mx-auto max-w-[760px] text-base font-medium leading-[1.35] tracking-[-0.02em] text-black/70 md:text-xl lg:text-2xl`}
          >
            {content.sectionDescription}
          </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] gap-8 lg:gap-12 items-start">
          <div className="order-2 lg:order-1 rounded-[28px] border border-gray-200 overflow-hidden bg-white">
            {activeBrands.map((brand, index) => {
              const isActive = index === activeIndex

              return (
                <div
                  key={brand.key}
                  data-sanity={sanitySource ? createSanityDataAttribute(visualEditingEnabled, {
                    documentId: "homepage",
                    documentType: "homepage",
                    path: keyedSanityPath("serviceBrandsSection.brands", brand.key),
                  }) : undefined}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === index ? null : index
                      )
                    }
                    className="w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 md:py-6 text-left transition-colors hover:bg-gray-50"
                  >
                    <span
                      className={`${lato.className} text-black text-xl md:text-2xl lg:text-[30px] leading-none tracking-[0.03em]`}
                    >
                      {brand.name}
                    </span>
                    <span
                      className={`flex items-center justify-center transition-colors ${
                        isActive ? "text-black" : "text-gray-700"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? "rotate-45" : ""
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 md:px-7 pb-5 md:pb-6">
                        <p
                          className={`${inter.className} text-sm md:text-base text-gray-600 leading-relaxed max-w-[52ch]`}
                        >
                          {brand.overview}
                        </p>
                        <ul
                          className={`${inter.className} mt-4 space-y-2 text-sm md:text-base text-gray-700 leading-relaxed`}
                        >
                          {brand.keySentences.map((sentence, sentenceIndex) => (
                            <li
                              key={`${brand.key}-point-${sentenceIndex}`}
                              className="flex gap-2"
                            >
                              <span
                                className="mt-[0.62em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F16D34]"
                                aria-hidden="true"
                              />
                              <span>{sentence}</span>
                            </li>
                          ))}
                        </ul>
                        {brand.link && brand.linkLabel ? (
                          <Link
                          href={cleanSanityHref(brand.link)}
                            className={`${montserrat.className} inline-flex items-center mt-4 text-xs md:text-sm font-semibold uppercase tracking-[0.06em] text-black border-b border-black pb-1 hover:opacity-70 transition-opacity`}
                          >
                            {brand.linkLabel}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="order-1 lg:order-2">
            <div className="group relative aspect-[4/4.6] sm:aspect-[4/3] lg:aspect-[5/4] rounded-[28px] overflow-hidden bg-gray-50 border border-gray-200">
              <Image
                key={`${activeBrand.key}-logo`}
                src={activeBrand.logoUrl}
                alt={activeBrand.logoAlt}
                fill
                className="object-contain p-8 md:p-10 lg:p-12 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <Image
                key={`${activeBrand.key}-motorcycle`}
                src={activeBrand.motorcycleImageUrl}
                alt={activeBrand.motorcycleImageAlt}
                fill
                className="object-contain p-6 md:p-8 lg:p-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
