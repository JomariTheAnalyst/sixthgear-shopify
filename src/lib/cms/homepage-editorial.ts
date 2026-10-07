import type {
  SanityAboutSection,
  SanityClientTestimonials,
  SanityCtaBanner,
  SanityFranchiseSection,
  SanitySatisfiedCustomers,
  SanityStoreLocation,
} from './types'
import { stegaClean } from 'next-sanity'
import { SOCIAL_LINKS } from '@lib/business'

const cleanSanityString = stegaClean

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && cleanSanityString(value).trim().length > 0
}

function isValidLink(value: string) {
  const cleanValue = cleanSanityString(value)
  if (cleanValue.startsWith('/')) return true
  try {
    const url = new URL(cleanValue)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export type HomepageAboutContent = {
  source: 'sanity' | 'fallback'
  kicker: string
  title: string
  description: string
  highlights: string[]
  primaryCta: { text: string; link: string }
  imageTop: string
  imageBottom: string
  videoUrl: string | null
}

export const FALLBACK_HOMEPAGE_ABOUT: HomepageAboutContent = {
  source: 'fallback',
  kicker: 'About Us',
  title: 'We Offer Complete Diagnostics for Your Motorcycle',
  description:
    'Sixth Gear Moto Supply Café + Lounge is a rider-built motorcycle hub combining professional workshop service, premium accessories, riding gear, detailing, performance upgrades, and a relaxed café experience powered by First Gear Coffee.',
  highlights: [
    'Motorcycle Service and Advanced Diagnostics',
    'Parts Accessories Luggage and Communications',
    'Helmets Riding Gear and Apparel',
    'Café Lounge and Rider Community',
  ],
  primaryCta: { text: 'More About Us', link: '/about' },
  imageTop: '/images/homepage/about/about_bg.png',
  imageBottom: '/images/homepage/about/about-small.png',
  videoUrl: null,
}

export function isCompleteHomepageAbout(value: SanityAboutSection) {
  return (
    value.useCustomAbout === true &&
    isNonEmptyString(value.kicker) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.description) &&
    Array.isArray(value.highlights) &&
    value.highlights.length > 0 &&
    value.highlights.every(isNonEmptyString) &&
    isNonEmptyString(value.primaryCta?.text) &&
    isNonEmptyString(value.primaryCta?.link) &&
    isValidLink(value.primaryCta.link) &&
    isNonEmptyString(value.imageTop) &&
    isNonEmptyString(value.imageBottom)
  )
}

export function selectHomepageAboutContent(
  value: SanityAboutSection | null | undefined
): HomepageAboutContent {
  if (!value || !isCompleteHomepageAbout(value)) return FALLBACK_HOMEPAGE_ABOUT
  return {
    source: 'sanity',
    kicker: value.kicker as string,
    title: value.title as string,
    description: value.description as string,
    highlights: value.highlights as string[],
    primaryCta: value.primaryCta as { text: string; link: string },
    imageTop: value.imageTop as string,
    imageBottom: value.imageBottom as string,
    videoUrl: value.videoUrl || null,
  }
}

export type SatisfiedCustomersContent = {
  source: 'sanity' | 'fallback'
  sectionTitle: string
  customers: Array<{ key: string; name: string; imageUrl: string }>
}

const SATISFIED_CUSTOMER_IMAGES = [
  '002.jpg', '002fg.jpg', '003.jpg', '004.jpg', '004fg.jpg', '005.jpg',
  '007.jpg', '009.jpg', '010fg.jpg', '011fg.jpg', '012.jpg', '012fg.jpg',
  '013.jpg', '014.jpg', '015.jpg', '016.jpg', '018.jpg', '019.jpg', '111.jpg',
]

export const FALLBACK_SATISFIED_CUSTOMERS: SatisfiedCustomersContent = {
  source: 'fallback',
  sectionTitle: 'Sixthgear Satisfied Customers',
  customers: SATISFIED_CUSTOMER_IMAGES.map((file, index) => ({
    key: `fallback-customer-${index + 1}`,
    name: 'Sixth Gear Rider',
    imageUrl: `/images/polaroid-marquee/satisfied-customers/${file}`,
  })),
}

export function isCompleteSatisfiedCustomers(value: SanitySatisfiedCustomers) {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.sectionTitle) &&
    Array.isArray(value.customers) &&
    value.customers.length > 0 &&
    value.customers.every(
      (item) =>
        isNonEmptyString(item._key) &&
        isNonEmptyString(item.name) &&
        isNonEmptyString(item.photoUrl)
    )
  )
}

