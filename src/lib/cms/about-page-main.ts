import { stegaClean } from 'next-sanity'

import type {
  SanityAboutPage,
  SanityAboutPageCeoQuote,
  SanityAboutPageHero,
  SanityAboutPageOurValues,
  SanityAboutPageStory,
  SanityAboutPageWhyChooseUs,
} from './types'
import {
  selectPageCtaContent,
  type PageCtaContent,
} from './page-cta.ts'

type Source = 'sanity' | 'fallback'

export type AboutHeroSectionContent = {
  source: Source
  title: string
  subtitle: string
  backgroundImage: string
  backgroundImageAlt: string
}

export type AboutStorySectionContent = {
  source: Source
  items: Array<{
    key: string
    heading: string
    body: string
    imageUrl: string
    imageAlt: string
  }>
}

export type AboutWhyChooseUsSectionContent = {
  source: Source
  sectionLabel: string
  heading: string
  subtitle: string
  items: Array<{
    key: string
    title: string
    description: string
    icon: string
  }>
  topImageUrl: string
  topImageAlt: string
  bottomImageUrl: string
  bottomImageAlt: string
}

export type AboutValuesSectionContent = {
  source: Source
  heading: string
  description: string
  cards: Array<{
    key: string
    title: string
    description: string
    icon: string
  }>
}

export type AboutCeoQuoteSectionContent = {
  source: Source
  quoteText: string
  highlightedPhrase: string
  ceoName: string
  ceoTitle: string
  ceoPhotoUrl: string
  ceoPhotoDescription: string
}

export const FALLBACK_ABOUT_HERO_SECTION: AboutHeroSectionContent = {
  source: 'fallback',
  title: 'About Us',
  subtitle: 'We Offer Complete Diagnostics and Care for Your Motorcycle',
  backgroundImage: '/images/sixthgearleftsideimg.jpg',
  backgroundImageAlt: 'SixthGear Moto workshop and rider space',
}

export const FALLBACK_ABOUT_STORY_SECTION: AboutStorySectionContent = {
  source: 'fallback',
  items: [
    {
      key: 'fallback-story-riders',
      heading: 'At Our Core, We Are Riders',
      body: "When we built Sixth Gear, we didn't just want to open another shop. We wanted a place we'd actually want to hang out in ourselves. A true hub where serious riders could get professional, no-compromise servicing for their big bikes—whether it's routine PMS, tough repairs, or dialing in that perfect performance upgrade. We treat every machine rolling into our bays with the exact same precision and respect we give our own bikes.",
      imageUrl: '/images/sixthgear-workshop.jpg',
      imageAlt: 'Sixthgear Workshop',
    },
    {
      key: 'fallback-story-quality',
      heading: 'No Shortcuts On Quality',
      body: "Riding isn't just transport; it's a lifestyle. That's why we stock only the gear, parts, and accessories that we personally trust and use on the open road. If we won't bet our own safety on a helmet or throw a specific brand of luggage on our own touring rigs, you won't find it on our shelves. We're committed to bringing you the absolute highest standard of rider apparel because we know exactly what is at stake when you twist the throttle.",
      imageUrl:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779091975/sixthgear-shop_gxf8bi.png',
      imageAlt:
        'Sixthgear Moto shop interior with riding gear and accessories',
    },
    {
      key: 'fallback-story-community',
      heading: 'Fueling The Community',
      body: "A great ride always starts or ends with great coffee. That's the reason we integrated First Gear Coffee right into our space. It's more than just an espresso machine in a waiting area—it's a sanctuary for the riding community. We organize events, foster real friendships, and provide a place where you can grab a solid cup of coffee, talk shop, and swap stories with people who share the exact same passion for two wheels.",
      imageUrl:
        'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779090174/sixthgear-event_ossb2m.jpg',
      imageAlt: 'Sixthgear Moto rider community event',
    },
  ],
}

