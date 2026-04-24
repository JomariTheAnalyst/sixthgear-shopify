"use client"

import { useRef } from "react"
import { useParams } from "next/navigation"

import type {
  SanityServiceItem,
  SanityServicesSection,
} from "@lib/cms/types"
import { getServiceImageBySlug } from "@lib/services-data"
import { inter, montserrat } from "@lib/fonts"
import ServiceCard from "@modules/services/components/service-card"

export const FALLBACK_SERVICES_SECTION: SanityServicesSection = {
  useCustomServices: false,
  sectionTitle: "Motorcycle Services",
  sectionDescription: "Workshop care, repairs, upgrades, and rider support.",
  services: [
    {
      title: "Service & Preventive Maintenance",
      description:
        "Scheduled servicing, PMS, and inspections to keep your motorcycle reliable, safe, and ready for daily rides or long journeys.",
      image: getServiceImageBySlug("preventive-maintenance"),
      slug: "preventive-maintenance",
      link: null,
    },
    {
      title: "Repairs & Diagnostics",
      description:
        "Accurate troubleshooting and professional repairs using proper tools, experience, and diagnostics for dependable motorcycle performance.",
      image: getServiceImageBySlug("repairs-diagnostics"),
      slug: "repairs-diagnostics",
      link: null,
    },
    {
      title: "Accessories & Custom Installation",
      description:
        "Professional installation of accessories, electronics, protection, and touring upgrades, ensuring correct fitment, safety, and clean integration.",
      image: getServiceImageBySlug("accessories-installation"),
      slug: "accessories-installation",
      link: null,
    },
    {
      title: "Wheels, Drivetrain & Handling",
      description:
        "Tyres, chains, sprockets, and handling components serviced and aligned for stability, control, and confident riding.",
      image: getServiceImageBySlug("wheels-drivetrain"),
      slug: "wheels-drivetrain",
      link: null,
    },
    {
      title: "Detailing, Care & Protection",
      description:
        "Thorough cleaning, detailing, and protective treatments to restore, preserve, and enhance your motorcycle's appearance and condition.",
      image: getServiceImageBySlug("detailing-protection"),
      slug: "detailing-protection",
      link: null,
    },
    {
      title: "Performance & Upgrade Services",
      description:
        "Carefully selected performance upgrades and tuning support to improve power delivery, efficiency, and overall riding experience.",
      image: getServiceImageBySlug("performance-upgrades"),
      slug: "performance-upgrades",
      link: null,
    },
    {
      title: "Roadside Assistance & Recovery",
      description:
        "Emergency motorcycle towing, rescue, and recovery services to get you and your bike to safety when needed.",
      image: getServiceImageBySlug("roadside-assistance"),
      slug: "roadside-assistance",
      link: null,
    },
    {
      title: "Rider Support & Convenience",
      description:
        "Consultation, inspections, and after-service support designed to help riders make informed decisions and ride with confidence.",
      image: getServiceImageBySlug("rider-support"),
      slug: "rider-support",
      link: null,
    },
  ],
}

type LegacyServiceItem = {
  _key?: string | null
  title?: string | null
  description?: string | null
  image?: string | null
  slug?: string | null
  link?: string | null
}

type ResolvedServiceCard = {
  _key?: string | null
  title: string
  description: string
  image: string
  slug?: string | null
  link?: string | null
}

interface OurServicesProps {
  data?: SanityServicesSection | null
  sectionTitle?: string
  sectionDescription?: string
  services?: LegacyServiceItem[]
}

function mergeServiceItem(
  source: SanityServiceItem | LegacyServiceItem,
  fallbackService?: SanityServiceItem | null
): ResolvedServiceCard {
  return {
    _key: source._key ?? fallbackService?._key ?? null,
    title: source.title || fallbackService?.title || "Untitled Service",
    description:
      source.description ||
      fallbackService?.description ||
      "Service details coming soon.",
    image:
      getServiceImageBySlug(
        source.slug || fallbackService?.slug || "",
        source.image || undefined
      ) ||
      fallbackService?.image ||
      "/images/services/service1.png",
    slug: source.slug || fallbackService?.slug || null,
    link: source.link || fallbackService?.link || null,
  }
}

