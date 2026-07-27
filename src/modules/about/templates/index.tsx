"use client"

/**
 * About Us Page Template
 * Combines all about sections into a complete page
 */

import AboutHero from "./hero"
import AboutStory from "./story"
import ProjectsSection from "@modules/home/components/projects"
import AboutMission from "./ceo-quote"
import OurValues from "@modules/about/components/our-values"
import WhyChooseUs from "@modules/about/components/why-choose-us"
import CTABanner from "@modules/home/components/cta-banner"
import { FALLBACK_ABOUT_MISSION } from "@modules/about/constants"
import {
  AboutHeroContent,
  AboutMissionContent,
  AboutWhyChooseUsContent,
  AboutStoryItem,
  AboutValuesContent,
} from "@modules/about/types"
import type { OurSpaceExperienceContent } from "@lib/cms/our-space-experience"

interface AboutTemplateProps {
  heroContent: AboutHeroContent
  storyItems?: AboutStoryItem[] | null
  ourSpaceExperienceContent: OurSpaceExperienceContent
  ourValuesContent?: AboutValuesContent | null
  whyChooseUsContent?: AboutWhyChooseUsContent | null
  ceoQuoteContent: AboutMissionContent | null
}

export default function AboutTemplate({
  heroContent,
  storyItems,
  ourSpaceExperienceContent,
  ourValuesContent,
  whyChooseUsContent,
  ceoQuoteContent,
}: AboutTemplateProps) {
  const missionContent = ceoQuoteContent || FALLBACK_ABOUT_MISSION

  return (
    <>
      <AboutHero
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        backgroundImage={heroContent.backgroundImage}
      />
      <WhyChooseUs data={whyChooseUsContent} />
      <div className="h-6 sm:h-8 md:h-10 lg:h-12 bg-white" />
      <AboutStory items={storyItems} />
      <div className="h-16 md:h-24 lg:h-32 bg-[#FAFAFA]" />
      <ProjectsSection content={ourSpaceExperienceContent} variant="dark" />
      <div className="h-12 md:h-20 bg-white" />
      <OurValues data={ourValuesContent} />

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
