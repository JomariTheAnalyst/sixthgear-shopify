"use client"

import { useParams } from "next/navigation"

import type {
  SanityServiceItem,
  SanityServicesSection,
} from "@lib/cms/types"
import { cleanSanityString } from "@lib/cms/visual-editing"
import { getServiceImageBySlug } from "@lib/services-data"
import ServicesWorkList from "./services-work-list"

const HOMEPAGE_SERVICE_IMAGE_BY_SLUG: Record<string, string> = {
  "preventive-maintenance":
    "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778639882/serviceandpreventivemaintenance_ckrly1.jpg",
  "repairs-diagnostics":
    "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778639485/repairs_and_diagnostic_z7gvpa.png",
  "accessories-installation":
    "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778640168/accessories_and_custom_installation_psnedz.png",
  "wheels-drivetrain":
    "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778573627/wheels_drivetrain_abxtde.png",
  "detailing-protection":
    "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778573628/detailing_and_care_protection_tt6ggk.png",
  "performance-upgrades":
    "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778573624/Performance_Upgrade_Services_bn1tpn.png",
  "roadside-assistance":
    "https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778649362/hauling_service_gqbzva.jpg",
}

function getHomepageServiceImage(slug?: string | null, fallback?: string | null) {
  if (slug && HOMEPAGE_SERVICE_IMAGE_BY_SLUG[slug]) {
    return HOMEPAGE_SERVICE_IMAGE_BY_SLUG[slug]
  }

  return getServiceImageBySlug(slug || "", fallback || undefined)
}

export const FALLBACK_SERVICES_SECTION: SanityServicesSection = {
  useCustomServices: false,
  sectionTitle: "Motorcycle Services",
  sectionDescription: "Workshop care, repairs, upgrades, and rider support.",
  services: [
    {
      title: "Service & Preventive Maintenance",
      description:
        "Scheduled servicing, PMS, and inspections to keep your motorcycle reliable, safe, and ready for daily rides or long journeys.",
      image: getHomepageServiceImage("preventive-maintenance"),
      slug: "preventive-maintenance",
      link: null,
    },
    {
      title: "Repairs & Diagnostics",
      description:
        "Accurate troubleshooting and professional repairs using proper tools, experience, and diagnostics for dependable motorcycle performance.",
      image: getHomepageServiceImage("repairs-diagnostics"),
      slug: "repairs-diagnostics",
      link: null,
    },
    {
      title: "Accessories & Custom Installation",
      description:
        "Professional installation of accessories, electronics, protection, and touring upgrades, ensuring correct fitment, safety, and clean integration.",
      image: getHomepageServiceImage("accessories-installation"),
      slug: "accessories-installation",
      link: null,
    },
    {
      title: "Wheels, Drivetrain & Handling",
      description:
        "Tyres, chains, sprockets, and handling components serviced and aligned for stability, control, and confident riding.",
      image: getHomepageServiceImage("wheels-drivetrain"),
      slug: "wheels-drivetrain",
      link: null,
    },
    {
      title: "Detailing, Care & Protection",
      description:
        "Thorough cleaning, detailing, and protective treatments to restore, preserve, and enhance your motorcycle's appearance and condition.",
      image: getHomepageServiceImage("detailing-protection"),
      slug: "detailing-protection",
      link: null,
    },
    {
      title: "Performance & Upgrade Services",
      description:
        "Carefully selected performance upgrades and tuning support to improve power delivery, efficiency, and overall riding experience.",
      image: getHomepageServiceImage("performance-upgrades"),
      slug: "performance-upgrades",
      link: null,
    },
    {
      title: "Roadside Assistance & Recovery",
      description:
        "Emergency motorcycle towing, rescue, and recovery services to get you and your bike to safety when needed.",
      image: getHomepageServiceImage("roadside-assistance"),
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
      getHomepageServiceImage(
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

  const servicesIndexHref = countryCode
    ? `/${countryCode}/services`
    : "/services"
  const workListServices = content.cards.map((service, index) => {
    const fallbackService = fallbackCards[index]
    const cleanSlug = service.slug ? cleanSanityString(service.slug) : null
    const href =
      (service.link ? cleanSanityString(service.link) : null) ||
      (cleanSlug
        ? countryCode
          ? `/${countryCode}/services/${encodeURIComponent(cleanSlug)}`
          : `/services/${encodeURIComponent(cleanSlug)}`
        : servicesIndexHref)

    return {
      key:
        cleanSlug ||
        service._key ||
        fallbackService?._key ||
        `service-${index}`,
      title: service.title,
      description: service.description,
      image: service.image,
      href: cleanSanityString(href),
      slug: cleanSlug,
    }
  })

  return (
    <ServicesWorkList
      title={content.title}
      description={content.description}
      services={workListServices}
    />
  )
}
