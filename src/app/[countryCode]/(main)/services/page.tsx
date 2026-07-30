import { Metadata } from "next"
import ServicesListTemplate from "@modules/services/templates"
import { getAllServices } from "@lib/strapi/services"
import { getAllServicesCMS, getServicesPage } from "@lib/cms/client"
import JsonLd from "@modules/common/components/json-ld"
import {
  getBreadcrumbStructuredData,
  getLocalizedCanonicalPath,
  getNoindexFollowRobots,
  hasNonCanonicalSearchParams,
} from "@lib/seo"
import { selectServicesPageContent } from "@lib/cms/services-page-content"

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { countryCode } = await params
  const rawSearchParams = await searchParams
  const shouldNoindex = hasNonCanonicalSearchParams(rawSearchParams, {
    allowPaginationParams: true,
  })

  return {
    title: "Motorcycle Services in Makati Philippines",
    description:
      "Book motorcycle PMS, diagnostics, repairs, oil change, detailing, accessories installation, performance upgrades, towing, and rider support with SixthgearMoto in Makati.",
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/services"),
    },
    ...(shouldNoindex ? { robots: getNoindexFollowRobots() } : {}),
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
  const content = selectServicesPageContent(
    servicesPage,
    services,
    cmsServices
  )

  return (
    <>
      <JsonLd id="services-breadcrumbs" data={breadcrumbStructuredData} />
      <ServicesListTemplate
        content={content}
      />
    </>
  )
}
