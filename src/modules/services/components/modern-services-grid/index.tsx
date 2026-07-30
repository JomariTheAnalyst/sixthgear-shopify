"use client"

import Link from "next/link"
import type { ServicesGridContent } from "@lib/cms/services-page-content"
import { TextRoll } from "components/ui/text-roll"
import { getServiceIcon } from "@modules/services/lib/icon-map"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

type ModernServicesGridProps = {
  countryCode: string
  content: ServicesGridContent
}

export default function ModernServicesGrid({
  countryCode,
  content,
}: ModernServicesGridProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"

  return (
    <section className="bg-white py-24 md:py-32 w-full">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="text-center md:text-left mb-16 md:mb-20">
          <h2
            className="text-[2.5rem] md:text-5xl lg:text-6xl text-[#111] leading-[1.1] tracking-[-0.03em] font-semibold"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            {content.sectionHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services.map((service) => {
            const itemTarget =
              sanitySource && content.useCustomServices
                ? createSanityDataAttribute(visualEditingEnabled, {
                    documentId: "servicesPage",
                    documentType: "servicesPage",
                    path: keyedSanityPath(
                      "servicesGrid.featuredServices",
                      service.key
                    ),
                  })
                : sanitySource && service.documentId
                  ? createSanityDataAttribute(visualEditingEnabled, {
                      documentId: service.documentId,
                      documentType: "service",
                      path: "title",
                    })
                  : undefined

            return (
              <Link
                key={service.key}
                data-sanity={itemTarget}
                href={`/${countryCode}/services/${service.slug}`}
                className="group flex flex-col bg-[#F9F9F9] rounded-[1.5rem] p-8 lg:p-10 transition-colors duration-300 hover:bg-[#F2F2F2] h-full"
              >
                <div className="text-[#111] mb-8">
                  {getServiceIcon(service.icon)}
                </div>

                <h3
                  className="text-xl md:text-[22px] text-[#111] leading-[1.2] font-semibold mb-4"
                  style={{
                    fontFamily: "'Inter Display', sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {service.title}
                </h3>

                <p
                  className="text-[#111]/70 text-[15px] md:text-base leading-relaxed mb-10 flex-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {service.description}
                </p>

                <div className="mt-auto flex items-center gap-2 text-[#111] font-medium text-sm md:text-base">
                  <TextRoll
                    className="font-semibold"
                    transition={{ duration: 0.3 }}
                  >
                    Learn More
                  </TextRoll>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
