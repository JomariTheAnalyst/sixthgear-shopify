"use client"

import React from "react"
import { Award, Coffee, ShieldCheck, Users, Wrench, Zap } from "lucide-react"
import { inter, montserrat } from "@lib/fonts"
import {
  AboutValueIconKey,
} from "@modules/about/types"
import type { AboutValuesSectionContent } from "@lib/cms/about-page-main"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

interface OurValuesProps {
  data: AboutValuesSectionContent
}

const ICON_MAP: Record<
  AboutValueIconKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  wrench: Wrench,
  users: Users,
  shield: ShieldCheck,
  coffee: Coffee,
  energy: Zap,
  award: Award,
}

function getValueIcon(iconKey?: string | null) {
  const Icon = ICON_MAP[(iconKey as AboutValueIconKey) || "wrench"] || Wrench

  return <Icon strokeWidth={1.5} className="w-6 h-6 text-[#1a1a1a]" />
}

export default function OurValues({ data }: OurValuesProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = data.source === "sanity"
  const { heading, description, cards } = data

  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2
            className={`text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 ${montserrat.className}`}
          >
            {heading}
          </h2>
          <p
            className={`text-lg text-gray-600 max-w-2xl leading-relaxed ${inter.className}`}
          >
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((val) => (
            <div
              key={val.key}
              data-sanity={
                sanitySource
                  ? createSanityDataAttribute(visualEditingEnabled, {
                      documentId: "aboutPage",
                      documentType: "aboutPage",
                      path: keyedSanityPath("ourValues.cards", val.key),
                    })
                  : undefined
              }
              className="border border-gray-200 rounded-3xl p-8 sm:p-10 bg-white transition-shadow duration-300 hover:shadow-lg hover:border-gray-300 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8">
                {getValueIcon(val.icon)}
              </div>

              <h3
                className={`text-xl font-bold text-[#1a1a1a] mb-4 ${montserrat.className}`}
              >
                {val.title}
              </h3>
              <p
                className={`text-sm sm:text-base text-gray-600 leading-relaxed ${inter.className}`}
              >
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
