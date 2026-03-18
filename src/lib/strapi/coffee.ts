/**
 * Coffee Showcase Content — Fallback Data (Strapi removed)
 *
 * Previously fetched from Strapi CMS, now returns null to trigger fallbacks.
 * Will be replaced by Payload CMS in Phase 3.17-3.18.
 */

export interface CoffeeShowcaseContent {
  sectionHeading: string
  coffeeIconUrl?: string | null
  descriptionText: string
  buttonText: string
  buttonLink: string
  coffeeItems: Array<{
    id: number
    name: string
    description: string
    image: string | null
  }>
}

export function extractCoffeeShowcaseContent(_homeContent: any): CoffeeShowcaseContent | null {
  return null
}

export function getCoffeeShowcaseContent(_homeContent: any): CoffeeShowcaseContent | null {
  return null
}
