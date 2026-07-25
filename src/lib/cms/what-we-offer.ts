import type {
  SanityWhatWeOffer,
  SanityWhatWeOfferCard,
} from './types'
import { stegaClean } from 'next-sanity'

const cleanSanityString = stegaClean

export type WhatWeOfferContent = {
  source: 'sanity' | 'fallback'
  sectionName: string
  heading: string
  cards: Array<{
    key: string
    title: string
    backgroundImage: string
    imageAlt: string
    linkUrl: string
    buttonText: string
  }>
}

export const FALLBACK_WHAT_WE_OFFER_CONTENT: WhatWeOfferContent = {
  source: 'fallback',
  sectionName: 'What We Offer',
  heading: 'Complete Care for\nYour Ride',
  cards: [
    {
      key: 'fallback-offer-1',
      title: 'Motorcycle Service & Diagnostics',
      backgroundImage:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779165786/what-weoffer-_service_and_diagnostics_yuvrmb.png',
      imageAlt: 'Motorcycle Service & Diagnostics',
      linkUrl: '/services',
      buttonText: 'DISCOVER',
    },
    {
      key: 'fallback-offer-2',
      title: 'Parts, Accessories & Luggage',
      backgroundImage:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779179491/parts-and_accessoriess_n3k3im.png',
      imageAlt: 'Parts, Accessories & Luggage',
      linkUrl: '/store',
      buttonText: 'SHOP',
    },
    {
      key: 'fallback-offer-3',
      title: 'Rider Apparel & Gear',
      backgroundImage:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779179487/sixthgear-ridinggears_yncnuy.jpg',
      imageAlt: 'Rider Apparel & Gear',
      linkUrl: '/store',
      buttonText: 'SHOP',
    },
    {
      key: 'fallback-offer-4',
      title: 'Cafe & Rider Lounge',
      backgroundImage:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779419298/coffeerider-andlounge_nyhzp7.jpg',
      imageAlt: 'Cafe & Rider Lounge',
      linkUrl: '/first-gear',
      buttonText: 'DISCOVER',
    },
  ],
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && cleanSanityString(value).trim().length > 0
}

function isValidEditorialLink(value: string) {
  const cleanValue = cleanSanityString(value)
  if (cleanValue.startsWith('/')) return true

  try {
    const url = new URL(cleanValue)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

type CompleteWhatWeOfferCard = Omit<
  SanityWhatWeOfferCard,
  '_key' | 'title' | 'backgroundImageUrl' | 'imageAlt' | 'linkUrl' | 'buttonText'
> & {
  _key: string
  title: string
  backgroundImageUrl: string
  imageAlt: string
  linkUrl: string
  buttonText: string
}

type CompleteWhatWeOffer = Omit<
  SanityWhatWeOffer,
  'useSanityContent' | 'sectionName' | 'heading' | 'cards'
> & {
  useSanityContent: true
  sectionName: string
  heading: string
  cards: CompleteWhatWeOfferCard[]
}

function isCompleteCard(
  card: SanityWhatWeOfferCard
): card is CompleteWhatWeOfferCard {
  return (
    isNonEmptyString(card._key) &&
    isNonEmptyString(card.title) &&
    isNonEmptyString(card.backgroundImageUrl) &&
    isNonEmptyString(card.imageAlt) &&
    isNonEmptyString(card.linkUrl) &&
    isValidEditorialLink(card.linkUrl) &&
    isNonEmptyString(card.buttonText)
  )
}

export function isCompleteSanityWhatWeOffer(
  value: SanityWhatWeOffer
): value is CompleteWhatWeOffer {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.sectionName) &&
    isNonEmptyString(value.heading) &&
    Array.isArray(value.cards) &&
    value.cards.length > 0 &&
    value.cards.every(isCompleteCard)
  )
}

export function selectWhatWeOfferContent(
  value: SanityWhatWeOffer | null | undefined
): WhatWeOfferContent {
  if (!value || !isCompleteSanityWhatWeOffer(value)) {
    return FALLBACK_WHAT_WE_OFFER_CONTENT
  }

  return {
    source: 'sanity',
    sectionName: value.sectionName,
    heading: value.heading,
    cards: value.cards.map((card) => ({
      key: card._key,
      title: card.title,
      backgroundImage: card.backgroundImageUrl,
      imageAlt: card.imageAlt,
      linkUrl: card.linkUrl,
      buttonText: card.buttonText,
    })),
  }
}
