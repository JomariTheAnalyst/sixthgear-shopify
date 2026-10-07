import { Metadata } from "next"
import ContactPage from "@modules/contact"
import StoreLocation from "@modules/home/components/store-location"
import JsonLd from "@modules/common/components/json-ld"
import {
  getBreadcrumbStructuredData,
  getCanonicalPath,
  getOpenGraph,
} from "@lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const title = "Contact Us"
  const description =
    "Visit 3610 Bautista St, Makati, or call and message SixthGear Moto. Open daily 10 AM–7 PM."

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalPath("/contact"),
    },
    openGraph: getOpenGraph({ title, description, path: "/contact" }),
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function Contact() {
  const breadcrumbStructuredData = getBreadcrumbStructuredData([
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
