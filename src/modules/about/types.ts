export interface AboutHeroContent {
  title: string
  subtitle: string
  backgroundImage: string | null
}

export interface AboutStoryItem {
  id: string | number
  heading: string
  body: string
  image: {
    src: string
    alt: string
  }
}

export type AboutValueIconKey =
  | "wrench"
  | "users"
  | "shield"
  | "coffee"
  | "energy"
  | "award"

export interface AboutValueCard {
  id: string | number
  title: string
  description: string
  icon: AboutValueIconKey | string
}

export interface AboutValuesContent {
  heading?: string | null
  description?: string | null
  cards?: AboutValueCard[] | null
}

export type AboutWhyChooseUsIconKey = "wrench" | "shield" | "users" | "coffee"

export interface AboutWhyChooseUsItem {
  id: string | number
  title: string
  description: string
  icon: AboutWhyChooseUsIconKey | string
}

export interface AboutWhyChooseUsContent {
  sectionLabel?: string | null
  heading?: string | null
  subtitle?: string | null
  items?: AboutWhyChooseUsItem[] | null
  topImage?: {
    src: string | null
    alt: string
  } | null
  bottomImage?: {
    src: string | null
    alt: string
  } | null
}

export interface AboutMissionContent {
  quoteText: string
  highlightedPhrase: string
  ceoName: string
  ceoTitle: string
  ceoPhoto: string
  ceoPhotoDescription: string
}
