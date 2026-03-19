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

export interface AboutMissionContent {
  quoteText: string
  highlightedPhrase: string
  ceoName: string
  ceoTitle: string
  ceoPhoto: string | null
}
