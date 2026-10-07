"use client"

/**
 * Other Services Section
 * Shows related/other services for navigation
 */

import { ServiceCategory, getServiceImageBySlug } from "@lib/services-data"
import { inter, montserrat } from "@lib/fonts"
import ServiceCard from "@modules/services/components/service-card"

interface OtherServicesProps {
  services: ServiceCategory[]
  currentSlug: string
}

export default function OtherServices({
  services,
  currentSlug,
}: OtherServicesProps) {
  const otherServices = services
    .filter((s) => s.slug !== currentSlug)
    .slice(0, 4)

  if (otherServices.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-14">
          <h2
            className={`${montserrat.className} text-3xl md:text-5xl font-black tracking-[-0.04em] leading-[0.92] text-[#191b22]`}
          >
            Other Services
          </h2>
          <p
            className={`${inter.className} mt-3 text-base md:text-lg text-black/72`}
          >
            Explore more workshop services across SixthGear.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherServices.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              image={getServiceImageBySlug(service.slug, service.image)}
              href={`/services/${service.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
