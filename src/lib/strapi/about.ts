/**
 * About Section Content — Fallback Data (Strapi removed)
 *
 * Previously fetched from Strapi CMS, now returns null to trigger fallbacks.
 * Will be replaced by Payload CMS in Phase 3.17-3.18.
 */

export interface AboutContent {
  kicker: string
  title: string
  description: string
  highlights: string[]
  primaryCta: { text: string; link: string }
  imageTop: string | null
  imageBottom: string | null
  videoUrl: string | null
}

export function extractAboutContent(_homeContent: any): AboutContent | null {
  return null
}

export function getAboutContent(_homeContent: any): AboutContent | null {
  return null
}
