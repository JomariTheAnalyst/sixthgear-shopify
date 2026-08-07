import { Metadata } from "next"
import ContactPage from "@modules/contact"
import StoreLocation from "@modules/home/components/store-location"
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
  const title = "Contact Us"
  const description =
    "Contact SixthGearMoto for motorcycle parts, workshop bookings, carwash, coffee, and rider support from Makati for Metro Manila."

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/contact"),
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
  }
}

export default async function Contact({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const breadcrumbStructuredData = getBreadcrumbStructuredData(countryCode, [
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ])

  return (
    <>
      <JsonLd id="contact-breadcrumbs" data={breadcrumbStructuredData} />
      <ContactPage />
      <StoreLocation />
    </>
  )
}
