export interface SanityHeroSection {
  trustBadge: string | null
  heading: string
  description: string | null
  primaryLabel: string
  primaryLink: string
  secondaryLabel: string | null
  secondaryLink: string | null
  imageUrl: string
  imageAlt: string
}

export interface SanityCollectionHero {
  handle: string
  heading: string
  badge: string | null
  description: string | null
  backgroundImageUrl: string | null
}
