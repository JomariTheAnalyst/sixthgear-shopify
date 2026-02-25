/**
 * About Page Content — Fallback Data (Strapi removed)
 *
 * Previously fetched from Strapi CMS, now returns null to trigger fallbacks.
 * Will be replaced by Payload CMS in Phase 3.17-3.18.
 *
 * Keeps all TypeScript interfaces that UI components depend on.
 */

import { StrapiImage } from "./home"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FirstSectionBlock {
  __component: "about-sections.first-section"
  id: number
  badgeText: string
  title: string
  subtitle: string
  background_image: StrapiImage | null
  overlayStrength: number
  is_active: boolean
}

export interface SecondSectionBlock {
  __component: "about-sections.second-section"
  id: number
  image: StrapiImage | null
  badgeText: string
  badgePosition: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  heading: string
  highlightedText: string
  bodyText: any[] // Rich text blocks
  is_active: boolean
}

export interface OfferingCard {
  id: number
  title: string
  description: string
  background_image: StrapiImage | null
  link_url: string
  is_active: boolean
}

export interface WhatWeOfferBlock {
  __component: "about-sections.what-we-offer-section"
  id: number
  section_name: string
  heading: string
  offering_card: OfferingCard[]
  is_active: boolean
}

export interface CeoQuoteBlock {
  __component: "about-sections.ceo-quote-sections"
  id: number
  quoteText: string
  highlightedPhrase: string
  ceoName: string
  ceoTitle: string
  ceoPhoto: StrapiImage | null
  is_active: boolean
}

export interface AboutPageContent {
  data: {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    blocks: Array<
      FirstSectionBlock | SecondSectionBlock | WhatWeOfferBlock | CeoQuoteBlock
    >
  }
}

// ============================================================================
// CONTENT INTERFACES (Frontend Format)
// ============================================================================

export interface HeroSectionContent {
  badgeText: string
  title: string
  subtitle: string
  backgroundImage: string | null
  overlayStrength: number
}

export interface IntroSectionContent {
  image: string | null
  badgeText: string
  badgePosition: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  heading: string
  highlightedText: string
  bodyText: any[] // Rich text blocks
}

export interface OfferingCardContent {
  id: number
  title: string
  description: string
  backgroundImage: string | null
  linkUrl: string
}

export interface WhatWeOfferContent {
  sectionName: string
  heading: string
  cards: OfferingCardContent[]
}

export interface CeoQuoteContent {
  quoteText: string
  highlightedPhrase: string
  ceoName: string
  ceoTitle: string
  ceoPhoto: string | null
}

// ============================================================================
// FETCH FUNCTION — Returns null (Strapi removed)
// ============================================================================

export async function fetchAboutPageContent(): Promise<AboutPageContent | null> {
  return null // Strapi removed — fallback functions handle this
}

// ============================================================================
// EXTRACTION FUNCTIONS — Return null (Strapi removed)
// ============================================================================

export function extractHeroSection(
  _aboutContent: AboutPageContent | null
): HeroSectionContent | null {
  return null
}

export function extractIntroSection(
  _aboutContent: AboutPageContent | null
): IntroSectionContent | null {
  return null
}

export function extractWhatWeOfferSection(
  _aboutContent: AboutPageContent | null
): WhatWeOfferContent | null {
  return null
}

export function extractCeoQuoteSection(
  _aboutContent: AboutPageContent | null
): CeoQuoteContent | null {
  return null
}

// ============================================================================
// MAIN GETTER FUNCTIONS — Return null (Strapi removed)
// ============================================================================

export async function getHeroSection(): Promise<HeroSectionContent | null> {
  return null
}

export async function getIntroSection(): Promise<IntroSectionContent | null> {
  return null
}

export async function getWhatWeOfferSection(): Promise<WhatWeOfferContent | null> {
  return null
}

export async function getCeoQuoteSection(): Promise<CeoQuoteContent | null> {
  return null
}
