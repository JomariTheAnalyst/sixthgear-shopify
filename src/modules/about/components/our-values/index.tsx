"use client"

import React from "react"
import { Award, Coffee, ShieldCheck, Users, Wrench, Zap } from "lucide-react"
import { inter, montserrat } from "@lib/fonts"
import {
  AboutValueCard,
  AboutValueIconKey,
  AboutValuesContent,
} from "@modules/about/types"

interface OurValuesProps {
  data?: AboutValuesContent | null
}

const FALLBACK_ABOUT_VALUES: AboutValueCard[] = [
  {
    id: 1,
    title: "Precision & Expertise",
    description:
      "We treat every motorcycle as our own, delivering meticulous service, diagnostics, and performance upgrades with zero compromises.",
    icon: "wrench",
  },
  {
    id: 2,
    title: "Community First",
    description:
      "More than customers, we build a family. A true hub for riders to connect, share stories, and build lasting friendships on and off the road.",
    icon: "users",
  },
  {
    id: 3,
    title: "Uncompromising Quality",
    description:
      "We only stock, sell, and recommend gear, parts, and accessories that we personally trust, test, and use for our own rides.",
    icon: "shield",
  },
  {
    id: 4,
    title: "The Rider's Experience",
    description:
      "More than just a workshop\u2014a destination. Refuel with First Gear Coffee, relax in our lounge, and immerse yourself in real motorcycle culture.",
    icon: "coffee",
  },
  {
    id: 5,
    title: "Passion Driven",
    description:
      "Our pure enthusiasm for two wheels fuels our dedication to continuous learning, improvement, and innovation in everything we do.",
    icon: "energy",
  },
  {
    id: 6,
    title: "Integrity & Trust",
    description:
      "Honest advice, transparent pricing, and a solid commitment to doing what's right for you, your safety, and your machine.",
    icon: "award",
  },
]

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
  const heading = data?.heading?.trim() || "Our Values"
  const description =
    data?.description?.trim() ||
    "The principles that steer our workshop, curate our gear, and brew our coffee. Built by riders, for riders."
  const cards =
    data?.cards && data.cards.length > 0 ? data.cards : FALLBACK_ABOUT_VALUES

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
              key={val.id}
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
