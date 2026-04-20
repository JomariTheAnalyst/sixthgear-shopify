import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllServicesCMS } from "@lib/cms/client"
import { getService, getAllServiceSlugs } from "@lib/strapi/services"
import { getServiceDetailData } from "@lib/data/service-detail"
import JsonLd from "@modules/common/components/json-ld"
import ServiceDetailTemplate from "@modules/services/templates/service-detail"
import {
  getBreadcrumbStructuredData,
  getLocalizedCanonicalPath,
} from "@lib/seo"

interface ServicePageProps {
  params: Promise<{
    countryCode: string
    slug: string
  }>
}

// Use dynamic rendering with ISR for CMS-driven content
// This prevents build failures when new services are added to Strapi
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  try {
    const [cmsServices, localSlugs] = await Promise.all([
      getAllServicesCMS(),
      getAllServiceSlugs(),
    ])

    const cmsSlugs = cmsServices
      .map((service) => service.slug)
      .filter((slug): slug is string => Boolean(slug))

    const uniqueSlugs = Array.from(new Set([...localSlugs, ...cmsSlugs]))
    const countryCodes = ["ph", "us", "sg", "my"]

    return countryCodes.flatMap((countryCode) =>
      uniqueSlugs.map((slug) => ({
        countryCode,
        slug,
      }))
    )
  } catch (error) {
    console.error(error)
    return []
  }
}

// OPTIONAL: If you want static generation, uncomment this and comment out dynamic/revalidate above
// But this requires all slugs to exist at build time
/*
export async function generateStaticParams() {
  try {
    const slugs = await getAllServiceSlugs()
    const countryCodes = ["ph", "us", "sg", "my"] // Add all supported country codes
    
    // Generate all combinations of countryCode and slug
    const params = countryCodes.flatMap((countryCode) =>
      slugs.map((slug) => ({
        countryCode,
        slug,
      }))
    )
    
    return params
  } catch (error) {
    console.error(error)
    // Return empty array to allow dynamic rendering as fallback
    return []
  }
}
*/

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  try {
    const { slug, countryCode } = await params
    const service = await getService(slug)

    if (!service) {
      return {
        title: "Service Not Found",
        description: "The requested service could not be found.",
      }
    }

    return {
      title: service.title,
      description: service.description || service.title,
      alternates: {
        canonical: getLocalizedCanonicalPath(countryCode, `/services/${slug}`),
      },
    }
  } catch (error) {
    console.error(error)
    return {
      title: "Service",
      description: "Sixthgear Moto Supply Services",
    }
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  try {
    const { slug, countryCode } = await params

    const data = await getServiceDetailData(slug)

    if (!data) {
      notFound()
    }
    const breadcrumbStructuredData = getBreadcrumbStructuredData(countryCode, [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: data.service.title, path: `/services/${slug}` },
    ])

    return (
      <>
        <JsonLd id="service-breadcrumbs" data={breadcrumbStructuredData} />
        <ServiceDetailTemplate
          service={data.service}
          otherServices={data.otherServices}
        />
      </>
    )
  } catch (error) {
    console.error(error)
    // Return 404 instead of 500 for any errors
    notFound()
  }
}
