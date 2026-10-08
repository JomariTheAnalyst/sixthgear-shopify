import type { AboutHeroContent, AboutMissionContent } from "./types"

export const FALLBACK_ABOUT_HERO: AboutHeroContent = {
  title: "About Us",
  subtitle: "We Offer Complete Diagnostics and Care for Your Motorcycle",
  backgroundImage: "/images/sixthgearleftsideimg.jpg",
}

export const FALLBACK_ABOUT_MISSION: AboutMissionContent = {
  quoteText:
    "More than a shop, Sixth Gear is a rider's space. A place to wrench, ride, refuel, and connect. Whether you're here for service, upgrades, or simply good coffee and conversation, you're always welcome at Sixth Gear.",
  highlightedPhrase: "rider's space",
  ceoName: "Cap. Gregory Nick Sevilla",
  ceoTitle: "CEO & Founder, Sixthgear Motosupply",
  ceoPhoto: "/images/ceo/capgreg.jpg",
  ceoPhotoDescription:
    "Portrait of Cap. Gregory Nick Sevilla, founder of SixthGearMoto, standing in the workshop.",
}

/** One container for every About section: 1760px max, 16px → 64px side padding. */
export const ABOUT_CONTAINER =
  "mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-10 lg:px-16"

/** Paragraphs stay near 60 characters wide inside the wide layout. */
export const ABOUT_PROSE = "max-w-[60ch]"

export const ABOUT_INK = "#1a1a1a"
