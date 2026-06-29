"use client"

/**
 * Service Detail Template
 * Complete page template for individual service pages
 */

import { ServiceCategory } from "@lib/services-data"
import ServiceDetailHero from "@modules/services/components/service-detail-hero"
import ServiceItems from "../service-items"
import CTABanner from "@modules/home/components/cta-banner"
import OtherServices from "../other-services"
import ServiceLocalContent from "../service-local-content"

interface ServiceDetailTemplateProps {
  service: ServiceCategory
  otherServices: ServiceCategory[]
}

export default function ServiceDetailTemplate({
  service,
  otherServices,
}: ServiceDetailTemplateProps) {
  return (
    <>
      <ServiceDetailHero service={service} />
      <ServiceItems service={service} />
      <ServiceLocalContent service={service} />
      <OtherServices services={otherServices} currentSlug={service.slug} />
      <CTABanner/>
    </>
  )
}
