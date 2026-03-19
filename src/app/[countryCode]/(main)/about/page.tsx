import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"
import {
  FALLBACK_ABOUT_HERO,
  FALLBACK_ABOUT_MISSION,
} from "@modules/about/constants"
import { getAboutPage } from "@lib/cms/client"
import { AboutStoryItem } from "@modules/about/types"

export const metadata: Metadata = {
  title: "About Us",
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

  return (
    <AboutTemplate
      heroContent={heroContent}
      storyItems={storyItems}
      ceoQuoteContent={FALLBACK_ABOUT_MISSION}
    />
  )
}
