import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"
import { getAboutPage } from "@lib/cms/client"
import { selectOurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import { selectAboutPageContent } from "@lib/cms/about-page-main"
import { getBrandCollections } from "@lib/shopify"
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

/** Brands-in-store stat, from the same collections as the homepage. */
async function getBrandCount(): Promise<number> {
  try {
    return (await getBrandCollections()).length
  } catch (error) {
    console.error("[about] Unable to load Shopify brand collections.", error)
    return 0
  }
}

export default async function AboutPage() {
  const [aboutPage, brandCount] = await Promise.all([
    getAboutPage(),
    getBrandCount(),
  ])
  const content = selectAboutPageContent(aboutPage)
  const statement = {
    ...content.statement,
    stats: content.statement.stats
      .map((stat) =>
        stat.key === "brands" ? { ...stat, value: brandCount } : stat
      )
      .filter((stat) => stat.value > 0),
  }
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
        brandMarqueeContent={content.brandMarquee}
        statementContent={statement}
        whoWeAreContent={content.whoWeAre}
        storyContent={content.story}
        whyChooseUsContent={content.whyChooseUs}
        ourSpaceExperienceContent={ourSpaceExperienceContent}
        ceoQuoteContent={content.ceoQuote}
        ctaBannerContent={content.ctaBanner}
      />
    </>
  )
}
