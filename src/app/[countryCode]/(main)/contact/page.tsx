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

  return {
    title: "Contact Us",
    description:
      "Contact SixthGearMoto for motorcycle parts, workshop bookings, carwash, coffee, and rider support from Makati for Metro Manila.",
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/contact"),
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
    { name: "Contact", path: "/contact" },
  ])

  return (
    <>
      <JsonLd id="contact-breadcrumbs" data={breadcrumbStructuredData} />
      <ContactPage />
      <StoreLocation />
    </>
  )
}
