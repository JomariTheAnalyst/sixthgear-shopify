"use client"

/**
 * Service Detail Hero Section
 * Editorial hero for individual service pages
 */

import Image from "next/image"

import { inter, poppins } from "@lib/fonts"
import { ServiceCategory } from "@lib/services-data"

interface ServiceDetailHeroProps {
  service: ServiceCategory
}

export default function ServiceDetailHero({
  service,
}: ServiceDetailHeroProps) {
  const heroImage =
    service.heroImage || service.image || "/images/homepage/services/hero.png"
  const serviceItems = service.items.filter(Boolean)
  const leadingItems = serviceItems.slice(0, 4)
  const supportingItems = serviceItems.slice(4, 8)
  const primaryParagraph = [
    service.description?.trim(),
    leadingItems.length > 0
      ? `The service scope typically includes ${leadingItems.join(", ").toLowerCase()}, with each item assessed in relation to the motorcycle's condition, mileage, and actual workshop requirements.`
      : null,
  ]
    .filter(Boolean)
    .join(" ")
  const secondaryParagraph =
    supportingItems.length > 0
      ? `Where the inspection shows it is necessary, the work may also extend to ${supportingItems.join(", ").toLowerCase()}. The objective is to complete the service with a clear and practical scope, address the items that materially affect reliability and safety, and avoid adding unnecessary work that does not contribute to the outcome of the motorcycle.`
      : `The work is carried out with a practical service-first approach, focusing on the items that directly affect performance, reliability, and riding condition so the final scope remains relevant to what the motorcycle actually needs.`

  return (
    <section className="bg-white pt-12 pb-10 md:pt-16 md:pb-14 lg:pt-20 lg:pb-16">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-8 max-w-6xl md:mb-10 lg:mb-12">
          <h1
            className={`${poppins.className} text-[2.5rem] font-bold leading-[0.96] tracking-[-0.05em] text-black sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem]`}
          >
            {service.title}
          </h1>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 sm:aspect-[16/9] lg:aspect-[2.15/1]">
          <Image
            src={heroImage}
            alt={service.title}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        <div className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-2 md:gap-10 md:pt-10 lg:gap-14 lg:pt-12">
          <p
            className={`${inter.className} text-sm leading-7 text-gray-700 md:text-[15px] lg:text-base`}
          >
            {primaryParagraph}
          </p>
          <p
            className={`${inter.className} text-sm leading-7 text-gray-700 md:text-[15px] lg:text-base`}
          >
            {secondaryParagraph}
          </p>
        </div>
      </div>
    </section>
  )
}