export default function OurServices({
  data,
  sectionTitle,
  sectionDescription,
  services,
}: OurServicesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const countryCode =
    typeof params?.countryCode === "string" ? params.countryCode : null

  const isCMSDisabled = data?.useCustomServices === false
  const fallbackCards = FALLBACK_SERVICES_SECTION.services || []
  const legacyCards = services || []
  const cmsCards = data?.services || []

  const content = isCMSDisabled
    ? {
        title:
          sectionTitle ||
          FALLBACK_SERVICES_SECTION.sectionTitle ||
          "Motorcycle Services",
        description:
          sectionDescription ||
          FALLBACK_SERVICES_SECTION.sectionDescription ||
          "Bike Repair & Maintenance Services",
        cards:
          legacyCards.length > 0
            ? legacyCards.map((service, index) =>
                mergeServiceItem(service, fallbackCards[index])
              )
            : fallbackCards.map((service) => mergeServiceItem(service, service)),
      }
    : data
    ? {
        title:
          data.sectionTitle ||
          sectionTitle ||
          FALLBACK_SERVICES_SECTION.sectionTitle ||
          "Motorcycle Services",
        description:
          data.sectionDescription ||
          sectionDescription ||
          FALLBACK_SERVICES_SECTION.sectionDescription ||
          "Bike Repair & Maintenance Services",
        cards:
          cmsCards.length > 0
            ? cmsCards.map((service, index) =>
                mergeServiceItem(service, fallbackCards[index])
              )
            : fallbackCards.map((service) => mergeServiceItem(service, service)),
      }
    : {
        title:
          FALLBACK_SERVICES_SECTION.sectionTitle ||
          "Motorcycle Services",
        description:
          FALLBACK_SERVICES_SECTION.sectionDescription ||
          "Bike Repair & Maintenance Services",
        cards: fallbackCards.map((service) => mergeServiceItem(service, service)),
      }

  if (content.cards.length === 0) {
    return null
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="mb-10 md:mb-14 lg:mb-16">
          <div className="mx-auto w-full max-w-[1200px] text-center">
            <h2
              className={`${montserrat.className} whitespace-nowrap text-[clamp(2.5rem,6.6vw,6.5rem)] font-black leading-[0.9] tracking-[-0.05em] text-[#191b22] mb-3 md:mb-4`}
            >
              {content.title}
            </h2>
            <p
              className={`${inter.className} mx-auto max-w-[860px] text-lg md:text-[28px] lg:text-[34px] leading-[1.1] tracking-[-0.03em] text-black/88`}
            >
              {content.description}
            </p>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {content.cards.map((service, index) => {
            const fallbackService = fallbackCards[index]
            const linkHref =
              service.link ||
              (service.slug
                ? countryCode
                  ? `/${countryCode}/services/${service.slug}`
                  : `/services/${service.slug}`
                : "#")
            const isClickable = !!(service.link || service.slug)
            const cardKey =
              service.slug ||
              service._key ||
              fallbackService?._key ||
              `service-${index}`

            return (
              <ServiceCard
                key={cardKey}
                title={service.title}
                description={service.description}
                image={service.image}
                href={isClickable ? linkHref : null}
                className="relative flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-[350px] lg:w-[400px] h-[400px] md:h-[450px] lg:h-[500px] snap-center"
              />
            )
          })}
        </div>

        <div className="flex justify-center gap-3 mt-6 md:mt-8">
          <button
            onClick={() => scroll("left")}
            className="w-12 h-12 flex items-center justify-center bg-[#FF5000] hover:bg-[#e54800] text-white transition-all duration-300 active:scale-95"
            aria-label="Previous services"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-12 h-12 flex items-center justify-center bg-[#FF5000] hover:bg-[#e54800] text-white transition-all duration-300 active:scale-95"
            aria-label="Next services"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
