import { stegaClean } from 'next-sanity'
import { SOCIAL_LINKS } from '@lib/business'

import type { SanityCtaBanner } from './types'

export type PageCtaContent = {
  source: 'sanity' | 'fallback'
  preTitle: string
  headline: string
  headlineHighlight: string
  buttonLabel: string
  buttonLink: string
  footerTagline: string
  socialLinks: {
    instagram: string
    facebook: string
    tiktok: string
  }
}

export const FALLBACK_PAGE_CTA: PageCtaContent = {
  source: 'fallback',
  preTitle: 'Ready to upgrade your ride?',
  headline: "We've got\nthe gear\nwaiting for you.",
  headlineHighlight: 'for you.',
  buttonLabel: 'Shop Now',
  buttonLink: '/store',
  footerTagline:
    'Sixth Gear Moto Supply  is a premium motorcycle supply shop and motorcycle service center. Based in Makati City.',
  socialLinks: { ...SOCIAL_LINKS },
}

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && stegaClean(value).trim().length > 0
}

export function isCompletePageCta(value: SanityCtaBanner | null | undefined) {
  return Boolean(
    value?.useSanityContent === true &&
      nonEmpty(value.preTitle) &&
      nonEmpty(value.headline) &&
      nonEmpty(value.headlineHighlight) &&
      nonEmpty(value.buttonLabel) &&
      nonEmpty(value.buttonLink) &&
      nonEmpty(value.footerTagline) &&
      nonEmpty(value.socialLinks?.instagram) &&
      nonEmpty(value.socialLinks?.facebook) &&
      nonEmpty(value.socialLinks?.tiktok)
  )
}

export function selectPageCtaContent(
  value: SanityCtaBanner | null | undefined,
  sectionName: string
): PageCtaContent {
  if (!isCompletePageCta(value)) {
    if (
      value?.useSanityContent === true &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        `[Sanity] ${sectionName} is enabled but incomplete. Rendering its complete local fallback.`
      )
    }
    return FALLBACK_PAGE_CTA
  }

  return {
    source: 'sanity',
    preTitle: value!.preTitle!,
    headline: value!.headline!,
    headlineHighlight: value!.headlineHighlight!,
    buttonLabel: value!.buttonLabel!,
    buttonLink: value!.buttonLink!,
    footerTagline: value!.footerTagline!,
    socialLinks: {
      instagram: value!.socialLinks!.instagram!,
      facebook: value!.socialLinks!.facebook!,
      tiktok: value!.socialLinks!.tiktok!,
    },
  }
}
