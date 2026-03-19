"use client"

/**
 * Why Choose Us Section
 * Left: kicker, heading, subtitle, icon feature list
 * Right: two overlapping/offset images with orange accent block
 */

import Image from "next/image"
import { Wrench, ShieldCheck, Users, Coffee } from "lucide-react"
import { inter, montserrat } from "@lib/fonts"

interface WhyItem {
  id: number
  icon: React.ReactNode
  title: string
  description: string
}

const WHY_ITEMS: WhyItem[] = [
  {
    id: 1,
    icon: <Wrench strokeWidth={1.5} className="w-8 h-8 text-[#F16D34]" />,
    title: "Expert Workshop You Can Trust",
    description:
      "Our certified technicians handle everything from routine PMS to advanced ECU diagnostics and full performance builds—on any big bike, any brand, zero shortcuts.",
  },
  {
    id: 2,
    icon: <ShieldCheck strokeWidth={1.5} className="w-8 h-8 text-[#F16D34]" />,
    title: "Only Gear We'd Ride With",
    description:
      "Every helmet, accessory, and piece of apparel on our floor has been vetted the way we vet our own gear. We don't stock it unless we'd bet our safety on it.",
  },
  {
    id: 3,
    icon: <Users strokeWidth={1.5} className="w-8 h-8 text-[#F16D34]" />,
    title: "A Real Rider Community",
    description:
      "We host rides, meetups, and events that bring serious riders together. Sixth Gear isn't just a stop—it's a home base for the Filipino motorcycle community.",
  },
  {
    id: 4,
    icon: <Coffee strokeWidth={1.5} className="w-8 h-8 text-[#F16D34]" />,
    title: "More Than a Shop",
    description:
      "Fuel up at First Gear Coffee while your bike is being serviced. Our rider lounge is built for that in-between time—comfortable, honest, and unmistakably ours.",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left Column — Text */}
        <div>
          {/* Kicker */}
          <span
            className={`text-[#F16D34] text-xs md:text-sm font-bold uppercase tracking-widest mb-4 block ${inter.className}`}
          >
            Why Sixth Gear
          </span>

          {/* Heading */}
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] leading-tight mb-6 ${montserrat.className}`}
          >
            Why Choose Us?
          </h2>

          {/* Subtitle */}
          <p
            className={`text-base md:text-lg text-gray-500 leading-relaxed mb-14 max-w-lg ${inter.className}`}
          >
            We didn't build Sixth Gear to be just another service shop. We built it to be the destination every Filipino rider deserves—professional, passionate, and always riding alongside you.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-10">
            {WHY_ITEMS.map((item) => (
              <div key={item.id} className="flex gap-6 items-start">
                {/* Icon */}
                <div className="flex-none w-14 h-14 bg-[#F16D34]/8 flex items-center justify-center rounded-xl">
                  {item.icon}
                </div>

                {/* Text */}
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

        {/* Right Column — Overlapping Images */}
        <div className="relative hidden lg:block h-[680px]">
          {/* Orange accent block */}
          <div className="absolute bottom-0 right-0 w-52 h-72 bg-[#F16D34]/10" />

          {/* Top image — taller, left-positioned */}
          <div className="absolute top-0 left-0 w-[58%] h-[62%] overflow-hidden shadow-xl">
            <Image
              src="/images/sixthgear-workshop.jpg"
              alt="Sixthgear Workshop"
              fill
              quality={100}
              className="object-cover"
              sizes="(max-width: 1024px) 0vw, 30vw"
            />
          </div>

          {/* Bottom image — shorter, right-positioned, overlapping */}
          <div className="absolute bottom-8 right-0 w-[58%] h-[55%] overflow-hidden shadow-xl">
            <Image
              src="/images/sixthgear-image1.jpg"
              alt="Rider community at Sixth Gear"
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
