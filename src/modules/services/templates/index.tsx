"use client"

/**
 * Services List Template
 * Main services page showing all service categories with tilted landscape cards
 */

import { useParams } from "next/navigation"
import { ServiceCategory } from "@lib/services-data"
import {
  SanityService,
  SanityServicesBrandsWeService,
  SanityServicesExpertiseStats,
  SanityServicesGrid,
  SanityServicesHero,
} from "@lib/cms/types"
import CTABanner from "@modules/home/components/cta-banner"
import ServiceHero from "@modules/services/components/service-hero"
import BrandsWeService from "@modules/services/components/brands-we-service"
import ExpertiseStats from "@modules/services/components/expertise-stats"
import ModernServicesGrid from "@modules/services/components/modern-services-grid"
import ProcessOfWork from "@modules/services/components/process-of-work"
import ServicesGallery from "@modules/services/components/services-gallery"

export const FALLBACK_SERVICES_HERO: ServiceCategory = {
  id: "services-main",
  slug: "services",
  title: "Our Services",
  shortTitle: "Services",
  description:
    "Complete motorcycle care from routine maintenance to performance upgrades. Expert technicians, quality parts, and attention to detail.",
  image: "/images/homepage/services/hero.png",
  heroImage: "/images/homepage/services/hero3.png",
  items: [],
}

interface ServicesListTemplateProps {
  services: ServiceCategory[]
  cmsServices?: SanityService[] | null
  hero?: SanityServicesHero | null
  expertiseStats?: SanityServicesExpertiseStats | null
  brandsWeService?: SanityServicesBrandsWeService | null
  servicesGrid?: SanityServicesGrid | null
}

export default function ServicesListTemplate({
  services,
  cmsServices,
  hero,
  expertiseStats,
  brandsWeService,
  servicesGrid,
}: ServicesListTemplateProps) {
  const params = useParams()
  const countryCode = params?.countryCode as string
  const activeHero: ServiceCategory = {
    ...FALLBACK_SERVICES_HERO,
    title: hero?.title?.trim() || FALLBACK_SERVICES_HERO.title,
    shortTitle:
      hero?.shortTitle?.trim() || FALLBACK_SERVICES_HERO.shortTitle,
    description:
      hero?.description?.trim() || FALLBACK_SERVICES_HERO.description,
    heroImage: hero?.heroImageUrl || FALLBACK_SERVICES_HERO.heroImage,
    image: hero?.imageUrl || FALLBACK_SERVICES_HERO.image,
  }

  return (
    <>
      <ServiceHero service={activeHero} />

      <ExpertiseStats countryCode={countryCode} data={expertiseStats} />

      <BrandsWeService data={brandsWeService} />

      <ModernServicesGrid
        countryCode={countryCode}
        services={services}
        data={servicesGrid}
        cmsServices={cmsServices}
        useCustomServices={servicesGrid?.useCustomServices ?? false}
        featuredServices={servicesGrid?.featuredServices ?? null}
      />

      <ProcessOfWork />

      <ServicesGallery />

      <CTABanner />
    </>
  )
}
