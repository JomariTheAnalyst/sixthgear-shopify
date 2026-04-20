import { Metadata } from "next"
import ServicesListTemplate from "@modules/services/templates"
import { getAllServices } from "@lib/strapi/services"
import { getAllServicesCMS, getServicesPage } from "@lib/cms/client"
import JsonLd from "@modules/common/components/json-ld"
import {
  getBreadcrumbStructuredData,
  getLocalizedCanonicalPath,
} from "@lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return {
    title: "Motorcycle Services & Workshop",
    description:
      "Book motorcycle maintenance, diagnostics, repairs, detailing, and upgrade work with the SixthgearMoto workshop.",
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/services"),
    },
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const [services, servicesPage, cmsServices] = await Promise.all([
    getAllServices(),
    getServicesPage(),
    getAllServicesCMS(),
  ])
  const breadcrumbStructuredData = getBreadcrumbStructuredData(countryCode, [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ])

  return (
    <>
      <JsonLd id="services-breadcrumbs" data={breadcrumbStructuredData} />
      <ServicesListTemplate
        services={services}
        cmsServices={cmsServices}
        hero={servicesPage?.hero ?? null}
        expertiseStats={servicesPage?.expertiseStats ?? null}
        brandsWeService={servicesPage?.brandsWeService ?? null}
        servicesGrid={servicesPage?.servicesGrid ?? null}
      />
    </>
  )
}
