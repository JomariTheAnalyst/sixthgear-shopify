import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"
import { getAboutPage } from "@lib/cms/client"
import { selectOurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import { selectAboutPageContent } from "@lib/cms/about-page-main"
import { getBrandCollections } from "@lib/shopify"
import type { MarqueeBrand } from "@modules/about/components/brand-marquee"
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

/** Brand names for the marquee, from the same collections as the homepage. */
async function getMarqueeBrands(): Promise<MarqueeBrand[]> {
  try {
    const collections = await getBrandCollections()
    return collections.map(({ id, title }) => ({ id, name: title }))
  } catch (error) {
    console.error("[about] Unable to load Shopify brand collections.", error)
    return []
  }
}

export default async function AboutPage() {
  const [aboutPage, brands] = await Promise.all([
    getAboutPage(),
    getMarqueeBrands(),
  ])
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
        brands={brands}
        statementContent={content.statement}
        whoWeAreContent={content.whoWeAre}
        storyContent={content.story}
        ourSpaceExperienceContent={ourSpaceExperienceContent}
        whyChooseUsContent={content.whyChooseUs}
        ceoQuoteContent={content.ceoQuote}
        ctaBannerContent={content.ctaBanner}
      />
    </>
  )
}
