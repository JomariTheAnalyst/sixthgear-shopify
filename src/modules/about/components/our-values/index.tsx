"use client"

import React from "react"
import { Wrench, Users, ShieldCheck, Coffee, Zap, Award } from "lucide-react"
import { inter, montserrat } from "@lib/fonts"

interface ValueItem {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const VALUES_DATA: ValueItem[] = [
  {
    id: 1,
    title: "Precision & Expertise",
    description:
      "We treat every motorcycle as our own, delivering meticulous service, diagnostics, and performance upgrades with zero compromises.",
    icon: <Wrench strokeWidth={1.5} className="w-6 h-6 text-[#1a1a1a]" />,
  },
  {
    id: 2,
    title: "Community First",
    description:
      "More than customers, we build a family. A true hub for riders to connect, share stories, and build lasting friendships on and off the road.",
    icon: <Users strokeWidth={1.5} className="w-6 h-6 text-[#1a1a1a]" />,
  },
  {
    id: 3,
    title: "Uncompromising Quality",
    description:
      "We only stock, sell, and recommend gear, parts, and accessories that we personally trust, test, and use for our own rides.",
    icon: <ShieldCheck strokeWidth={1.5} className="w-6 h-6 text-[#1a1a1a]" />,
  },
  {
    id: 4,
    title: "The Rider's Experience",
    description:
      "More than just a workshop—a destination. Refuel with First Gear Coffee, relax in our lounge, and immerse yourself in real motorcycle culture.",
    icon: <Coffee strokeWidth={1.5} className="w-6 h-6 text-[#1a1a1a]" />,
  },
  {
    id: 5,
    title: "Passion Driven",
    description:
      "Our pure enthusiasm for two wheels fuels our dedication to continuous learning, improvement, and innovation in everything we do.",
    icon: <Zap strokeWidth={1.5} className="w-6 h-6 text-[#1a1a1a]" />,
  },
  {
    id: 6,
    title: "Integrity & Trust",
    description:
      "Honest advice, transparent pricing, and a solid commitment to doing what's right for you, your safety, and your machine.",
    icon: <Award strokeWidth={1.5} className="w-6 h-6 text-[#1a1a1a]" />,
  },
]

export default function OurValues() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2
            className={`text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 ${montserrat.className}`}
          >
            Our Values
          </h2>
          <p
            className={`text-lg text-gray-600 max-w-2xl leading-relaxed ${inter.className}`}
          >
            The principles that steer our workshop, curate our gear, and brew our coffee. Built by riders, for riders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {VALUES_DATA.map((val) => (
            <div
              key={val.id}
              className="border border-gray-200 rounded-3xl p-8 sm:p-10 bg-white transition-shadow duration-300 hover:shadow-lg hover:border-gray-300 flex flex-col"
            >
              {/* Icon Pad */}
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8">
                {val.icon}
              </div>

              {/* Text Content */}
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
