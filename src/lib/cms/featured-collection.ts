import type { SanityFeaturedCollectionItem } from './types'
import type { ShopifyProductCard } from '@lib/shopify/types'
import { stegaClean } from 'next-sanity'

const cleanSanityString = stegaClean
const cleanOptionalSanityString = (value: string | null | undefined) =>
  typeof value === 'string' ? stegaClean(value) : null

export const SUPPORTED_FEATURED_COLLECTION_POSITIONS = [
  'after_hero',
  'after_about',
  'after_categories',
  'after_coffee',
  'after_services',
  'after_brands',
  'after_satisfied',
  'after_franchise',
  'after_team',
  'after_testimonials',
] as const

export type FeaturedCollectionPosition =
  (typeof SUPPORTED_FEATURED_COLLECTION_POSITIONS)[number]

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && cleanSanityString(value).trim().length > 0
}

function parseOptionalDate(value: string | null | undefined) {
  if (!value) return null
  const timestamp = Date.parse(cleanSanityString(value))
  return Number.isFinite(timestamp) ? timestamp : Number.NaN
}

export function isSupportedFeaturedCollectionPosition(
  value: unknown
): value is FeaturedCollectionPosition {
  const cleaned = typeof value === 'string' ? cleanSanityString(value) : value
  return SUPPORTED_FEATURED_COLLECTION_POSITIONS.includes(
    cleaned as FeaturedCollectionPosition
  )
}

export function isFeaturedCollectionScheduleActive(
  campaign: Pick<
    SanityFeaturedCollectionItem,
    'isActive' | 'startDate' | 'endDate'
  >,
  now: Date = new Date()
) {
  if (!campaign.isActive) return false

  const nowTimestamp = now.getTime()
  const startTimestamp = parseOptionalDate(campaign.startDate)
  const endTimestamp = parseOptionalDate(campaign.endDate)

  if (Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) return false
  if (startTimestamp !== null && nowTimestamp < startTimestamp) return false
  if (endTimestamp !== null && nowTimestamp > endTimestamp) return false
  if (
    startTimestamp !== null &&
    endTimestamp !== null &&
    startTimestamp > endTimestamp
  ) {
    return false
  }

  return true
}

export function isCompleteFeaturedCollectionCampaign(
  campaign: SanityFeaturedCollectionItem
) {
  return (
    isSupportedFeaturedCollectionPosition(campaign.position) &&
    isNonEmptyString(campaign.collectionHandle) &&
    isNonEmptyString(campaign.bannerImageUrl) &&
    isNonEmptyString(campaign.bannerImageAlt) &&
    isNonEmptyString(campaign.heading) &&
    isNonEmptyString(campaign.ctaLabel) &&
    isNonEmptyString(campaign.ctaLink)
  )
}

export function getFeaturedCollectionCampaignIssue(
  campaign: SanityFeaturedCollectionItem
) {
  if (!campaign.isActive) return null
  if (!isSupportedFeaturedCollectionPosition(campaign.position)) {
    return `unsupported homepage position "${campaign.position || 'missing'}"`
  }

  const startTimestamp = parseOptionalDate(campaign.startDate)
  const endTimestamp = parseOptionalDate(campaign.endDate)
  if (Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) {
    return 'an invalid campaign date'
  }
  if (
    startTimestamp !== null &&
    endTimestamp !== null &&
    startTimestamp > endTimestamp
  ) {
    return 'an end date earlier than its start date'
  }
  if (!isCompleteFeaturedCollectionCampaign(campaign)) {
    return 'missing required editorial, image, CTA, or Shopify collection fields'
  }

  return null
}

export function selectFeaturedCollectionForPosition(
  campaigns: SanityFeaturedCollectionItem[],
  position: FeaturedCollectionPosition,
  now: Date = new Date()
) {
  return (
    campaigns.find(
      (campaign) =>
        cleanOptionalSanityString(campaign.position) === position &&
        isFeaturedCollectionScheduleActive(campaign, now) &&
        isCompleteFeaturedCollectionCampaign(campaign)
    ) ?? null
  )
}

export async function resolveFeaturedCollectionProducts(
  campaign: SanityFeaturedCollectionItem,
  loadProducts: (
    handle: string,
    first: number
  ) => Promise<ShopifyProductCard[]>
) {
  if (!isCompleteFeaturedCollectionCampaign(campaign)) return null

  try {
    const products = await loadProducts(
      cleanSanityString(campaign.collectionHandle as string).trim(),
      4
    )
    return products.length > 0 ? products : null
  } catch {
    return null
  }
}

export function warnFeaturedCollectionInDevelopment(
  message: string,
  error?: unknown
) {
  if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
    console.warn(`[Featured Collection] ${message}`, error ?? '')
  }
}
