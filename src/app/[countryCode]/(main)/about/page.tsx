import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"
import { getAboutPage } from "@lib/cms/client"
import { selectOurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import { selectAboutPageContent } from "@lib/cms/about-page-main"
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
  const title = "About Us"
  const description =
    "Learn about SixthgearMoto, a rider-built motorcycle shop, workshop, and cafe hub in the Philippines."

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/about"),
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const aboutPage = await getAboutPage()
  const content = selectAboutPageContent(aboutPage)
  const ourSpaceExperienceContent = selectOurSpaceExperienceContent(
    aboutPage?.ourSpaceExperience
  )
  const breadcrumbStructuredData = getBreadcrumbStructuredData(countryCode, [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ])

  return (
    <>
      <JsonLd id="about-breadcrumbs" data={breadcrumbStructuredData} />
      <AboutTemplate
        heroContent={content.hero}
        storyContent={content.story}
        ourSpaceExperienceContent={ourSpaceExperienceContent}
        ourValuesContent={content.ourValues}
        whyChooseUsContent={content.whyChooseUs}
        ceoQuoteContent={content.ceoQuote}
        ctaBannerContent={content.ctaBanner}
      />
    </>
  )
}
