import type { SanityMarqueeSectionQueryResult } from './types'

export type MarqueeContent = {
  source: 'sanity' | 'fallback'
  items: Array<{
    key: string
    text: string
  }>
}

type CompleteSanityMarquee = Omit<
  SanityMarqueeSectionQueryResult,
  'useSanityContent' | 'items'
> & {
  useSanityContent: true
  items: Array<{
    _key: string
    text: string
  }>
}

export const FALLBACK_MARQUEE_CONTENT: MarqueeContent = {
  source: 'fallback',
  items: [
    { key: 'fallback-marquee-1', text: 'RIDER-BUILT EXPERIENCE' },
    { key: 'fallback-marquee-2', text: 'TRUSTED BY RIDERS' },
    { key: 'fallback-marquee-3', text: 'FAST TURNAROUND' },
    {
      key: 'fallback-marquee-4',
      text: 'GENUINE PARTS AND EXPERIENCE',
    },
  ],
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isCompleteSanityMarquee(
  value: SanityMarqueeSectionQueryResult
): value is CompleteSanityMarquee {
  return (
    value.useSanityContent === true &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(
      (item) => item && isNonEmptyString(item._key) && isNonEmptyString(item.text)
    )
  )
}

export function selectMarqueeContent(
  value: SanityMarqueeSectionQueryResult | null | undefined
): MarqueeContent {
  if (!value || !isCompleteSanityMarquee(value)) {
    return FALLBACK_MARQUEE_CONTENT
  }

  return {
    source: 'sanity',
    items: value.items.map((item) => ({
      key: item._key,
      text: item.text,
    })),
  }
}
