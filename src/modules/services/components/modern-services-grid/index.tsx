"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { SanityService, SanityServicesGrid } from "@lib/cms/types"
import { ServiceCategory } from "@lib/services-data"
import { TextRoll } from "components/ui/text-roll"
import { getServiceIcon } from "@modules/services/lib/icon-map"

type GridService = {
  title: string
  description: string
  slug: string
  icon: ReactNode
}

const HARDCODED_SERVICES = [
  {
    title: "Service & Preventive Maintenance",
    description:
      "Keep your motorcycle running at peak performance with comprehensive periodic maintenance and seasonal care.",
    iconKey: "wrench",
    slug: "preventive-maintenance",
  },
  {
    title: "Repairs & Diagnostics",
    description:
      "Advanced diagnostic equipment and expert technicians to identify and fix any issue with precision.",
    iconKey: "diagnostics",
    slug: "repairs-diagnostics",
  },
  {
    title: "Accessories & Custom Setup",
    description:
      "Transform your ride with professional accessory installation, lighting upgrades, and luggage systems.",
    iconKey: "accessories",
    slug: "accessories-installation",
  },
  {
    title: "Wheels & Drivetrain",
    description:
      "Expert care for your wheels and drivetrain. Proper alignment and balanced wheels for the ultimate ride.",
    iconKey: "tire",
    slug: "wheels-drivetrain",
  },
  {
    title: "Detailing & Protection",
    description:
      "Keep your motorcycle looking showroom-fresh with our professional detailing and ceramic coating.",
    iconKey: "detailing",
    slug: "detailing-protection",
  },
  {
    title: "Performance Upgrades",
    description:
      "Unlock your motorcycle's full potential with performance upgrades, exhaust systems, and tuning.",
    iconKey: "upgrade",
    slug: "performance-upgrades",
  },
  {
    title: "Roadside Assistance & Recovery",
    description:
      "Stranded on the road? Our emergency recovery team is ready to help. Fast response times and professional handling of your motorcycle.",
    iconKey: "recovery",
    slug: "roadside-assistance",
  },
  {
    title: "Rider Support & Convenience",
    description:
      "Beyond repairs, we offer comprehensive rider support services. From pre-purchase inspections to warranty assistance, we've got you covered.",
    iconKey: "support",
    slug: "rider-support",
  },
] as const

export const FALLBACK_SERVICES_GRID = {
  sectionHeading: "Complete care for your ride",
} as const

type ModernServicesGridProps = {
  countryCode: string
  services?: ServiceCategory[]
  data?: SanityServicesGrid | null
  cmsServices?: SanityService[] | null
  useCustomServices?: boolean | null
  featuredServices?: SanityService[] | null
}

export default function ModernServicesGrid({
  countryCode,
  services,
  data,
  cmsServices,
  useCustomServices,
  featuredServices,
}: ModernServicesGridProps) {
  const activeSectionHeading =
    data?.sectionHeading?.trim() || FALLBACK_SERVICES_GRID.sectionHeading

  const localServiceIconKeys: Record<string, string> = {
    "preventive-maintenance": "wrench",
    "repairs-diagnostics": "diagnostics",
    "accessories-installation": "accessories",
    "wheels-drivetrain": "tire",
    "detailing-protection": "detailing",
    "performance-upgrades": "upgrade",
    "roadside-assistance": "recovery",
    "rider-support": "support",
  }

  const localServicesOrFallback: GridService[] =
    services && services.length > 0
      ? services.map((service) => ({
          title: service.title,
          description: service.shortDescription ?? service.description,
          slug: service.slug,
          icon: getServiceIcon(localServiceIconKeys[service.slug] ?? "wrench"),
        }))
      : HARDCODED_SERVICES.map((service) => ({
          title: service.title,
          description: service.description,
          slug: service.slug,
          icon: getServiceIcon(service.iconKey),
        }))

  const activeServices = (() => {
    if (useCustomServices && featuredServices?.length) {
      return featuredServices.map((service) => ({
        title: service.title ?? "",
        description: service.shortDescription ?? "",
        slug: service.slug ?? "",
        icon: getServiceIcon(service.icon),
      }))
    }

    if (cmsServices?.length) {
      return cmsServices.map((service) => ({
        title: service.title ?? "",
        description: service.shortDescription ?? "",
        slug: service.slug ?? "",
        icon: getServiceIcon(service.icon),
      }))
    }

    return localServicesOrFallback
  })()

  return (
    <section className="bg-white py-24 md:py-32 w-full">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="text-center md:text-left mb-16 md:mb-20">
          <h2
            className="text-[2.5rem] md:text-5xl lg:text-6xl text-[#111] leading-[1.1] tracking-[-0.03em] font-semibold"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            {activeSectionHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service, index) => (
            <Link
              key={index}
              href={`/${countryCode}/services/${service.slug}`}
              className="group flex flex-col bg-[#F9F9F9] rounded-[1.5rem] p-8 lg:p-10 transition-colors duration-300 hover:bg-[#F2F2F2] h-full"
            >
              <div className="text-[#111] mb-8">{service.icon}</div>

              <h3
                className="text-xl md:text-[22px] text-[#111] leading-[1.2] font-semibold mb-4"
                style={{
                  fontFamily: "'Inter Display', sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                {service.title}
              </h3>

              <p
                className="text-[#111]/70 text-[15px] md:text-base leading-relaxed mb-10 flex-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {service.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-[#111] font-medium text-sm md:text-base">
                <TextRoll
                  className="font-semibold"
                  transition={{ duration: 0.3 }}
                >
                  Learn More
                </TextRoll>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
