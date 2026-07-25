import type { SanityCoffeeShowcase } from '@lib/cms/types'

export type CoffeeStoryMedia = {
  key: string
  src: string
  type: 'image' | 'video'
  mediaAlt: string
  eyebrow: string
  title: string
  caption: string
  durationMs?: number
}

export type CoffeeShowcaseContent = {
  source: 'sanity' | 'fallback'
  sectionHeading: string
  coffeeIconUrl: string
  descriptionText: string
  storyProfileLogoUrl: string
  storyProfileName: string
  storyProfileSubtitle: string
  buttonText: string | null
  buttonLink: string | null
  coffeeItems: CoffeeStoryMedia[]
}

const FALLBACK_COFFEE_SHOWCASE: CoffeeShowcaseContent = {
  source: 'fallback',
  sectionHeading: 'More Than Riding Gear\nWe Serve Great Coffee Too',
  coffeeIconUrl: '/images/firstgear-coffee/download.svg',
  descriptionText:
    'Sixthgear Moto is built around motorcycle culture, and our coffee offering is part of that experience, powered by First Gear Coffee. Drop in for trusted gear, then stay for a properly made cup in a space designed for riders and friends.',
  storyProfileLogoUrl:
    'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778578978/firstgearcoffee_logo_e6pgoq.png',
  storyProfileName: 'First Gear Coffee',
  storyProfileSubtitle: 'Fresh from the rider lounge',
  buttonText: 'Explore Our Product',
  buttonLink: '/first-gear',
  coffeeItems: [
    {
      key: 'fallback-coffee-story-1',
      src: 'https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1778579480/firstgear-video_iolpw5.mp4',
      type: 'video',
      mediaAlt: 'First Gear Coffee showcase 1',
      eyebrow: 'First Gear Coffee',
      title: "A rider's coffee stop",
      caption:
        'A warm corner inside Sixthgear where good coffee meets shop talk, quick breaks, and post-ride stories.',
      durationMs: 18000,
    },
    {
      key: 'fallback-coffee-story-2',
      src: 'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778573365/firstgearcoffee3_stckqg.jpg',
      type: 'image',
      mediaAlt: 'First Gear Coffee showcase 2',
      eyebrow: 'Freshly Pulled',
      title: 'Coffee between rides',
      caption:
        'Good brews, easy conversations, and a space made for riders to slow down before the next road.',
    },
    {
      key: 'fallback-coffee-story-3',
      src: 'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778573363/firstgearcoffee6_gmeddd.jpg',
      type: 'image',
      mediaAlt: 'First Gear Coffee showcase 3',
      eyebrow: 'Cafe Ritual',
      title: 'Built into the ride',
      caption:
        'From morning tune-ups to afternoon meetups, First Gear Coffee keeps the garage rhythm moving.',
    },
    {
      key: 'fallback-coffee-story-4',
      src: 'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778573363/firstgearcoffee5_mq91yi.jpg',
      type: 'image',
      mediaAlt: 'First Gear Coffee showcase 4',
      eyebrow: 'Rider Lounge',
      title: 'Stay a little longer',
      caption:
        'A relaxed place to recharge, check in with friends, and enjoy the culture around the bikes.',
    },
    {
      key: 'fallback-coffee-story-5',
      src: 'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778573363/firstgearcoffee4_qc4qc2.jpg',
      type: 'image',
      mediaAlt: 'First Gear Coffee showcase 5',
      eyebrow: 'First Gear Coffee',
      title: 'Served with character',
      caption:
        'Simple, thoughtful coffee made for people who care about machines, craft, and community.',
    },
    {
      key: 'fallback-coffee-story-6',
      src: 'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1778579507/firstgearcoffee8_pjcqzv.jpg',
      type: 'image',
      mediaAlt: 'First Gear Coffee showcase 6',
      eyebrow: 'Garage Cafe',
      title: 'A home base for riders',
      caption:
        'Part cafe, part rider hangout, and part pause button for anyone passing through Sixthgear.',
    },
  ],
}

export function selectCoffeeShowcaseContent(
  data: SanityCoffeeShowcase | null | undefined
): CoffeeShowcaseContent {
  if (data?.useSanityContent !== true) {
    return FALLBACK_COFFEE_SHOWCASE
  }

  return {
    source: 'sanity',
    sectionHeading: data.sectionHeading,
    coffeeIconUrl: data.coffeeIconUrl,
    descriptionText: data.descriptionText,
    storyProfileLogoUrl: data.storyProfileLogoUrl,
    storyProfileName: data.storyProfileName,
    storyProfileSubtitle: data.storyProfileSubtitle,
    buttonText: data.buttonText,
    buttonLink: data.buttonLink,
    coffeeItems: data.coffeeItems.map((item) => ({
      key: item._key,
      src: item.mediaType === 'video' ? item.videoUrl : item.imageUrl,
      type: item.mediaType,
      mediaAlt: item.imageAlt,
      eyebrow: item.eyebrow,
      title: item.title,
      caption: item.caption,
    })),
  }
}
