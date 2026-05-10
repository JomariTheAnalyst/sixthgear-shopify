"use client"

import Image from "next/image"
import type { ComponentType } from "react"
import { Coffee, ShieldCheck, Users, Wrench } from "lucide-react"
import { inter, montserrat } from "@lib/fonts"
import {
  AboutWhyChooseUsContent,
  AboutWhyChooseUsIconKey,
  AboutWhyChooseUsItem,
} from "@modules/about/types"

interface WhyChooseUsProps {
  data?: AboutWhyChooseUsContent | null
}

const FALLBACK_WHY_CHOOSE_US: Required<
  Pick<AboutWhyChooseUsContent, "sectionLabel" | "heading" | "subtitle">
> & {
  items: AboutWhyChooseUsItem[]
  topImage: { src: string | null; alt: string }
  bottomImage: { src: string | null; alt: string }
} = {
  sectionLabel: "Why Sixth Gear",
  heading: "Why Choose Us?",
  subtitle:
    "We didn't build Sixth Gear to be just another service shop. We built it to be the destination every Filipino rider deserves\u2014professional, passionate, and always riding alongside you.",
  items: [
    {
      id: 1,
      icon: "wrench",
      title: "Expert Workshop You Can Trust",
      description:
        "Our certified technicians handle everything from routine PMS to advanced ECU diagnostics and full performance builds\u2014on any big bike, any brand, zero shortcuts.",
    },
    {
      id: 2,
      icon: "shield",
      title: "Only Gear We'd Ride With",
      description:
        "Every helmet, accessory, and piece of apparel on our floor has been vetted the way we vet our own gear. We don't stock it unless we'd bet our safety on it.",
    },
    {
      id: 3,
      icon: "users",
      title: "A Real Rider Community",
      description:
        "We host rides, meetups, and events that bring serious riders together. Sixth Gear isn't just a stop\u2014it's a home base for the Filipino motorcycle community.",
    },
    {
      id: 4,
      icon: "coffee",
      title: "More Than a Shop",
      description:
        "Fuel up at First Gear Coffee while your bike is being serviced. Our rider lounge is built for that in-between time\u2014comfortable, honest, and unmistakably ours.",
    },
  ],
  topImage: {
    src: "/images/sixthgear-workshop.jpg",
    alt: "Sixthgear Workshop",
  },
  bottomImage: {
    src: "/images/sixthgear-image1.jpg",
    alt: "Rider community at Sixth Gear",
  },
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
  const sectionLabel =
    data?.sectionLabel?.trim() || FALLBACK_WHY_CHOOSE_US.sectionLabel
  const heading = data?.heading?.trim() || FALLBACK_WHY_CHOOSE_US.heading
  const subtitle = data?.subtitle?.trim() || FALLBACK_WHY_CHOOSE_US.subtitle
  const items =
    data?.items && data.items.length > 0
      ? data.items
      : FALLBACK_WHY_CHOOSE_US.items
  const topImage = {
    src: data?.topImage?.src || FALLBACK_WHY_CHOOSE_US.topImage.src,
    alt: data?.topImage?.alt?.trim() || FALLBACK_WHY_CHOOSE_US.topImage.alt,
  }
  const bottomImage = {
    src: data?.bottomImage?.src || FALLBACK_WHY_CHOOSE_US.bottomImage.src,
    alt:
      data?.bottomImage?.alt?.trim() || FALLBACK_WHY_CHOOSE_US.bottomImage.alt,
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
              <div key={item.id} className="flex gap-6 items-start">
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

        <div className="relative hidden lg:block h-[680px]">
          <div className="absolute bottom-0 right-0 w-52 h-72 bg-[#F16D34]/10" />

          <div className="absolute top-0 left-0 w-[58%] h-[62%] overflow-hidden shadow-xl">
            <Image
              src={topImage.src || "/images/placeholder.jpg"}
              alt={topImage.alt}
              fill
              quality={100}
              className="object-cover"
              sizes="(max-width: 1024px) 0vw, 30vw"
            />
          </div>

          <div className="absolute bottom-8 right-0 w-[58%] h-[55%] overflow-hidden shadow-xl">
            <Image
              src={bottomImage.src || "/images/placeholder.jpg"}
              alt={bottomImage.alt}
              fill
              quality={100}
              className="object-cover"
              sizes="(max-width: 1024px) 0vw, 30vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
