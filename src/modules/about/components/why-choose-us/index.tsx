"use client"

import Image from "next/image"
import type { ComponentType } from "react"
import { Coffee, ShieldCheck, Users, Wrench } from "lucide-react"
import { inter, montserrat } from "@lib/fonts"
import {
  AboutWhyChooseUsIconKey,
} from "@modules/about/types"
import type { AboutWhyChooseUsSectionContent } from "@lib/cms/about-page-main"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
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

function getWhyChooseUsIcon(iconKey?: string | null) {
  const Icon =
    ICON_MAP[(iconKey as AboutWhyChooseUsIconKey) || "wrench"] || Wrench

  return <Icon strokeWidth={1.5} className="w-8 h-8 text-[#F16D34]" />
}

export default function WhyChooseUs({ data }: WhyChooseUsProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = data.source === "sanity"
  const { sectionLabel, heading, subtitle, items } = data
  const topImage = {
    src: data.topImageUrl,
    alt: data.topImageAlt,
  }
  const bottomImage = {
    src: data.bottomImageUrl,
    alt: data.bottomImageAlt,
  }

  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div>
          <span
            className={`text-[#F16D34] text-xs md:text-sm font-bold uppercase tracking-widest mb-4 block ${inter.className}`}
          >
            {sectionLabel}
          </span>

          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] leading-tight mb-6 ${montserrat.className}`}
          >
            {heading}
          </h2>

          <p
            className={`text-base md:text-lg text-gray-500 leading-relaxed mb-14 max-w-lg ${inter.className}`}
          >
            {subtitle}
          </p>

          <div className="flex flex-col gap-10">
            {items.map((item) => (
              <div
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
                className="flex gap-6 items-start"
              >
                <div className="flex-none w-14 h-14 bg-[#F16D34]/8 flex items-center justify-center rounded-xl">
                  {getWhyChooseUsIcon(item.icon)}
                </div>

                <div>
                  <h3
                    className={`text-lg font-bold text-[#1a1a1a] mb-2 ${montserrat.className}`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm md:text-base text-gray-500 leading-relaxed ${inter.className}`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden h-[680px] lg:block">
          <div className="absolute bottom-10 right-8 h-72 w-52 rounded-sm bg-[#F16D34]/10" />

          <div className="absolute left-4 top-10 z-10 w-[55%] -rotate-6 bg-white p-4 pb-12 shadow-[0_24px_45px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
            <span className="absolute -top-7 left-1/2 z-20 h-14 w-20 -translate-x-1/2 rotate-[-8deg] bg-[#e8dccf]/80 shadow-sm" />
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image
                src={topImage.src || "/images/placeholder.jpg"}
                alt={topImage.alt}
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "aboutPage",
                        documentType: "aboutPage",
                        path: "whyChooseUs.topImage",
                      })
                    : undefined
                }
                fill
                quality={100}
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 30vw"
              />
            </div>
          </div>

          <div className="absolute bottom-14 right-2 z-20 w-[56%] rotate-5 bg-white p-4 pb-12 shadow-[0_28px_55px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
            <span className="absolute -top-7 left-1/2 z-20 h-14 w-20 -translate-x-1/2 rotate-[10deg] bg-[#e8dccf]/80 shadow-sm" />
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image
                src={bottomImage.src || "/images/placeholder.jpg"}
                alt={bottomImage.alt}
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
                quality={100}
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 30vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
