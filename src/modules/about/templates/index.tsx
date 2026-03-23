"use client"

/**
 * About Us Page Template
 * Combines all about sections into a complete page
 */

import AboutHero from "./hero"
import AboutStory from "./story"
import AboutServices from "./services"
import AboutMission from "./ceo-quote"
import OurValues from "@modules/about/components/our-values"
import WhyChooseUs from "@modules/about/components/why-choose-us"
import CTABanner from "@modules/home/components/cta-banner"
import { FALLBACK_ABOUT_MISSION } from "@modules/about/constants"
import {
  AboutHeroContent,
  AboutMissionContent,
  AboutWhyChooseUsContent,
  AboutServicesContent,
  AboutStoryItem,
  AboutValuesContent,
} from "@modules/about/types"

interface AboutTemplateProps {
  heroContent: AboutHeroContent
  storyItems?: AboutStoryItem[] | null
  whatWeOfferContent?: AboutServicesContent | null
  ourValuesContent?: AboutValuesContent | null
  whyChooseUsContent?: AboutWhyChooseUsContent | null
  ceoQuoteContent: AboutMissionContent | null
}

export default function AboutTemplate({
  heroContent,
  storyItems,
  whatWeOfferContent,
  ourValuesContent,
  whyChooseUsContent,
  ceoQuoteContent,
}: AboutTemplateProps) {
  const missionContent: AboutMissionContent = {
    quoteText:
      ceoQuoteContent?.quoteText?.trim() || FALLBACK_ABOUT_MISSION.quoteText,
    highlightedPhrase:
      ceoQuoteContent?.highlightedPhrase?.trim() ||
      FALLBACK_ABOUT_MISSION.highlightedPhrase,
    ceoName: ceoQuoteContent?.ceoName?.trim() || FALLBACK_ABOUT_MISSION.ceoName,
    ceoTitle:
      ceoQuoteContent?.ceoTitle?.trim() || FALLBACK_ABOUT_MISSION.ceoTitle,
    ceoPhoto: ceoQuoteContent?.ceoPhoto || FALLBACK_ABOUT_MISSION.ceoPhoto,
    ceoPhotoDescription:
      ceoQuoteContent?.ceoPhotoDescription?.trim() ||
      FALLBACK_ABOUT_MISSION.ceoPhotoDescription,
  }

  return (
    <>
      <AboutHero
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        backgroundImage={heroContent.backgroundImage}
      />
      <div className="h-20 sm:h-28 md:h-36 lg:h-48 bg-white" />
      <AboutStory items={storyItems} />
      <div className="h-16 md:h-24 lg:h-32 bg-[#FAFAFA]" />
      <AboutServices data={whatWeOfferContent} />
      <div className="h-12 md:h-20 bg-white" />
      <OurValues data={ourValuesContent} />
      <WhyChooseUs data={whyChooseUsContent} />
      <AboutMission
        quoteText={missionContent.quoteText}
        highlightedPhrase={missionContent.highlightedPhrase}
        ceoName={missionContent.ceoName}
        ceoTitle={missionContent.ceoTitle}
        ceoPhoto={missionContent.ceoPhoto}
        ceoPhotoDescription={missionContent.ceoPhotoDescription}
      />
      <CTABanner />
    </>
  )
}
