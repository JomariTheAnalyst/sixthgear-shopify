"use client"

import { useParams } from "next/navigation"
import CTABanner from "@modules/home/components/cta-banner"
import ServiceHero from "@modules/services/components/service-hero"
import ServicesStatementStats, {
  type ServicesStatementStatsData,
} from "@modules/services/components/services-statement-stats"
import ModernServicesGrid from "@modules/services/components/modern-services-grid"
import ServicesBookingCta from "@modules/services/components/services-booking-cta"
import ProcessOfWork from "@modules/services/components/process-of-work"
import ServicesFaqs from "@modules/services/components/services-faqs"
import type { ServicesPageContent } from "@lib/cms/services-page-content"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"

interface ServicesListTemplateProps {
  content: ServicesPageContent
  statementStats: ServicesStatementStatsData
}

function sectionPath(
  source: "sanity" | "fallback",
  path: string
): string {
  return source === "sanity" ? path : `${path}.useSanityContent`
}

export default function ServicesListTemplate({
  content,
  statementStats,
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

      <ServicesStatementStats stats={statementStats} />

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

      <ServicesBookingCta />

      <SanityEditTarget
        documentId="servicesPage"
        documentType="servicesPage"
        path={sectionPath(content.processOfWork.source, "processOfWork")}
      >
        <ProcessOfWork content={content.processOfWork} />
      </SanityEditTarget>

      <ServicesFaqs />

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