export function selectSatisfiedCustomersContent(
  value: SanitySatisfiedCustomers | null | undefined
): SatisfiedCustomersContent {
  if (!value || !isCompleteSatisfiedCustomers(value)) {
    return FALLBACK_SATISFIED_CUSTOMERS
  }
  return {
    source: 'sanity',
    sectionTitle: value.sectionTitle as string,
    customers: value.customers!.map((item) => ({
      key: item._key as string,
      name: item.name as string,
      imageUrl: item.photoUrl as string,
    })),
  }
}

export type FranchiseContent = {
  source: 'sanity' | 'fallback'
  mainTitle: string
  subtitle: string
  badge1Text: string
  badge2Text: string
  ctaLabel: string
  ctaLink: string
  leftImageUrl: string
  rightImageUrl: string
}

export const FALLBACK_FRANCHISE: FranchiseContent = {
  source: 'fallback',
  mainTitle: 'Become A Franchise Partner',
  subtitle:
    'Become a franchise partner and offer your customers premium motorcycle gear, services, and great coffee at the highest level.',
  badge1Text: 'Do you dream of opening your own moto shop & café?',
  badge2Text:
    'With Sixthgear, you have the opportunity to become part of an innovative brand.',
  ctaLabel: 'Contact us',
  ctaLink: '/contact',
  leftImageUrl: '/images/franchise/sixthgear-outside.jpg',
  rightImageUrl: '/images/franchise/sixthgear-inside.jpg',
}

export function isCompleteFranchise(value: SanityFranchiseSection) {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.mainTitle) &&
    isNonEmptyString(value.subtitle) &&
    isNonEmptyString(value.badge1Text) &&
    isNonEmptyString(value.badge2Text) &&
    isNonEmptyString(value.ctaLabel) &&
    isNonEmptyString(value.ctaLink) &&
    isValidLink(value.ctaLink) &&
    isNonEmptyString(value.leftImageUrl) &&
    isNonEmptyString(value.rightImageUrl)
  )
}

export function selectFranchiseContent(
  value: SanityFranchiseSection | null | undefined
): FranchiseContent {
  if (!value || !isCompleteFranchise(value)) return FALLBACK_FRANCHISE
  return { source: 'sanity', ...(value as Omit<FranchiseContent, 'source'>) }
}

export type ClientTestimonialsContent = {
  source: 'sanity' | 'fallback'
  sectionTitle: string
  sectionDescription: string
  testimonials: Array<{
    key: string
    name: string
    role: string
    quote: string
    avatar: string
  }>
}

const FALLBACK_TESTIMONIAL_ROWS = [
  [
    'Jones Charles',
    'Big Bike Owner',
    'Sixth Gear handled my PMS and accessory installs with care and transparency. Clean work, proper tools, and honest advice. You can tell this shop is run by riders who actually care.',
  ],
  [
    'Mike Shinoda',
    'Adventure Rider',
    "I've had multiple bikes serviced here. From diagnostics to detailing, the quality is consistent. Plus, having good coffee while waiting is a big bonus.",
  ],
  [
    'Peter Jaksen',
    'Touring Enthusiast',
    "Fast turnaround without compromising quality. They explained everything clearly and didn't upsell unnecessary work. Highly recommended for premium motorcycles.",
  ],
  [
    'Anama Menen',
    'Daily Rider',
    'From emergency towing to full service, Sixth Gear delivered. Professional team, clean shop, and very approachable staff. This is now my go-to moto shop.',
  ],
  [
    'Carlo Reyes',
    'Sportbike Rider',
    'They installed my exhaust, lights, and accessories perfectly. Wiring was clean and properly routed. Attention to detail here is on another level.',
  ],
  [
    'Mark Villanueva',
    'Big Bike First-Time Owner',
    'As a new big bike owner, I appreciated how patient and informative the team was. They guided me through proper maintenance and safety checks.',
  ],
  [
    'Jason Lim',
    'Cafe Racer Builder',
    'Great balance of technical skill and taste. They helped me with parts selection and installation without rushing the process. Solid workmanship.',
  ],
  [
    'Paolo Santos',
    'Weekend Rider',
    'Dropped by for detailing and ended up staying for coffee and conversation. Friendly atmosphere with serious service capability. Rare combination.',
  ],
  [
    'Kevin Tan',
    'Long-Distance Rider',
    "I trust Sixth Gear before any long ride. Pre-ride inspections are thorough, and they don't cut corners. Peace of mind every time.",
  ],
  [
    'Andrew Cruz',
    'Motorcycle Enthusiast',
    "Good service, fair pricing, and clear communication. You always know what you're paying for and why. That alone sets them apart.",
  ],
] as const

