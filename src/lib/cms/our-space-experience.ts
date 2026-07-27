import type {
  SanityOurSpaceExperience,
  SanityOurSpaceExperienceItem,
} from './types'
import { stegaClean } from 'next-sanity'

const cleanSanityString = stegaClean

export type OurSpaceExperienceContent = {
  source: 'sanity' | 'fallback'
  sectionTitle: string
  sectionDescription: string
  items: Array<{
    key: string
    title: string
    description: string
    imageUrl: string
    imageAlt: string
  }>
}

export const FALLBACK_OUR_SPACE_EXPERIENCE: OurSpaceExperienceContent = {
  source: 'fallback',
  sectionTitle: 'Our Space & Experience',
  sectionDescription: 'Great coffee, good rides, and better conversations.',
  items: [
    {
      key: 'fallback-space-coffee',
      title: 'Signature Coffee & Brews',
      description:
        'Carefully crafted coffee using quality beans, brewed to fuel riders, creatives, and everyday coffee lovers.',
      imageUrl:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778571332/signature_coffee_itsxtr.jpg',
      imageAlt: 'Signature coffee prepared in the SixthGear café',
    },
    {
      key: 'fallback-space-lounge',
      title: 'Rider Lounge & Hangout',
      description:
        'A relaxed cafe and lounge where riders unwind, connect, and share stories between rides and wrench sessions.',
      imageUrl:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778571332/rider_lounge_wbwkpn.jpg',
      imageAlt: 'SixthGear rider lounge and hangout space',
    },
    {
      key: 'fallback-space-community',
      title: 'Community & Meetups',
      description:
        'A welcoming space for rider meetups, small events, and casual gatherings built around coffee and motorcycle culture.',
      imageUrl:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778571330/community_and_meetups_zsfilb.jpg',
      imageAlt: 'Riders gathering at a SixthGear community meetup',
    },
  ],
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && cleanSanityString(value).trim().length > 0
}

type CompleteItem = SanityOurSpaceExperienceItem & {
  _key: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
}

function isCompleteItem(
  item: SanityOurSpaceExperienceItem | null
): item is CompleteItem {
  return Boolean(
    item &&
      isNonEmptyString(item._key) &&
      isNonEmptyString(item.title) &&
      isNonEmptyString(item.description) &&
      isNonEmptyString(item.imageUrl) &&
      isNonEmptyString(item.imageAlt)
  )
}

export function isCompleteSanityOurSpaceExperience(
  value: SanityOurSpaceExperience
) {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.sectionTitle) &&
    isNonEmptyString(value.sectionDescription) &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(isCompleteItem)
  )
}

export function selectOurSpaceExperienceContent(
  value: SanityOurSpaceExperience | null | undefined
): OurSpaceExperienceContent {
  if (!value || !isCompleteSanityOurSpaceExperience(value)) {
    return FALLBACK_OUR_SPACE_EXPERIENCE
  }

  return {
    source: 'sanity',
    sectionTitle: value.sectionTitle as string,
    sectionDescription: value.sectionDescription as string,
    items: (value.items as CompleteItem[]).map((item) => ({
      key: item._key,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
    })),
  }
}
