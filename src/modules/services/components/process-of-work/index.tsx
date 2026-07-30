"use client"

import type { ServicesProcessContent } from "@lib/cms/services-page-content"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

export default function ProcessOfWork({
  content,
}: {
  content: ServicesProcessContent
}) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"

  return (
    <section className="bg-white py-24 md:py-32 w-full border-t border-[#EAEAEA]">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mb-14 md:mb-16">
          <h2
            className="text-[2.5rem] md:text-5xl lg:text-6xl text-[#111] leading-[1.05] tracking-[-0.03em] font-semibold"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            {content.sectionHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {content.steps.map((step, index) => {
            const isMuted = index === 0 || index === 3

            return (
              <article
                key={step.key}
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "servicesPage",
                        documentType: "servicesPage",
                        path: keyedSanityPath(
                          "processOfWork.steps",
                          step.key
                        ),
                      })
                    : undefined
                }
                className={`min-h-[280px] md:min-h-[320px] border border-[#EAEAEA] p-8 md:p-10 lg:p-12 flex flex-col justify-start ${
                  isMuted ? "bg-[#FAFAFA]" : "bg-white"
                }`}
              >
                <span
                  className="text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] leading-none tracking-[-0.05em] font-medium text-black/30"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  {step.number}
                </span>

                <h3
                  className="mt-6 text-[1.9rem] md:text-[2.1rem] lg:text-[2.35rem] leading-[1.05] tracking-[-0.03em] font-semibold text-[#111]"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  {step.title}
                </h3>

                <p
                  className="mt-5 max-w-[34rem] text-sm md:text-[15px] lg:text-base leading-7 text-[#111]/78"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {step.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
