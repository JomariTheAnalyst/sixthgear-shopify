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
      {ceoQuoteContent && (
        <AboutMission
          quoteText={ceoQuoteContent.quoteText}
          highlightedPhrase={ceoQuoteContent.highlightedPhrase}
          ceoName={ceoQuoteContent.ceoName}
          ceoTitle={ceoQuoteContent.ceoTitle}
          ceoPhoto={ceoQuoteContent.ceoPhoto ?? undefined}
          ceoPhotoDescription={ceoQuoteContent.ceoPhotoDescription}
        />
      )}
      <CTABanner />
    </>
  )
}
