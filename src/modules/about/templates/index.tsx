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
import type { OurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import type {
  AboutCeoQuoteSectionContent,
  AboutHeroSectionContent,
  AboutStorySectionContent,
  AboutValuesSectionContent,
  AboutWhyChooseUsSectionContent,
} from "@lib/cms/about-page-main"
import type { PageCtaContent } from "@lib/cms/page-cta"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"

interface AboutTemplateProps {
  heroContent: AboutHeroSectionContent
  storyContent: AboutStorySectionContent
  ourSpaceExperienceContent: OurSpaceExperienceContent
  ourValuesContent: AboutValuesSectionContent
  whyChooseUsContent: AboutWhyChooseUsSectionContent
  ceoQuoteContent: AboutCeoQuoteSectionContent
  ctaBannerContent: PageCtaContent
}

export default function AboutTemplate({
  heroContent,
  storyContent,
  ourSpaceExperienceContent,
  ourValuesContent,
  whyChooseUsContent,
  ceoQuoteContent,
  ctaBannerContent,
}: AboutTemplateProps) {
  return (
    <>
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={heroContent.source === "sanity" ? "hero" : "hero.useSanityContent"}
      >
        <AboutHero
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          backgroundImage={heroContent.backgroundImage}
          backgroundImageAlt={heroContent.backgroundImageAlt}
        />
      </SanityEditTarget>
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={whyChooseUsContent.source === "sanity" ? "whyChooseUs" : "whyChooseUs.useSanityContent"}
      >
        <WhyChooseUs data={whyChooseUsContent} />
      </SanityEditTarget>
      <div className="h-6 sm:h-8 md:h-10 lg:h-12 bg-white" />
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={storyContent.source === "sanity" ? "ourStory" : "ourStory.useSanityContent"}
      >
        <AboutStory content={storyContent} />
      </SanityEditTarget>
      <div className="h-16 md:h-24 lg:h-32 bg-[#FAFAFA]" />
      <ProjectsSection content={ourSpaceExperienceContent} variant="dark" />
      <div className="h-12 md:h-20 bg-white" />
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={ourValuesContent.source === "sanity" ? "ourValues" : "ourValues.useSanityContent"}
      >
        <OurValues data={ourValuesContent} />
      </SanityEditTarget>
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={ceoQuoteContent.source === "sanity" ? "ceoQuote" : "ceoQuote.useSanityContent"}
      >
        <AboutMission
          quoteText={ceoQuoteContent.quoteText}
          highlightedPhrase={ceoQuoteContent.highlightedPhrase}
          ceoName={ceoQuoteContent.ceoName}
          ceoTitle={ceoQuoteContent.ceoTitle}
          ceoPhoto={ceoQuoteContent.ceoPhotoUrl}
          ceoPhotoDescription={ceoQuoteContent.ceoPhotoDescription}
        />
      </SanityEditTarget>
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={ctaBannerContent.source === "sanity" ? "ctaBanner" : "ctaBanner.useSanityContent"}
      >
        <CTABanner {...ctaBannerContent} />
      </SanityEditTarget>
    </>
  )
}
