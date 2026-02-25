/**
 * Home Page Content — Fallback Data (Strapi removed)
 *
 * Previously fetched from Strapi CMS, now returns hardcoded content directly.
 * Will be replaced by Payload CMS in Phase 3.17-3.18.
 *
 * Keeps all TypeScript interfaces that UI components depend on.
 */

// ─── Strapi Image Type (imported by many other strapi/ files) ───

export interface StrapiImage {
  id: number
  url: string
  formats?: {
    large?: { url: string }
    medium?: { url: string }
    small?: { url: string }
    thumbnail?: { url: string }
  }
  alternativeText?: string | null
  name?: string
  width?: number
  height?: number
}

// ─── Type Definitions (used by UI components) ──────────────

export interface HeroContent {
  trustBadge: string
  title: string
  description: string
  primaryCta: { text: string; link: string }
  secondaryCta: { text: string; link: string }
  backgroundImage: string | null
}

export interface HomeContent {
  data: {
    id: number
    documentId: string
    blocks: any[]
  }
}

// ─── Exported Functions (return fallbacks directly) ─────────

export async function fetchHomeContent(): Promise<HomeContent | null> {
  return null // No CMS — fallback functions handle this
}

export function extractHeroContent(_homeContent: any): HeroContent | null {
  return null // Fallback handled in home-with-fallbacks.ts
}

export async function getHeroContent(): Promise<HeroContent | null> {
  return null
}