export const FALLBACK_ABOUT_WHY_CHOOSE_US: AboutWhyChooseUsSectionContent = {
  source: 'fallback',
  sectionLabel: 'Why Sixth Gear',
  heading: 'Why Choose Us?',
  subtitle:
    "We didn't build Sixth Gear to be just another service shop. We built it to be the destination every Filipino rider deserves—professional, passionate, and always riding alongside you.",
  items: [
    {
      key: 'fallback-why-workshop',
      icon: 'wrench',
      title: 'Expert Workshop You Can Trust',
      description:
        'Our certified technicians handle everything from routine PMS to advanced ECU diagnostics and full performance builds—on any big bike, any brand, zero shortcuts.',
    },
    {
      key: 'fallback-why-gear',
      icon: 'shield',
      title: "Only Gear We'd Ride With",
      description:
        "Every helmet, accessory, and piece of apparel on our floor has been vetted the way we vet our own gear. We don't stock it unless we'd bet our safety on it.",
    },
    {
      key: 'fallback-why-community',
      icon: 'users',
      title: 'A Real Rider Community',
      description:
        "We host rides, meetups, and events that bring serious riders together. Sixth Gear isn't just a stop—it's a home base for the Filipino motorcycle community.",
    },
    {
      key: 'fallback-why-coffee',
      icon: 'coffee',
      title: 'More Than a Shop',
      description:
        'Fuel up at First Gear Coffee while your bike is being serviced. Our rider lounge is built for that in-between time—comfortable, honest, and unmistakably ours.',
    },
  ],
  topImageUrl:
    'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779090209/sixthgear-bikebeingserviced_nxzbdw.jpg',
  topImageAlt: 'Sixthgear technician servicing a motorcycle',
  bottomImageUrl:
    'https://res.cloudinary.com/djn9ubf6a/image/upload/q_auto/f_auto/v1779090175/rider-story_nhopsn.jpg',
  bottomImageAlt: 'Rider story moment at Sixth Gear',
}

export const FALLBACK_ABOUT_VALUES: AboutValuesSectionContent = {
  source: 'fallback',
  heading: 'Our Values',
  description:
    'The principles that steer our workshop, curate our gear, and brew our coffee. Built by riders, for riders.',
  cards: [
    {
      key: 'fallback-value-precision',
      title: 'Precision & Expertise',
      description:
        'We treat every motorcycle as our own, delivering meticulous service, diagnostics, and performance upgrades with zero compromises.',
      icon: 'wrench',
    },
    {
      key: 'fallback-value-community',
      title: 'Community First',
      description:
        'More than customers, we build a family. A true hub for riders to connect, share stories, and build lasting friendships on and off the road.',
      icon: 'users',
    },
    {
      key: 'fallback-value-quality',
      title: 'Uncompromising Quality',
      description:
        'We only stock, sell, and recommend gear, parts, and accessories that we personally trust, test, and use for our own rides.',
      icon: 'shield',
    },
    {
      key: 'fallback-value-experience',
      title: "The Rider's Experience",
      description:
        'More than just a workshop—a destination. Refuel with First Gear Coffee, relax in our lounge, and immerse yourself in real motorcycle culture.',
      icon: 'coffee',
    },
    {
      key: 'fallback-value-passion',
      title: 'Passion Driven',
      description:
        'Our pure enthusiasm for two wheels fuels our dedication to continuous learning, improvement, and innovation in everything we do.',
      icon: 'energy',
    },
    {
      key: 'fallback-value-trust',
      title: 'Integrity & Trust',
      description:
        "Honest advice, transparent pricing, and a solid commitment to doing what's right for you, your safety, and your machine.",
      icon: 'award',
    },
  ],
}

