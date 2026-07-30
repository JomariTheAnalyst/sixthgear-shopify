"use client"

import React from "react"
import Image from "next/image"
import { inter, montserrat } from "@lib/fonts"
import type { AboutStorySectionContent } from "@lib/cms/about-page-main"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

export interface AboutStoryProps {
  content: AboutStorySectionContent
}

export default function AboutStory({ content }: AboutStoryProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"

  return (
    <section className="bg-[#FAFAFA] w-full flex flex-col">
      {content.items.map((item, index) => {
        const isImageLeft = index % 2 === 0

        return (
          <div
            key={item.key}
            data-sanity={
              sanitySource
                ? createSanityDataAttribute(visualEditingEnabled, {
                    documentId: "aboutPage",
                    documentType: "aboutPage",
                    path: keyedSanityPath("ourStory.items", item.key),
                  })
                : undefined
            }
            className="flex flex-col md:flex-row w-full"
          >
            <div
              className={`relative w-full md:w-1/2 min-h-[500px] md:min-h-[700px] lg:min-h-[800px] xl:min-h-[900px] overflow-hidden ${
                isImageLeft ? "md:order-1" : "md:order-2"
              } order-1`}
            >
              <Image
                src={item.imageUrl}
                alt={item.imageAlt}
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "aboutPage",
                        documentType: "aboutPage",
                        path: `${keyedSanityPath("ourStory.items", item.key)}.image`,
                      })
                    : undefined
                }
                fill
                quality={100}
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div
              className={`w-full md:w-1/2 flex flex-col justify-center px-8 py-16 md:px-16 lg:px-24 xl:px-32 bg-[#FAFAFA] ${
                isImageLeft ? "md:order-2" : "md:order-1"
              } order-2`}
            >
              <h2
                className={`text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] mb-8 uppercase leading-tight ${montserrat.className}`}
              >
                {item.heading}
              </h2>
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
