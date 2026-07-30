"use client"

import { useParams } from "next/navigation"
import CTABanner from "@modules/home/components/cta-banner"
import ServiceHero from "@modules/services/components/service-hero"
import BrandsWeService from "@modules/services/components/brands-we-service"
import ExpertiseStats from "@modules/services/components/expertise-stats"
import ModernServicesGrid from "@modules/services/components/modern-services-grid"
import ProcessOfWork from "@modules/services/components/process-of-work"
import ServicesGallery from "@modules/services/components/services-gallery"
import type { ServicesPageContent } from "@lib/cms/services-page-content"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"

interface ServicesListTemplateProps {
  content: ServicesPageContent
}

function sectionPath(
  source: "sanity" | "fallback",
  path: string
): string {
  return source === "sanity" ? path : `${path}.useSanityContent`
}

export default function ServicesListTemplate({
  content,
}: ServicesListTemplateProps) {
  const params = useParams()
  const countryCode = params?.countryCode as string

  return (
    <>
      <SanityEditTarget
        documentId="servicesPage"
        documentType="servicesPage"
        path={sectionPath(content.hero.source, "hero")}
      >
        <ServiceHero content={content.hero} />
      </SanityEditTarget>

      <SanityEditTarget
        documentId="servicesPage"
        documentType="servicesPage"
        path={sectionPath(content.expertiseStats.source, "expertiseStats")}
      >
        <ExpertiseStats
          countryCode={countryCode}
          content={content.expertiseStats}
        />
      </SanityEditTarget>

      <SanityEditTarget
        documentId="servicesPage"
        documentType="servicesPage"
        path={sectionPath(content.brandsWeService.source, "brandsWeService")}
      >
        <BrandsWeService content={content.brandsWeService} />
      </SanityEditTarget>

      <SanityEditTarget
        documentId="servicesPage"
        documentType="servicesPage"
        path={sectionPath(content.servicesGrid.source, "servicesGrid")}
      >
        <ModernServicesGrid
          countryCode={countryCode}
          content={content.servicesGrid}
        />
      </SanityEditTarget>

      <SanityEditTarget
        documentId="servicesPage"
        documentType="servicesPage"
        path={sectionPath(content.processOfWork.source, "processOfWork")}
      >
        <ProcessOfWork content={content.processOfWork} />
      </SanityEditTarget>

      <SanityEditTarget
        documentId="servicesPage"
        documentType="servicesPage"
        path={sectionPath(content.servicesGallery.source, "servicesGallery")}
      >
        <ServicesGallery content={content.servicesGallery} />
      </SanityEditTarget>

      <SanityEditTarget
        documentId="servicesPage"
        documentType="servicesPage"
        path={sectionPath(content.ctaBanner.source, "ctaBanner")}
      >
        <CTABanner {...content.ctaBanner} />
      </SanityEditTarget>
    </>
  )
}
