import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"
import { getAboutPage } from "@lib/cms/client"
import { selectOurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import { selectAboutPageContent } from "@lib/cms/about-page-main"
import JsonLd from "@modules/common/components/json-ld"
import {
  getBreadcrumbStructuredData,
  getCanonicalPath,
  getOpenGraph,
} from "@lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const title = "About Us"
  const description =
    "The rider-built motorcycle shop, workshop and café behind SixthGear Moto in Makati."

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalPath("/about"),
    },
    openGraph: getOpenGraph({ title, description, path: "/about" }),
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function AboutPage() {
  const aboutPage = await getAboutPage()
  const content = selectAboutPageContent(aboutPage)
  const ourSpaceExperienceContent = selectOurSpaceExperienceContent(
    aboutPage?.ourSpaceExperience
  )
  const breadcrumbStructuredData = getBreadcrumbStructuredData([
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
