"use client"

import Link from "next/link"
import Image from "next/image"

import { inter, montserrat } from "@lib/fonts"
import type { ServicesExpertiseContent } from "@lib/cms/services-page-content"
import {
  createSanityDataAttribute,
  keyedSanityPath,
} from "@lib/cms/visual-editing"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

type ExpertiseStatsProps = {
  countryCode: string
  content: ServicesExpertiseContent
}

export default function ExpertiseStats({
  countryCode,
  content,
}: ExpertiseStatsProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const sanitySource = content.source === "sanity"
  const normalizedButtonLink = content.assistance.buttonLink.trim()
  const buttonHref = /^https?:\/\//i.test(normalizedButtonLink)
    ? normalizedButtonLink
    : normalizedButtonLink.startsWith("/")
      ? normalizedButtonLink
      : `/${normalizedButtonLink}`

  return (
    <section className="w-full bg-white py-16 md:py-24 lg:py-28">
      <div className="mx-auto grid min-h-[560px] max-w-[1440px] gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20 xl:px-12">
        <div className="flex flex-col justify-center gap-9 lg:gap-11">
          <article>
            <h2
              className={`${montserrat.className} truncate text-[1.25rem] font-black leading-none tracking-[-0.035em] text-black md:text-[1.65rem]`}
              title={content.heading}
            >
              {content.heading}
            </h2>
            <p
              className={`${inter.className} mt-3 max-w-[720px] text-sm font-normal leading-[1.6] text-black/58 md:text-base`}
            >
              {content.description}
            </p>
          </article>

          <div className="space-y-8 md:space-y-10">
            {content.highlights.map((item) => (
              <article
                key={item.key}
                data-sanity={
                  sanitySource
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: "servicesPage",
                        documentType: "servicesPage",
                        path: keyedSanityPath(
                          "expertiseStats.highlights",
                          item.key
                        ),
                      })
                    : undefined
                }
              >
                <h3
                  className={`${montserrat.className} truncate text-[1.25rem] font-black leading-none tracking-[-0.035em] text-black md:text-[1.65rem]`}
                  title={item.title}
                >
                  {item.title}
                </h3>
                <p
                  className={`${inter.className} mt-3 max-w-[720px] text-sm font-normal leading-[1.6] text-black/58 md:text-base`}
                >
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-black md:min-h-[560px]">
          <Image
            src={content.backgroundImage}
            alt={content.backgroundImageAlt}
            data-sanity={
              sanitySource
                ? createSanityDataAttribute(visualEditingEnabled, {
                    documentId: "servicesPage",
                    documentType: "servicesPage",
                    path: "expertiseStats.backgroundImage",
                  })
                : undefined
            }
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8 lg:p-10">
            <div className="max-w-[430px]">
              <p
                className={`${montserrat.className} text-[1.55rem] font-black leading-none tracking-[-0.035em] text-white md:text-[1.9rem]`}
              >
                {content.assistance.heading}
              </p>
              {/* <p
                className={`${montserrat.className} mt-4 truncate text-[2.15rem] font-black leading-none tracking-[-0.05em] text-white md:text-[3rem]`}
              >
                {content.assistance.phone}
              </p> */}
              <p
                className={`${inter.className} mt-5 text-sm font-medium leading-[1.65] text-white md:text-base`}
              >
                {content.assistance.description}
              </p>
              <Link
                href={buttonHref}
                className={`${inter.className} mt-7 inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#F16D34] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]`}
              >
                {content.assistance.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
