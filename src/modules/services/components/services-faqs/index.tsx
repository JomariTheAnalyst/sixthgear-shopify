"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { outfit } from "@lib/fonts"

const SERVICE_FAQS = [
  {
    question: "What motorcycle services can I book with Sixthgear?",
    answer:
      "You can book preventive maintenance, diagnostics and repairs, accessory installation, wheels and drivetrain work, detailing, protection, and performance upgrades. Choose the closest service when booking and tell us the exact concern in the notes.",
  },
  {
    question: "How do I know which service my motorcycle needs?",
    answer:
      "Share the symptoms, recent service history, and anything that feels different while riding. Our team can begin with an inspection, explain what we find, and recommend the correct service path before work starts.",
  },
  {
    question: "Do you service motorcycles from different brands?",
    answer:
      "Yes. Sixthgear works with a range of motorcycle brands and riding setups. Service availability can depend on the model, required parts, and specialist tools, so include your bike’s year, make, and model when booking.",
  },
  {
    question: "Will you ask before doing additional work?",
    answer:
      "Yes. If the inspection reveals work beyond the approved service, we will explain the finding and confirm the updated scope with you before proceeding. You stay informed about the work, timing, and expected cost.",
  },
  {
    question: "How long will my motorcycle stay in the workshop?",
    answer:
      "Timing depends on the service, inspection findings, and parts availability. Routine work may be completed sooner, while diagnostics, repairs, or upgrades can require more time. We will provide a practical estimate after intake.",
  },
  {
    question: "What should I bring to my service appointment?",
    answer:
      "Bring your motorcycle, keys, and any useful service records. A short list of concerns, recent changes, warning lights, or unusual sounds also helps our technicians understand the bike more quickly.",
  },
] as const

export default function ServicesFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      aria-labelledby="services-faq-heading"
      className={`${outfit.className} bg-white px-5 py-20 text-[#151515] sm:px-8 md:py-28 lg:px-12 lg:py-32`}
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2
            id="services-faq-heading"
            className="max-w-[12ch] text-[clamp(2.75rem,4.8vw,5rem)] font-semibold leading-[0.98] tracking-[-0.05em]"
          >
            Got service questions? We’re ready to help.
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {SERVICE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            const panelId = `services-faq-panel-${index}`
            const triggerId = `services-faq-trigger-${index}`

            return (
              <article
                key={faq.question}
                className="overflow-hidden rounded-[16px] bg-[#f4f4f1]"
              >
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="group flex min-h-20 w-full items-center justify-between gap-6 px-5 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#F16D34] sm:min-h-24 sm:px-7 lg:px-8"
                  >
                    <span className="text-base font-medium leading-6 tracking-[-0.02em] sm:text-lg sm:leading-7 lg:text-xl">
                      {faq.question}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#F16D34]">
                      <Plus
                        aria-hidden="true"
                        size={18}
                        strokeWidth={1.8}
                        className={`transition-transform duration-300 motion-reduce:transition-none ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[70ch] px-5 pb-7 pr-16 text-sm leading-6 text-black/[0.6] sm:px-7 sm:pr-20 sm:text-base sm:leading-7 lg:px-8 lg:pb-8 lg:pr-24">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
