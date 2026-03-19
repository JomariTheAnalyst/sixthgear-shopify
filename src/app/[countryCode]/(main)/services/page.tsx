import { Metadata } from "next"
import ServicesListTemplate from "@modules/services/templates"
import { getAllServices } from "@lib/strapi/services"
import { getAllServicesCMS, getServicesPage } from "@lib/cms/client"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Professional motorcycle services including maintenance, repairs, diagnostics, detailing, and performance upgrades. Expert care for your ride at Sixthgear.",
}

export default async function ServicesPage() {
  const [services, servicesPage, cmsServices] = await Promise.all([
    getAllServices(),
    getServicesPage(),
    getAllServicesCMS(),
  ])

  return (
    <ServicesListTemplate
      services={services}
      cmsServices={cmsServices}
      hero={servicesPage?.hero ?? null}
      expertiseStats={servicesPage?.expertiseStats ?? null}
      brandsWeService={servicesPage?.brandsWeService ?? null}
      servicesGrid={servicesPage?.servicesGrid ?? null}
    />
  )
}
