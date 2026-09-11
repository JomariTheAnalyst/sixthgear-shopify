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
  const title = "Services"
  const description =
    "Book motorcycle PMS, diagnostics, repairs, oil change, detailing, accessories installation, performance upgrades, towing, and rider support with SixthgearMoto in Makati."

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/services"),
    },
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
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
  const statementStats = {
    categoryCount: services.length,
    brandCount: content.brandsWeService.brands.length,
    optionCount: services.reduce(
      (total, service) => total + service.items.length,
      0
    ),
  }

  return (
    <>
      <JsonLd id="services-breadcrumbs" data={breadcrumbStructuredData} />
      <ServicesListTemplate
        content={content}
        statementStats={statementStats}
      />
    </>
  )
}