export const FALLBACK_ABOUT_CEO_QUOTE: AboutCeoQuoteSectionContent = {
  source: 'fallback',
  quoteText:
    "More than a shop, Sixth Gear is a rider's space. A place to wrench, ride, refuel, and connect. Whether you're here for service, upgrades, or simply good coffee and conversation, you're always welcome at Sixth Gear.",
  highlightedPhrase: "rider's space",
  ceoName: 'Cap. Gregory Nick Sevilla',
  ceoTitle: 'CEO & Founder, Sixthgear Motosupply',
  ceoPhotoUrl: '/images/ceo/capgreg.jpg',
  ceoPhotoDescription:
    'Portrait of Cap. Gregory Nick Sevilla, founder of SixthGearMoto, standing in the workshop.',
}

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && stegaClean(value).trim().length > 0
}

function invalidEnabled(section: { useSanityContent?: boolean | null } | null | undefined, name: string) {
  if (
    section?.useSanityContent === true &&
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'undefined'
  ) {
    console.warn(
      `[Sanity] About ${name} is enabled but incomplete. Rendering its complete local fallback.`
    )
  }
}

export function isCompleteAboutHero(value: SanityAboutPageHero | null | undefined) {
  return Boolean(
    value?.useSanityContent === true &&
      nonEmpty(value.title) &&
      nonEmpty(value.description) &&
      nonEmpty(value.backgroundImageUrl) &&
      nonEmpty(value.backgroundImageAlt)
  )
}

export function selectAboutHeroContent(
  value: SanityAboutPageHero | null | undefined
): AboutHeroSectionContent {
  if (!isCompleteAboutHero(value)) {
    invalidEnabled(value, 'Hero')
    return FALLBACK_ABOUT_HERO_SECTION
  }
  return {
    source: 'sanity',
    title: value!.title!,
    subtitle: value!.description!,
    backgroundImage: value!.backgroundImageUrl!,
    backgroundImageAlt: value!.backgroundImageAlt!,
  }
}

export function isCompleteAboutStory(
  value: SanityAboutPageStory | null | undefined
) {
  return Boolean(
    value?.useSanityContent === true &&
      Array.isArray(value.items) &&
      value.items.length > 0 &&
      value.items.every(
        (item) =>
          item &&
          nonEmpty(item._key) &&
          nonEmpty(item.heading) &&
          nonEmpty(item.body) &&
          nonEmpty(item.imageUrl) &&
          nonEmpty(item.imageAlt)
      )
  )
}

export function selectAboutStoryContent(
  value: SanityAboutPageStory | null | undefined
): AboutStorySectionContent {
  if (!isCompleteAboutStory(value)) {
    invalidEnabled(value, 'Our Story')
    return FALLBACK_ABOUT_STORY_SECTION
  }
  return {
    source: 'sanity',
    items: value!.items!.map((item) => ({
      key: item!._key!,
      heading: item!.heading!,
      body: item!.body!,
      imageUrl: item!.imageUrl!,
      imageAlt: item!.imageAlt!,
    })),
  }
}

export function isCompleteAboutWhyChooseUs(
  value: SanityAboutPageWhyChooseUs | null | undefined
) {
  return Boolean(
    value?.useSanityContent === true &&
      nonEmpty(value.sectionLabel) &&
      nonEmpty(value.heading) &&
      nonEmpty(value.subtitle) &&
      Array.isArray(value.items) &&
      value.items.length > 0 &&
      value.items.every(
        (item) =>
          nonEmpty(item?._key) &&
          nonEmpty(item?.title) &&
          nonEmpty(item?.description) &&
          nonEmpty(item?.icon)
      ) &&
      nonEmpty(value.topImageUrl) &&
      nonEmpty(value.topImageAlt) &&
      nonEmpty(value.bottomImageUrl) &&
      nonEmpty(value.bottomImageAlt)
  )
}

