"use client"

/**
 * About Us Page Template
 * Combines all about sections into a complete page
 */

import { useEffect } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import AboutHero from "./hero"
import AboutStory from "./story"
import AboutMission from "./ceo-quote"
import AboutStatement from "@modules/about/components/about-statement"
import BrandMarquee from "@modules/about/components/brand-marquee"
import RegisteredBusiness from "@modules/about/components/registered-business"
import SpaceBento from "@modules/about/components/space-bento"
import WhoWeAre from "@modules/about/components/who-we-are"
import WhyChooseUs from "@modules/about/components/why-choose-us"
import CTABanner from "@modules/home/components/cta-banner"
import type { OurSpaceExperienceContent } from "@lib/cms/our-space-experience"
import type {
  AboutCeoQuoteSectionContent,
  AboutHeroSectionContent,
  AboutStatementSectionContent,
  AboutStorySectionContent,
  AboutWhoWeAreSectionContent,
  AboutWhyChooseUsSectionContent,
} from "@lib/cms/about-page-main"
import type { PageCtaContent } from "@lib/cms/page-cta"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"

interface AboutTemplateProps {
  heroContent: AboutHeroSectionContent
  statementContent: AboutStatementSectionContent
  whoWeAreContent: AboutWhoWeAreSectionContent
  storyContent: AboutStorySectionContent
  ourSpaceExperienceContent: OurSpaceExperienceContent
  whyChooseUsContent: AboutWhyChooseUsSectionContent
  ceoQuoteContent: AboutCeoQuoteSectionContent
  ctaBannerContent: PageCtaContent
}

export default function AboutTemplate({
  heroContent,
  statementContent,
  whoWeAreContent,
  storyContent,
  ourSpaceExperienceContent,
  whyChooseUsContent,
  ceoQuoteContent,
  ctaBannerContent,
}: AboutTemplateProps) {
  // Trigger positions depend on final layout: re-measure once fonts and
  // images have loaded. Lenis scrolls the window, so ScrollTrigger follows it.
  useEffect(() => {
    let active = true
    const refresh = () => active && ScrollTrigger.refresh()

    document.fonts?.ready.then(refresh)
    if (document.readyState === "complete") refresh()
    else window.addEventListener("load", refresh, { once: true })

    return () => {
      active = false
      window.removeEventListener("load", refresh)
    }
  }, [])

  return (
    <>
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={heroContent.source === "sanity" ? "hero" : "hero.useSanityContent"}
      >
        <AboutHero content={heroContent} />
      </SanityEditTarget>
      <BrandMarquee />
      <AboutStatement content={statementContent} />
      <WhoWeAre content={whoWeAreContent} />
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={storyContent.source === "sanity" ? "ourStory" : "ourStory.useSanityContent"}
      >
        <AboutStory content={storyContent} />
      </SanityEditTarget>
      <SpaceBento content={ourSpaceExperienceContent} />
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={whyChooseUsContent.source === "sanity" ? "whyChooseUs" : "whyChooseUs.useSanityContent"}
      >
        <WhyChooseUs data={whyChooseUsContent} />
      </SanityEditTarget>
      <SanityEditTarget
        documentId="aboutPage"
        documentType="aboutPage"
        path={ceoQuoteContent.source === "sanity" ? "ceoQuote" : "ceoQuote.useSanityContent"}
      >
        <AboutMission content={ceoQuoteContent} />
      </SanityEditTarget>
      <RegisteredBusiness />
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
