import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"
import {
  FALLBACK_ABOUT_HERO,
} from "@modules/about/constants"
import { getAboutPage } from "@lib/cms/client"
import {
  AboutMissionContent,
  AboutWhyChooseUsContent,
  AboutServicesContent,
  AboutStoryItem,
  AboutValuesContent,
} from "@modules/about/types"

export const metadata: Metadata = {
  title: "About SixthgearMoto",
  description:
    "Sixth Gear Moto Supply Café + Lounge - Built by riders, for riders. Premium motorcycle service hub with professional workshop expertise and a relaxed café experience.",
}

export default async function AboutPage() {
  const aboutPage = await getAboutPage()

  const heroContent = {
    title: aboutPage?.hero?.title?.trim() || FALLBACK_ABOUT_HERO.title,
    subtitle:
      aboutPage?.hero?.description?.trim() || FALLBACK_ABOUT_HERO.subtitle,
    backgroundImage:
      aboutPage?.hero?.backgroundImageUrl || FALLBACK_ABOUT_HERO.backgroundImage,
  }

  const storyItems: AboutStoryItem[] | null =
    aboutPage?.story && aboutPage.story.length > 0
      ? aboutPage.story.map((item, index) => ({
          id: item._key || `${index}-${item.heading || "story"}`,
          heading: item.heading || "",
          body: item.body || "",
          image: {
            src: item.imageUrl || "",
            alt: item.imageAlt || "",
          },
        }))
      : null

  const whatWeOfferContent: AboutServicesContent | null = aboutPage?.whatWeOffer
    ? {
        sectionName: aboutPage.whatWeOffer.sectionName,
        heading: aboutPage.whatWeOffer.heading,
        cards:
          aboutPage.whatWeOffer.cards && aboutPage.whatWeOffer.cards.length > 0
            ? aboutPage.whatWeOffer.cards.map((item, index) => ({
                id: item._key || `${index}-${item.title || "offer"}`,
                title: item.title || "",
                backgroundImage: item.backgroundImageUrl || "",
                linkUrl: item.linkUrl || "#",
                buttonText: item.buttonText || "",
              }))
            : null,
      }
    : null

  const ourValuesContent: AboutValuesContent | null = aboutPage?.ourValues
    ? {
        heading: aboutPage.ourValues.heading,
        description: aboutPage.ourValues.description,
        cards:
          aboutPage.ourValues.cards && aboutPage.ourValues.cards.length > 0
            ? aboutPage.ourValues.cards.map((item, index) => ({
                id: item._key || `${index}-${item.title || "value"}`,
                title: item.title || "",
                description: item.description || "",
                icon: item.icon || "wrench",
              }))
            : null,
      }
    : null

  const whyChooseUsContent: AboutWhyChooseUsContent | null =
    aboutPage?.whyChooseUs
      ? {
          sectionLabel: aboutPage.whyChooseUs.sectionLabel,
          heading: aboutPage.whyChooseUs.heading,
          subtitle: aboutPage.whyChooseUs.subtitle,
          items:
            aboutPage.whyChooseUs.items && aboutPage.whyChooseUs.items.length > 0
              ? aboutPage.whyChooseUs.items.map((item, index) => ({
                  id: item._key || `${index}-${item.title || "reason"}`,
                  title: item.title || "",
                  description: item.description || "",
                  icon: item.icon || "wrench",
                }))
              : null,
          topImage: {
            src: aboutPage.whyChooseUs.topImageUrl || null,
            alt: aboutPage.whyChooseUs.topImageAlt || "",
          },
          bottomImage: {
            src: aboutPage.whyChooseUs.bottomImageUrl || null,
            alt: aboutPage.whyChooseUs.bottomImageAlt || "",
          },
        }
      : null

  const ceoQuoteContent: AboutMissionContent | null = aboutPage?.ceoQuote
    ? {
        quoteText: aboutPage.ceoQuote.quoteText || "",
        highlightedPhrase: aboutPage.ceoQuote.highlightedPhrase || "",
        ceoName: aboutPage.ceoQuote.ceoName || "",
        ceoTitle: aboutPage.ceoQuote.ceoTitle || "",
        ceoPhoto: aboutPage.ceoQuote.ceoPhotoUrl || "",
        ceoPhotoDescription: aboutPage.ceoQuote.ceoPhotoDescription || "",
      }
    : null

  return (
    <AboutTemplate
      heroContent={heroContent}
      storyItems={storyItems}
      whatWeOfferContent={whatWeOfferContent}
      ourValuesContent={ourValuesContent}
      whyChooseUsContent={whyChooseUsContent}
      ceoQuoteContent={ceoQuoteContent}
    />
  )
}
