import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"
import { FALLBACK_ABOUT_HERO } from "@modules/about/constants"
import { getAboutPage } from "@lib/cms/client"
import { selectOurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import { selectAboutPageMainSource } from "@lib/cms/about-page-main"
import {
  AboutMissionContent,
  AboutWhyChooseUsContent,
  AboutStoryItem,
  AboutValuesContent,
} from "@modules/about/types"
import JsonLd from "@modules/common/components/json-ld"
import {
  getBreadcrumbStructuredData,
  getLocalizedCanonicalPath,
} from "@lib/seo"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return {
    title: "About Us",
    description:
      "Learn about SixthgearMoto, a rider-built motorcycle shop, workshop, and cafe hub in the Philippines.",
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/about"),
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
  const aboutPageMain = selectAboutPageMainSource(aboutPage)
  const ourSpaceExperienceContent = selectOurSpaceExperienceContent(
    aboutPage?.ourSpaceExperience
  )
  const breadcrumbStructuredData = getBreadcrumbStructuredData(countryCode, [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ])

  const heroContent = {
    title: aboutPageMain?.hero?.title || FALLBACK_ABOUT_HERO.title,
    subtitle:
      aboutPageMain?.hero?.description || FALLBACK_ABOUT_HERO.subtitle,
    backgroundImage:
      aboutPageMain?.hero?.backgroundImageUrl || FALLBACK_ABOUT_HERO.backgroundImage,
  }

  const storyItems: AboutStoryItem[] | null =
    aboutPageMain?.story && aboutPageMain.story.length > 0
      ? aboutPageMain.story.map((item, index) => ({
          id: item._key || `${index}-${item.heading || "story"}`,
          heading: item.heading || "",
          body: item.body || "",
          image: {
            src: item.imageUrl || "",
            alt: item.imageAlt || "",
          },
        }))
      : null

  const ourValuesContent: AboutValuesContent | null = aboutPageMain?.ourValues
    ? {
        heading: aboutPageMain.ourValues.heading,
        description: aboutPageMain.ourValues.description,
        cards:
          aboutPageMain.ourValues.cards && aboutPageMain.ourValues.cards.length > 0
            ? aboutPageMain.ourValues.cards.map((item, index) => ({
                id: item._key || `${index}-${item.title || "value"}`,
                title: item.title || "",
                description: item.description || "",
                icon: item.icon || "wrench",
              }))
            : null,
      }
    : null

  const whyChooseUsContent: AboutWhyChooseUsContent | null =
    aboutPageMain?.whyChooseUs
      ? {
          sectionLabel: aboutPageMain.whyChooseUs.sectionLabel,
          heading: aboutPageMain.whyChooseUs.heading,
          subtitle: aboutPageMain.whyChooseUs.subtitle,
          items:
            aboutPageMain.whyChooseUs.items && aboutPageMain.whyChooseUs.items.length > 0
              ? aboutPageMain.whyChooseUs.items.map((item, index) => ({
                  id: item._key || `${index}-${item.title || "reason"}`,
                  title: item.title || "",
                  description: item.description || "",
                  icon: item.icon || "wrench",
                }))
              : null,
          topImage: {
            src: aboutPageMain.whyChooseUs.topImageUrl || null,
            alt: aboutPageMain.whyChooseUs.topImageAlt || "",
          },
          bottomImage: {
            src: aboutPageMain.whyChooseUs.bottomImageUrl || null,
            alt: aboutPageMain.whyChooseUs.bottomImageAlt || "",
          },
        }
      : null

  const ceoQuoteContent: AboutMissionContent | null = aboutPageMain?.ceoQuote
    ? {
        quoteText: aboutPageMain.ceoQuote.quoteText || "",
        highlightedPhrase: aboutPageMain.ceoQuote.highlightedPhrase || "",
        ceoName: aboutPageMain.ceoQuote.ceoName || "",
        ceoTitle: aboutPageMain.ceoQuote.ceoTitle || "",
        ceoPhoto: aboutPageMain.ceoQuote.ceoPhotoUrl || "",
        ceoPhotoDescription: aboutPageMain.ceoQuote.ceoPhotoDescription || "",
      }
    : null

  return (
    <>
      <JsonLd id="about-breadcrumbs" data={breadcrumbStructuredData} />
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={aboutPageMain ? "hero" : "useSanityContent"}
      >
      <AboutTemplate
        heroContent={heroContent}
        storyItems={storyItems}
        ourSpaceExperienceContent={ourSpaceExperienceContent}
        ourValuesContent={ourValuesContent}
        whyChooseUsContent={whyChooseUsContent}
        ceoQuoteContent={ceoQuoteContent}
      />
      </SanityEditTarget>
    </>
  )
}
