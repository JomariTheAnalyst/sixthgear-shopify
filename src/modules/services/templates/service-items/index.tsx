"use client"

/**
 * Service Items Template
 * Editorial row-based accordion for service detail pages
 */

import { useMemo, useState } from "react"

import { inter, poppins } from "@lib/fonts"
import { ServiceCategory } from "@lib/services-data"

interface ServiceItemsProps {
  service: ServiceCategory
}

function buildItemDetail(item: string, service: ServiceCategory) {
  const relatedItems = service.items
    .filter((candidate) => candidate !== item)
    .slice(0, 3)

  const supportingScope =
    relatedItems.length > 0
      ? `Where relevant, this is reviewed alongside related work such as ${relatedItems.join(", ").toLowerCase()} so the final result reflects the actual condition of the motorcycle instead of treating one task in isolation.`
      : "The work is reviewed in the context of the motorcycle's overall condition so the scope remains mechanically relevant and professionally executed."

  return `This covers ${item.toLowerCase()} with the inspection, setup, and workshop attention required to achieve a dependable and properly finished result. ${supportingScope}`
}

export default function ServiceItems({ service }: ServiceItemsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const rows = useMemo(
    () =>
      service.items.map((item) => ({
        title: item,
        detail: buildItemDetail(item, service),
      })),
    [service]
  )

  return (
    <section className="bg-white py-14 md:py-18 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-12">
          <p
            className={`${inter.className} mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400 md:text-xs`}
          >
            What We Offer
          </p>
          <h2
            className={`${poppins.className} max-w-5xl text-[2.25rem] font-bold leading-[0.98] tracking-[-0.05em] text-black sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem]`}
          >
            Our Services 
          </h2>
        </div>

        <div
          className="relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="border-t border-gray-200">
            {rows.map((row, index) => {
              const isOpen = openIndex === index
              const isDimmed = hoveredIndex !== null && hoveredIndex !== index

              return (
                <div
                  key={`${row.title}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={`relative border-b border-gray-200 transition-colors duration-300 ${
                    isOpen ? "bg-[#f5f5f1]" : "bg-white"
                  }`}
                  style={{
                    opacity: isDimmed ? 0.34 : 1,
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                    onClick={() =>
                      setOpenIndex((current) => (current === index ? null : index))
                    }
                    className="w-full text-left transition-opacity duration-200"
                  >
                    <div className="grid grid-cols-1 gap-4 px-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-6 md:px-6 lg:px-8">
                      <div className="min-w-0">
                        <h3
                          className={`${poppins.className} text-xl font-bold leading-[1.02] tracking-[-0.04em] transition-colors duration-200 ${
                            isDimmed ? "text-gray-400" : "text-black"
                          } md:text-2xl lg:text-[2rem]`}
                        >
                          {row.title}
                        </h3>
                      </div>

                      <div className="flex justify-start md:justify-end">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-full border text-black transition-all duration-300 ${
                            isOpen
                              ? "border-[#a8b59a] bg-[#a8b59a]"
                              : isDimmed
                                ? "border-gray-200 bg-white"
                                : "border-gray-200 bg-white"
                          }`}
                        >
                          <svg
                            className={`h-5 w-5 transition-all duration-300 ${
                              isOpen ? "-rotate-45" : "rotate-0"
                            } ${isDimmed ? "text-gray-400" : "text-black"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M7 17 17 7M9 7h8v8"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-1 gap-5 px-4 pb-6 md:px-6 md:pb-7 lg:px-8">
                        <div className="min-w-0 max-w-[72ch]">
                          <p
                            className={`${inter.className} text-sm leading-7 transition-colors duration-200 ${
                              isDimmed ? "text-gray-400" : "text-gray-700"
                            } md:text-[15px]`}
                          >
                            {row.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
