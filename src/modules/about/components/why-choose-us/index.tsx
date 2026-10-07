"use client"

import Image from "next/image"
import { useState, type ComponentType } from "react"
import { Coffee, ShieldCheck, Users, Wrench } from "lucide-react"

import type { AboutWhyChooseUsSectionContent } from "@lib/cms/about-page-main"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { resolveSanityImage } from "@lib/util/sanity-image"
import { ABOUT_CONTAINER, ABOUT_PROSE } from "@modules/about/constants"
import {
  ABOUT_BODY,
  ABOUT_EYEBROW,
  ABOUT_SUBTITLE,
  ABOUT_TITLE,
} from "@modules/about/styles"
import type { AboutWhyChooseUsIconKey } from "@modules/about/types"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

interface WhyChooseUsProps {
  data: AboutWhyChooseUsSectionContent
}

const ICON_MAP: Record<
  AboutWhyChooseUsIconKey,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  wrench: Wrench,
  shield: ShieldCheck,
  users: Users,
  coffee: Coffee,
}

function WhyIcon({ iconKey }: { iconKey?: string | null }) {
  const Icon = ICON_MAP[(iconKey as AboutWhyChooseUsIconKey) || "wrench"] || Wrench
  return <Icon strokeWidth={1.5} className="h-6 w-6 text-[#F16D34] md:h-7 md:w-7" />
}

/** Plus that turns into a minus when its panel is open. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-current" />
      <span
        className={`absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-current transition-transform duration-300 motion-reduce:transition-none ${
          open ? "scale-y-0" : "scale-y-100"
        }`}
      />
    </span>
  )
}

export default function WhyChooseUs({ data }: WhyChooseUsProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = data.source === "sanity"
  const [openIndex, setOpenIndex] = useState(0)
  const image = resolveSanityImage(data.bottomImageSource, data.bottomImageUrl)

  return (
    <section aria-labelledby="about-why-heading" className="bg-white py-20 md:py-28 lg:py-32">
      <div
        className={`${ABOUT_CONTAINER} grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}
      >
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className={ABOUT_EYEBROW}>{data.sectionLabel}</p>
          <h2 id="about-why-heading" className={`${ABOUT_TITLE} mt-4 text-[#1a1a1a]`}>
            {data.heading}
          </h2>
          <p className={`${ABOUT_BODY} ${ABOUT_PROSE} mt-5 text-[#1a1a1a]/70`}>
            {data.subtitle}
          </p>

          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[20px] bg-grey-10 lg:aspect-[5/4]">
            <Image
              src={image.url}
              alt={data.bottomImageAlt}
              data-sanity={
                sanitySource
                  ? createSanityDataAttribute(visualEditingEnabled, {
                      documentId: "aboutPage",
                      documentType: "aboutPage",
                      path: "whyChooseUs.bottomImage",
                    })
                  : undefined
              }
              fill
              sizes="(max-width: 1023px) 100vw, (max-width: 1760px) 40vw, 660px"
              className="object-cover"
              style={{ objectPosition: image.objectPosition }}
            />
          </div>
        </div>

        <ul className="border-t border-black/10">
          {data.items.map((item, index) => {
            const open = openIndex === index
            const buttonId = `about-why-button-${index}`
            const panelId = `about-why-panel-${index}`

            return (
              <li
                key={item.key}
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "aboutPage",
                        documentType: "aboutPage",
                        path: keyedSanityPath("whyChooseUs.items", item.key),
                      })
                    : undefined
                }
                className="border-b border-black/10"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex w-full items-center gap-4 py-6 text-left text-[#1a1a1a] transition-colors hover:text-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34] md:gap-6 md:py-8"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F16D34]/10 md:h-14 md:w-14">
                      <WhyIcon iconKey={item.icon} />
                    </span>
                    <span className={`${ABOUT_SUBTITLE} flex-1 text-[clamp(1.5rem,2.4vw,2.5rem)]`}>
                      {item.title}
                    </span>
                    <PlusMinus open={open} />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!open}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`${ABOUT_BODY} ${ABOUT_PROSE} pb-7 text-[#1a1a1a]/70 sm:pl-16 md:pb-8 md:pl-20`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
