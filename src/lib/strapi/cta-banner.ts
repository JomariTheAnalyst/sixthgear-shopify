/**
 * Strapi CTA Banner Content Fetcher
 *
 * Fetches CTA banner content from Strapi CMS for the homepage.
 */

import { SOCIAL_LINKS } from "@lib/business"
import { StrapiImage } from "./home"
import { pickText, pickMediaUrl, pickBool } from "../cms/fallback"

// Type definitions for CTA Banner block (Strapi v5 structure)
export interface CTABannerBlock {
  __component: "sections.cta-banner-layout"
  id: number
  title: string
  title_desc: string
  background_image: StrapiImage | null
  opening_hours: string
  tiktok_link?: string
  facebook_link?: string
  instagram_link?: string
  enable: boolean
}

export interface CTABannerContent {
  title: string
  description: string
  backgroundImage: string
  openingHours: string
  socialLinks: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
  isEnabled: boolean
}

// Hardcoded fallback values
const CTA_BANNER_FALLBACKS: CTABannerContent = {
  title: "VISIT US\nTODAY",
  description:
    "Your one-stop destination for premium motorcycle gear, parts, and great coffee",
  backgroundImage: "/images/cta-placeholder.jpg",
  openingHours: "Open Monday - Friday | 9:00 AM - 8:00 PM",
  socialLinks: { ...SOCIAL_LINKS },
  isEnabled: true,
}

/**
 * Extract CTA banner content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted CTA banner content or null if not found/disabled
 */
export function extractCTABannerContent(
  homeContent: any
): CTABannerContent | null {
  if (!homeContent?.data?.blocks) {
    return null
  }

  // Find the CTA banner block
  const ctaBlock = homeContent.data.blocks.find(
    (block: any): block is CTABannerBlock =>
      block.__component === "sections.cta-banner-layout"
  )

  if (!ctaBlock) {
    return null
  }

  // Check if section is enabled
  const isEnabled = pickBool(ctaBlock.enable, true)
  if (!isEnabled) {
    return null
  }


  // Get background image URL
  const backgroundImageUrl = ctaBlock.background_image
    ? pickMediaUrl(
        ctaBlock.background_image,
        CTA_BANNER_FALLBACKS.backgroundImage
      )
    : CTA_BANNER_FALLBACKS.backgroundImage

  // Transform to frontend format
  const result: CTABannerContent = {
    title: pickText(ctaBlock.title, CTA_BANNER_FALLBACKS.title),
    description: pickText(
      ctaBlock.title_desc,
      CTA_BANNER_FALLBACKS.description
    ),
    backgroundImage: backgroundImageUrl,
    openingHours: pickText(
      ctaBlock.opening_hours,
      CTA_BANNER_FALLBACKS.openingHours
    ),
    socialLinks: {
      facebook: ctaBlock.facebook_link || undefined,
      instagram: ctaBlock.instagram_link || undefined,
      tiktok: ctaBlock.tiktok_link || undefined,
    },
    isEnabled: true,
  }


  return result
}

/**
 * Get CTA banner content with fallbacks
 *
 * @param homeContent - Home content already fetched
 * @returns CTA banner content with fallbacks applied
 */
export function getCTABannerWithFallbacks(homeContent: any): CTABannerContent {
  try {
    const cmsContent = extractCTABannerContent(homeContent)

    if (!cmsContent) {
      return CTA_BANNER_FALLBACKS
    }

    return cmsContent
  } catch (error) {
    console.error(error)
    return CTA_BANNER_FALLBACKS
  }
}
