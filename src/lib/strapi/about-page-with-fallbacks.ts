/**
 * About Page Content with Fallbacks (Strapi removed)
 *
 * Returns hardcoded fallback content directly. CMS fetch has been removed.
 * Will be replaced by Payload CMS in Phase 3.17-3.18.
 */

import {
  HeroSectionContent,
  IntroSectionContent,
  WhatWeOfferContent,
  CeoQuoteContent,
  AboutPageContent,
} from "./about-page"

// ============================================================================
// HARDCODED FALLBACKS (Default Values)
// ============================================================================

const HERO_FALLBACKS: HeroSectionContent = {
  badgeText: "Built by Riders, For Riders",
  title: "About Us",
  subtitle: "We Offer Complete Diagnostics and Care for Your Motorcycle",
  backgroundImage: "/images/sixthgearleftsideimg.jpg",
  overlayStrength: 60,
}

const INTRO_FALLBACKS: IntroSectionContent = {
  image: "/images/sixthgear-workshop.jpg",
  badgeText: "100%\nRider Focused",
  badgePosition: "bottom-right",
  heading: "More Than a Shop,\nA Rider's Space",
  highlightedText: "A Rider's Space",
  bodyText: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "Sixth Gear Moto Supply Café + Lounge",
          bold: true,
        },
        {
          type: "text",
          text: " is built by riders, for riders. We are a premium motorcycle service hub that combines professional workshop expertise with a relaxed café and lounge experience, powered by First Gear Coffee.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "From routine PMS to advanced diagnostics, repairs, and performance upgrades, our workshop is equipped to handle big bikes and premium motorcycles with precision, care, and attention to detail. We believe proper maintenance is not just about fixing issues, but about ensuring safety, reliability, and riding confidence.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "Beyond servicing, Sixth Gear offers a curated selection of quality motorcycle accessories, riding gear, helmets, and performance parts. We also provide professional bike wash, detailing, and cosmetic restoration to keep your motorcycle looking and performing at its best.",
        },
      ],
    },
  ],
}

const WHAT_WE_OFFER_FALLBACKS: WhatWeOfferContent = {
  sectionName: "What We Offer",
  heading: "Complete Care for\nYour Ride",
  cards: [
    {
      id: 1,
      title: "Motorcycle Service & Diagnostics",
      description:
        "PMS, repairs, detailing, and performance upgrades for big bikes and premium motorcycles.",
      backgroundImage:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      linkUrl: "/services",
    },
    {
      id: 2,
      title: "Parts, Accessories & Luggage",
      description:
        "Helmets, riding gear, bags, communications, parts, and accessories from trusted brands.",
      backgroundImage:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
      linkUrl: "/store",
    },
    {
      id: 3,
      title: "Rider Apparel & Gear",
      description:
        "Protective riding gear and lifestyle apparel designed for comfort, safety, and style.",
      backgroundImage:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
      linkUrl: "/store",
    },
    {
      id: 4,
      title: "Café & Rider Lounge",
      description:
        "Relax, connect, and refuel with First Gear Coffee in a space built for riders.",
      backgroundImage:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      linkUrl: "/menu",
    },
  ],
}

const CEO_QUOTE_FALLBACKS: CeoQuoteContent = {
  quoteText:
    "More than a shop, Sixth Gear is a rider's space. A place to wrench, ride, refuel, and connect. Whether you're here for service, upgrades, or simply good coffee and conversation, you're always welcome at Sixth Gear.",
  highlightedPhrase: "rider's space",
  ceoName: "Cap. Gregory Nick Sevilla",
  ceoTitle: "CEO & Founder, Sixthgear Motosupply",
  ceoPhoto: "/images/ceo/capgreg.jpg",
}

// ============================================================================
// GETTER FUNCTIONS — Return fallback data directly (no CMS fetch)
// ============================================================================

export async function getHeroWithFallbacks(
  _aboutContent?: AboutPageContent | null
): Promise<HeroSectionContent> {
  return HERO_FALLBACKS
}

export async function getIntroWithFallbacks(
  _aboutContent?: AboutPageContent | null
): Promise<IntroSectionContent> {
  return INTRO_FALLBACKS
}

export async function getWhatWeOfferWithFallbacks(
  _aboutContent?: AboutPageContent | null
): Promise<WhatWeOfferContent> {
  return WHAT_WE_OFFER_FALLBACKS
}

export async function getCeoQuoteWithFallbacks(
  _aboutContent?: AboutPageContent | null
): Promise<CeoQuoteContent> {
  return CEO_QUOTE_FALLBACKS
}