export const FALLBACK_CLIENT_TESTIMONIALS: ClientTestimonialsContent = {
  source: 'fallback',
  sectionTitle: 'What Clients Say',
  sectionDescription: 'Trusted Motorcycle Service, Gear & Rider Experience',
  testimonials: FALLBACK_TESTIMONIAL_ROWS.map(([name, role, quote], index) => ({
    key: `fallback-testimonial-${index + 1}`,
    name,
    role,
    quote,
    avatar: '',
  })),
}

export function isCompleteClientTestimonials(value: SanityClientTestimonials) {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.sectionTitle) &&
    isNonEmptyString(value.sectionDescription) &&
    Array.isArray(value.testimonials) &&
    value.testimonials.length > 0 &&
    value.testimonials.every(
      (item) =>
        isNonEmptyString(item._key) &&
        isNonEmptyString(item.name) &&
        isNonEmptyString(item.role) &&
        isNonEmptyString(item.quote)
    )
  )
}

export function selectClientTestimonialsContent(
  value: SanityClientTestimonials | null | undefined
): ClientTestimonialsContent {
  if (!value || !isCompleteClientTestimonials(value)) {
    return FALLBACK_CLIENT_TESTIMONIALS
  }
  return {
    source: 'sanity',
    sectionTitle: value.sectionTitle as string,
    sectionDescription: value.sectionDescription as string,
    testimonials: value.testimonials!.map((item) => ({
      key: item._key as string,
      name: item.name,
      role: item.role as string,
      quote: item.quote,
      avatar: '',
    })),
  }
}

export type StoreLocationContent = {
  source: 'sanity' | 'fallback'
  storeName: string
  address: string
  phone: string
  hours: string
  googleMapsUrl: string
}

export const FALLBACK_STORE_LOCATION: StoreLocationContent = {
  source: 'fallback',
  storeName: 'Sixth Gear Moto Supply Cafe + Lounge',
  address: '3610 Bautista St, Makati City, Metro Manila',
  phone: '0995 093 0157',
  hours: 'Monday - Sunday | 10:00 AM - 7:00 PM',
  googleMapsUrl: 'https://maps.app.goo.gl/qbVoZTzCk7sBENrN7',
}

export function isCompleteStoreLocation(value: SanityStoreLocation) {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.storeName) &&
    isNonEmptyString(value.address) &&
    isNonEmptyString(value.phone) &&
    isNonEmptyString(value.hours) &&
    isNonEmptyString(value.googleMapsUrl) &&
    isValidLink(value.googleMapsUrl)
  )
}

export function selectStoreLocationContent(
  value: SanityStoreLocation | null | undefined
): StoreLocationContent {
  if (!value || !isCompleteStoreLocation(value)) return FALLBACK_STORE_LOCATION
  return { source: 'sanity', ...(value as Omit<StoreLocationContent, 'source'>) }
}

export type CtaBannerContent = {
  source: 'sanity' | 'fallback'
  preTitle: string
  headline: string
  headlineHighlight: string
  buttonLabel: string
  buttonLink: string
  footerTagline: string
  socialLinks: { instagram: string; facebook: string; tiktok: string }
}

export const FALLBACK_CTA_BANNER: CtaBannerContent = {
  source: 'fallback',
  preTitle: 'Ready to upgrade your ride?',
  headline: "We've got\nthe gear\nwaiting for you.",
  headlineHighlight: 'for you.',
  buttonLabel: 'Shop Now',
  buttonLink: '/store',
  footerTagline:
    'Sixth Gear Moto Supply is a premium motorcycle supply shop and motorcycle service center based in Makati City.',
  socialLinks: { ...SOCIAL_LINKS },
}

export function isCompleteCtaBanner(value: SanityCtaBanner) {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.preTitle) &&
    isNonEmptyString(value.headline) &&
    isNonEmptyString(value.headlineHighlight) &&
    isNonEmptyString(value.buttonLabel) &&
    isNonEmptyString(value.buttonLink) &&
    isValidLink(value.buttonLink) &&
    isNonEmptyString(value.footerTagline) &&
    isNonEmptyString(value.socialLinks?.instagram) &&
    isNonEmptyString(value.socialLinks?.facebook) &&
    isNonEmptyString(value.socialLinks?.tiktok)
  )
}

export function selectCtaBannerContent(
  value: SanityCtaBanner | null | undefined
): CtaBannerContent {
  if (!value || !isCompleteCtaBanner(value)) return FALLBACK_CTA_BANNER
  return {
    source: 'sanity',
    preTitle: value.preTitle as string,
    headline: value.headline as string,
    headlineHighlight: value.headlineHighlight as string,
    buttonLabel: value.buttonLabel as string,
    buttonLink: value.buttonLink as string,
    footerTagline: value.footerTagline as string,
    socialLinks: value.socialLinks as CtaBannerContent['socialLinks'],
  }
}
