"use client"

/**
 * About Story Section
 * Main narrative about Sixthgear with alternating image/text rows
 */

import React from "react"
import Image from "next/image"
import { inter, montserrat } from "@lib/fonts"
import { AboutStoryItem } from "@modules/about/types"

const FALLBACK_ABOUT_STORY: AboutStoryItem[] = [
  {
    id: 1,
    heading: "At Our Core, We Are Riders",
    body: "When we built Sixth Gear, we didn't just want to open another shop. We wanted a place we'd actually want to hang out in ourselves. A true hub where serious riders could get professional, no-compromise servicing for their big bikes—whether it's routine PMS, tough repairs, or dialing in that perfect performance upgrade. We treat every machine rolling into our bays with the exact same precision and respect we give our own bikes.",
    image: {
      src: "/images/sixthgear-workshop.jpg",
      alt: "Sixthgear Workshop"
    }
  },
  {
    id: 2,
    heading: "No Shortcuts On Quality",
    body: "Riding isn't just transport; it's a lifestyle. That's why we stock only the gear, parts, and accessories that we personally trust and use on the open road. If we won't bet our own safety on a helmet or throw a specific brand of luggage on our own touring rigs, you won't find it on our shelves. We're committed to bringing you the absolute highest standard of rider apparel because we know exactly what is at stake when you twist the throttle.",
    image: {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779091975/sixthgear-shop_gxf8bi.png",
      alt: "Sixthgear Moto shop interior with riding gear and accessories"
    }
  },
  {
    id: 3,
    heading: "Fueling The Community",
    body: "A great ride always starts or ends with great coffee. That's the reason we integrated First Gear Coffee right into our space. It's more than just an espresso machine in a waiting area—it's a sanctuary for the riding community. We organize events, foster real friendships, and provide a place where you can grab a solid cup of coffee, talk shop, and swap stories with people who share the exact same passion for two wheels.",
    image: {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779090174/sixthgear-event_ossb2m.jpg",
      alt: "Sixthgear Moto rider community event"
    }
  }
]

export interface AboutStoryProps {
  items?: AboutStoryItem[] | null
}

export default function AboutStory({ items }: AboutStoryProps) {
  const displayItems =
    items && items.length > 0
      ? items.map((item, index) => {
          const fallback =
            FALLBACK_ABOUT_STORY[index % FALLBACK_ABOUT_STORY.length]

          return {
            id: item.id || fallback.id,
            heading: item.heading?.trim() || fallback.heading,
            body: item.body?.trim() || fallback.body,
            image: {
              src: item.image?.src?.trim() || fallback.image.src,
              alt: item.image?.alt?.trim() || fallback.image.alt,
            },
          }
        })
      : FALLBACK_ABOUT_STORY

  return (
    <section className="bg-[#FAFAFA] w-full flex flex-col">
      {displayItems.map((item, index) => {
        // Alternating layout: index 0 -> image left, index 1 -> image right
        const isImageLeft = index % 2 === 0

        return (
          <div 
            key={item.id}
            className="flex flex-col md:flex-row w-full"
          >
            {/* Image Column */}
            <div 
              className={`relative w-full md:w-1/2 min-h-[500px] md:min-h-[700px] lg:min-h-[800px] xl:min-h-[900px] overflow-hidden ${
                isImageLeft ? "md:order-1" : "md:order-2"
              } order-1`}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                quality={100}
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text Column */}
            <div 
              className={`w-full md:w-1/2 flex flex-col justify-center px-8 py-16 md:px-16 lg:px-24 xl:px-32 bg-[#FAFAFA] ${
                isImageLeft ? "md:order-2" : "md:order-1"
              } order-2`}
            >
              {/* Heading */}
              <h2
                className={`text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] mb-8 uppercase leading-tight ${montserrat.className}`}
              >
                {item.heading}
              </h2>

              {/* Body Paragraph */}
              <p
                className={`text-base md:text-lg text-gray-600 leading-relaxed md:leading-[1.8] text-justify ${inter.className}`}
              >
                {item.body}
              </p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
