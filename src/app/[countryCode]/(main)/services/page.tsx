import { Metadata } from "next"
import ServicesListTemplate from "@modules/services/templates"
import { getAllServices } from "@lib/strapi/services"
import { getAllServicesCMS, getServicesPage } from "@lib/cms/client"
import JsonLd from "@modules/common/components/json-ld"
import {
  getBreadcrumbStructuredData,
  getCanonicalPath,
  getOpenGraph,
} from "@lib/seo"
import { selectServicesPageContent } from "@lib/cms/services-page-content"

export async function generateMetadata(): Promise<Metadata> {
  const title = "Motorcycle Services"
  const description =
    "Motorcycle PMS, repairs, detailing, upgrades and towing at our Makati workshop."

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalPath("/services"),
    },
    openGraph: getOpenGraph({ title, description, path: "/services" }),
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function ServicesPage() {
  const [services, servicesPage, cmsServices] = await Promise.all([
    getAllServices(),
    getServicesPage(),
    getAllServicesCMS(),
  ])
  const breadcrumbStructuredData = getBreadcrumbStructuredData([
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