export function selectAboutWhyChooseUsContent(
  value: SanityAboutPageWhyChooseUs | null | undefined
): AboutWhyChooseUsSectionContent {
  if (!isCompleteAboutWhyChooseUs(value)) {
    invalidEnabled(value, 'Why Choose Us')
    return FALLBACK_ABOUT_WHY_CHOOSE_US
  }
  return {
    source: 'sanity',
    sectionLabel: value!.sectionLabel!,
    heading: value!.heading!,
    subtitle: value!.subtitle!,
    items: value!.items!.map((item) => ({
      key: item._key!,
      title: item.title!,
      description: item.description!,
      icon: item.icon!,
    })),
    topImageUrl: value!.topImageUrl!,
    topImageAlt: value!.topImageAlt!,
    bottomImageUrl: value!.bottomImageUrl!,
    bottomImageAlt: value!.bottomImageAlt!,
  }
}

export function isCompleteAboutValues(
  value: SanityAboutPageOurValues | null | undefined
) {
  return Boolean(
    value?.useSanityContent === true &&
      nonEmpty(value.heading) &&
      nonEmpty(value.description) &&
      Array.isArray(value.cards) &&
      value.cards.length > 0 &&
      value.cards.every(
        (item) =>
          item &&
          nonEmpty(item._key) &&
          nonEmpty(item.title) &&
          nonEmpty(item.description) &&
          nonEmpty(item.icon)
      )
  )
}

export function selectAboutValuesContent(
  value: SanityAboutPageOurValues | null | undefined
): AboutValuesSectionContent {
  if (!isCompleteAboutValues(value)) {
    invalidEnabled(value, 'Our Values')
    return FALLBACK_ABOUT_VALUES
  }
  return {
    source: 'sanity',
    heading: value!.heading!,
    description: value!.description!,
    cards: value!.cards!.map((item) => ({
      key: item!._key!,
      title: item!.title!,
      description: item!.description!,
      icon: item!.icon!,
    })),
  }
}

export function isCompleteAboutCeoQuote(
  value: SanityAboutPageCeoQuote | null | undefined
) {
  return Boolean(
    value?.useSanityContent === true &&
      nonEmpty(value.quoteText) &&
      nonEmpty(value.ceoName) &&
      nonEmpty(value.ceoTitle) &&
      nonEmpty(value.ceoPhotoUrl) &&
      nonEmpty(value.ceoPhotoDescription)
  )
}

export function selectAboutCeoQuoteContent(
  value: SanityAboutPageCeoQuote | null | undefined
): AboutCeoQuoteSectionContent {
  if (!isCompleteAboutCeoQuote(value)) {
    invalidEnabled(value, 'CEO Quote')
    return FALLBACK_ABOUT_CEO_QUOTE
  }
  return {
    source: 'sanity',
    quoteText: value!.quoteText!,
    highlightedPhrase:
      typeof value!.highlightedPhrase === 'string'
        ? value!.highlightedPhrase
        : '',
    ceoName: value!.ceoName!,
    ceoTitle: value!.ceoTitle!,
    ceoPhotoUrl: value!.ceoPhotoUrl!,
    ceoPhotoDescription: value!.ceoPhotoDescription!,
  }
}

export type AboutPageContent = {
  hero: AboutHeroSectionContent
  story: AboutStorySectionContent
  whyChooseUs: AboutWhyChooseUsSectionContent
  ourValues: AboutValuesSectionContent
  ceoQuote: AboutCeoQuoteSectionContent
  ctaBanner: PageCtaContent
}

export function selectAboutPageContent(
  value: SanityAboutPage | null | undefined
): AboutPageContent {
  return {
    hero: selectAboutHeroContent(value?.hero),
    whyChooseUs: selectAboutWhyChooseUsContent(value?.whyChooseUs),
    story: selectAboutStoryContent(value?.ourStory),
    ourValues: selectAboutValuesContent(value?.ourValues),
    ceoQuote: selectAboutCeoQuoteContent(value?.ceoQuote),
    ctaBanner: selectPageCtaContent(value?.ctaBanner, 'About CTA Banner'),
  }
}
