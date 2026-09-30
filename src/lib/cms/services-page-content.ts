import { stegaClean } from 'next-sanity'

import { companyData } from '../company-data.ts'
import {
  getServiceImageBySlug,
  type ServiceCategory,
} from '../services-data'
import type {
  SanityService,
  SanityServicesBrandsWeService,
  SanityServicesExpertiseStats,
  SanityServicesGallery,
  SanityServicesGrid,
  SanityServicesHero,
  SanityServicesPage,
  SanityServicesProcessOfWork,
} from './types'
import {
  selectPageCtaContent,
  type PageCtaContent,
} from './page-cta.ts'

type Source = 'sanity' | 'fallback'

export type ServicesHeroContent = {
  source: Source
  title: string
  shortTitle: string
  description: string
  heroImage: string
  imageAlt: string
}

export type ServicesExpertiseContent = {
  source: Source
  heading: string
  description: string
  highlights: Array<{
    key: string
    title: string
    description: string
  }>
  assistance: {
    heading: string
    description: string
    buttonText: string
    buttonLink: string
  }
  backgroundImage: string
  backgroundImageAlt: string
}

export type ServicesBrandsContent = {
  source: Source
  sectionHeading: string
  brands: Array<{
    key: string
    name: string
    logoUrl: string
    logoAlt: string
  }>
}

export type ServicesGridContent = {
  source: Source
  sectionHeading: string
  useCustomServices: boolean
  services: Array<{
    key: string
    documentId?: string
    title: string
    description: string
    slug: string
    icon: string
    imageUrl: string
    imageAlt: string
  }>
}

export type ServicesProcessContent = {
  source: Source
  sectionHeading: string
  steps: Array<{
    key: string
    number: string
    title: string
    description: string
  }>
}

export type ServicesGalleryContent = {
  source: Source
  heading: string
  description: string
  profileName: string
  profileSubtitle: string
  profileLogoUrl: string
  profileLogoAlt: string
  buttonText: string
  items: Array<{
    key: string
    mediaType: 'video' | 'image'
    mediaUrl: string
    label: string
  }>
}

export const FALLBACK_SERVICES_HERO: ServicesHeroContent = {
  source: 'fallback',
  title: 'Our Services',
  shortTitle: 'Services',
  description:
    'Complete motorcycle care from routine maintenance to performance upgrades. Expert technicians, quality parts, and attention to detail.',
  heroImage: '/images/services/_LIZ7072_banner_1905x635.jpg',
  imageAlt: 'A SixthGear mechanic tightening a bolt on a Royal Enfield in the workshop',
}

export const FALLBACK_SERVICES_EXPERTISE: ServicesExpertiseContent = {
  source: 'fallback',
  heading: companyData.serviceExpertise.heading,
  description: companyData.serviceExpertise.description,
  highlights: companyData.serviceExpertise.highlights.map((item, index) => ({
    key: `fallback-expertise-${index}`,
    ...item,
  })),
  assistance: {
    heading: companyData.serviceExpertise.assistance.heading,
    description: companyData.serviceExpertise.assistance.description,
    buttonText: companyData.serviceExpertise.assistance.buttonText,
    buttonLink: companyData.serviceExpertise.assistance.buttonLink,
  },
  backgroundImage: '/images/sixthgear-workshop.jpg',
  backgroundImageAlt: 'Sixthgear workshop',
}

export const FALLBACK_SERVICES_BRANDS: ServicesBrandsContent = {
  source: 'fallback',
  sectionHeading: 'Brands We Service and support',
  brands: [
    {
      key: 'fallback-brand-bmw',
      name: 'BMW',
      logoUrl: '/images/brands/brands-logo/bmw-logo.svg',
      logoAlt: 'BMW logo',
    },
    {
      key: 'fallback-brand-ktm',
      name: 'KTM',
      logoUrl: '/images/brands/brands-logo/ktm-logo.svg',
      logoAlt: 'KTM logo',
    },
    {
      key: 'fallback-brand-suzuki',
      name: 'Suzuki',
      logoUrl: '/images/brands/brands-logo/suzuki-logo.svg',
      logoAlt: 'Suzuki logo',
    },
    {
      key: 'fallback-brand-kawasaki',
      name: 'Kawasaki',
      logoUrl: '/images/brands/brands-logo/kawasaki-logo.svg',
      logoAlt: 'Kawasaki logo',
    },
    {
      key: 'fallback-brand-royal-enfield',
      name: 'Royal Enfield',
      logoUrl: '/images/brands/brands-logo/royal-enfield-logo.svg',
      logoAlt: 'Royal Enfield logo',
    },
    {
      key: 'fallback-brand-yamaha',
      name: 'Yamaha',
      logoUrl: '/images/brands/brands-logo/yamaha.svg',
      logoAlt: 'Yamaha logo',
    },
  ],
}

export const FALLBACK_SERVICES_PROCESS: ServicesProcessContent = {
  source: 'fallback',
  sectionHeading: 'Building better rides through careful workmanship.',
  steps: [
    {
      key: 'fallback-process-intake',
      number: '01',
      title: 'Consultation & Service Intake',
      description:
        'We start by understanding the motorcycle, the riding concerns, and the work required. This gives the team a clear service brief before any technical work begins.',
    },
    {
      key: 'fallback-process-planning',
      number: '02',
      title: 'Inspection & Work Planning',
      description:
        'Our technicians inspect the bike, identify the priority issues, and map out the correct service path. Parts, labor scope, and timing are aligned before execution.',
    },
    {
      key: 'fallback-process-execution',
      number: '03',
      title: 'Workshop Execution',
      description:
        'Approved work is carried out using the proper tools, service procedures, and parts. Every task is handled with the same focus on reliability, cleanliness, and finish quality.',
    },
    {
      key: 'fallback-process-handover',
      number: '04',
      title: 'Final Check & Handover',
      description:
        'Before release, the motorcycle goes through a final review so the completed work is verified and ready for handover. The result is a clear, professional service experience from start to finish.',
    },
  ],
}

export const FALLBACK_SERVICES_GALLERY: ServicesGalleryContent = {
  source: 'fallback',
  heading: 'See the workshop before you book',
  description:
    'A quick look inside the Sixthgear Moto service floor: real hands, real bikes, and the kind of careful workshop rhythm that turns a booking into a smoother, safer ride.',
  profileName: 'Sixthgear Moto',
  profileSubtitle: 'Workshop stories',
  profileLogoUrl: '/images/logo/Sixthgear_Moto_Supply-removebg-preview.png',
  profileLogoAlt: 'Sixthgear Moto logo',
  buttonText: 'Book Now',
  items: [
    'services-gallery1_opnub5',
    'services-gallery6_wp4xru',
    'services-gallery4_ragdgc',
    'snapsave-app_1B4YD3Ug6a_hd_xyvrr1',
    'services-gallery5_d5dgo5',
    'services-gallery3_ephlaj',
    'services-gallery2_y14j4u',
  ].map((asset, index) => ({
    key: `fallback-gallery-${index}`,
    mediaType: 'video' as const,
    mediaUrl: `https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto/f_auto/v1779688${
      index === 0
        ? '482'
        : index === 1
          ? '481'
          : index === 2
            ? '480'
            : index === 3
              ? '479'
              : index === 4
                ? '478'
                : '477'
    }/${asset}.mp4`,
    label: `Sixthgear services gallery video ${index + 1}`,
  })),
}

const FALLBACK_GRID_SERVICES = [
  ['Service & Preventive Maintenance', 'Keep your motorcycle running at peak performance with comprehensive periodic maintenance and seasonal care.', 'wrench', 'preventive-maintenance'],
  ['Repairs & Diagnostics', 'Advanced diagnostic equipment and expert technicians to identify and fix any issue with precision.', 'diagnostics', 'repairs-diagnostics'],
  ['Accessories & Custom Setup', 'Transform your ride with professional accessory installation, lighting upgrades, and luggage systems.', 'accessories', 'accessories-installation'],
  ['Wheels & Drivetrain', 'Expert care for your wheels and drivetrain. Proper alignment and balanced wheels for the ultimate ride.', 'tire', 'wheels-drivetrain'],
  ['Detailing & Protection', 'Keep your motorcycle looking showroom-fresh with our professional detailing and ceramic coating.', 'detailing', 'detailing-protection'],
  ['Performance Upgrades', "Unlock your motorcycle's full potential with performance upgrades, exhaust systems, and tuning.", 'upgrade', 'performance-upgrades'],
  ['Roadside Assistance & Recovery', 'Stranded on the road? Our emergency recovery team is ready to help. Fast response times and professional handling of your motorcycle.', 'recovery', 'roadside-assistance'],
  ['Rider Support & Convenience', "Beyond repairs, we offer comprehensive rider support services. From pre-purchase inspections to warranty assistance, we've got you covered.", 'support', 'rider-support'],
] as const

const LOCAL_ICON_KEYS: Record<string, string> = {
  'preventive-maintenance': 'wrench',
  'repairs-diagnostics': 'diagnostics',
  'accessories-installation': 'accessories',
  'wheels-drivetrain': 'tire',
  'detailing-protection': 'detailing',
  'performance-upgrades': 'upgrade',
  'roadside-assistance': 'recovery',
  'rider-support': 'support',
}

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && stegaClean(value).trim().length > 0
}

function invalidEnabled(
  section: { useSanityContent?: boolean | null } | null | undefined,
  name: string
) {
  if (
    section?.useSanityContent === true &&
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'undefined'
  ) {
    console.warn(
      `[Sanity] Services ${name} is enabled but incomplete. Rendering its complete local fallback.`
    )
  }
}

function fallbackGrid(localServices?: ServiceCategory[] | null): ServicesGridContent {
  const services =
    localServices && localServices.length > 0
      ? localServices.map((service) => ({
          key: `fallback-service-${service.slug}`,
          title: service.title,
          description: service.shortDescription ?? service.description,
          slug: service.slug,
          icon: LOCAL_ICON_KEYS[service.slug] ?? 'wrench',
          imageUrl: service.heroImage ?? service.image,
          imageAlt: `${service.title} at Sixthgear`,
        }))
      : FALLBACK_GRID_SERVICES.map(
          ([title, description, icon, slug]) => ({
            key: `fallback-service-${slug}`,
            title,
            description,
            slug,
            icon,
            imageUrl: getServiceImageBySlug(slug),
            imageAlt: `${title} at Sixthgear`,
          })
        )
  return {
    source: 'fallback',
    sectionHeading: 'Everything your ride needs, handled right',
    useCustomServices: false,
    services,
  }
}

function completeService(service: SanityService | null | undefined) {
  return Boolean(
    service &&
      nonEmpty(service._id) &&
      nonEmpty(service.title) &&
      nonEmpty(service.shortDescription) &&
      nonEmpty(service.slug) &&
      nonEmpty(service.icon)
  )
}

export function selectServicesHeroContent(
  value: SanityServicesHero | null | undefined
): ServicesHeroContent {
  if (
    value?.useSanityContent !== true ||
    !nonEmpty(value.title) ||
    !nonEmpty(value.shortTitle) ||
    !nonEmpty(value.description) ||
    !nonEmpty(value.heroImageUrl) ||
    !nonEmpty(value.heroImageAlt)
  ) {
    invalidEnabled(value, 'Hero')
    return FALLBACK_SERVICES_HERO
  }
  return {
    source: 'sanity',
    title: value.title,
    shortTitle: value.shortTitle,
    description: value.description,
    heroImage: value.heroImageUrl,
    imageAlt: value.heroImageAlt,
  }
}

export function selectServicesExpertiseContent(
  value: SanityServicesExpertiseStats | null | undefined
): ServicesExpertiseContent {
  const valid =
    value?.useSanityContent === true &&
    nonEmpty(value.sectionHeading) &&
    nonEmpty(value.sectionDescription) &&
    Array.isArray(value.highlights) &&
    value.highlights.length > 0 &&
    value.highlights.every(
      (item) =>
        item &&
        nonEmpty(item._key) &&
        nonEmpty(item.title) &&
        nonEmpty(item.description)
    ) &&
    nonEmpty(value.assistance?.heading) &&
    nonEmpty(value.assistance?.description) &&
    nonEmpty(value.assistance?.buttonText) &&
    nonEmpty(value.assistance?.buttonLink) &&
    nonEmpty(value.backgroundImageUrl) &&
    nonEmpty(value.backgroundImageAlt)

  if (!valid) {
    invalidEnabled(value, 'Expertise & Assistance')
    return FALLBACK_SERVICES_EXPERTISE
  }
  return {
    source: 'sanity',
    heading: value!.sectionHeading!,
    description: value!.sectionDescription!,
    highlights: value!.highlights!.map((item) => ({
      key: item!._key!,
      title: item!.title!,
      description: item!.description!,
    })),
    assistance: {
      heading: value!.assistance!.heading!,
      description: value!.assistance!.description!,
      buttonText: value!.assistance!.buttonText!,
      buttonLink: value!.assistance!.buttonLink!,
    },
    backgroundImage: value!.backgroundImageUrl!,
    backgroundImageAlt: value!.backgroundImageAlt!,
  }
}

export function selectServicesBrandsContent(
  value: SanityServicesBrandsWeService | null | undefined
): ServicesBrandsContent {
  const valid =
    value?.useSanityContent === true &&
    nonEmpty(value.sectionHeading) &&
    Array.isArray(value.brands) &&
    value.brands.length > 0 &&
    value.brands.every(
      (item) =>
        item &&
        nonEmpty(item._key) &&
        nonEmpty(item.name) &&
        nonEmpty(item.logoUrl) &&
        nonEmpty(item.logoAlt)
    )
  if (!valid) {
    invalidEnabled(value, 'Brands We Service')
    return FALLBACK_SERVICES_BRANDS
  }
  return {
    source: 'sanity',
    sectionHeading: value!.sectionHeading!,
    brands: value!.brands!.map((item) => ({
      key: item!._key!,
      name: item!.name!,
      logoUrl: item!.logoUrl!,
      logoAlt: item!.logoAlt!,
    })),
  }
}

export function selectServicesGridContent(
  value: SanityServicesGrid | null | undefined,
  localServices: ServiceCategory[] | null | undefined,
  cmsServices: SanityService[] | null | undefined
): ServicesGridContent {
  const customServices =
    value?.featuredServices
      ?.filter((entry) => entry && nonEmpty(entry._key) && completeService(entry.service))
      .map((entry) => ({ key: entry!._key!, service: entry!.service! })) ?? []
  const automaticServices = (cmsServices ?? []).filter(completeService)
  const selected = value?.useCustomServices ? customServices : automaticServices.map((service) => ({
    key: service._id,
    service,
  }))
  const valid =
    value?.useSanityContent === true &&
    nonEmpty(value.sectionHeading) &&
    selected.length > 0 &&
    (value.useCustomServices
      ? selected.length === (value.featuredServices?.length ?? 0)
      : selected.length === (cmsServices?.length ?? 0))

  if (!valid) {
    invalidEnabled(value, 'Services Grid')
    return fallbackGrid(localServices)
  }

  return {
    source: 'sanity',
    sectionHeading: value!.sectionHeading!,
    useCustomServices: value!.useCustomServices === true,
    services: selected.map(({ key, service }) => ({
      key,
      documentId: service._id,
      title: service.title!,
      description: service.shortDescription!,
      slug: service.slug!,
      icon: service.icon!,
      imageUrl: service.heroImageUrl || getServiceImageBySlug(service.slug!),
      imageAlt: `${service.title!} at Sixthgear`,
    })),
  }
}

export function selectServicesProcessContent(
  value: SanityServicesProcessOfWork | null | undefined
): ServicesProcessContent {
  const valid =
    value?.useSanityContent === true &&
    nonEmpty(value.sectionHeading) &&
    Array.isArray(value.steps) &&
    value.steps.length > 0 &&
    value.steps.every(
      (step) =>
        step &&
        nonEmpty(step._key) &&
        nonEmpty(step.number) &&
        nonEmpty(step.title) &&
        nonEmpty(step.description)
    )
  if (!valid) {
    invalidEnabled(value, 'Process of Work')
    return FALLBACK_SERVICES_PROCESS
  }
  return {
    source: 'sanity',
    sectionHeading: value!.sectionHeading!,
    steps: value!.steps!.map((step) => ({
      key: step!._key!,
      number: step!.number!,
      title: step!.title!,
      description: step!.description!,
    })),
  }
}

export function selectServicesGalleryContent(
  value: SanityServicesGallery | null | undefined
): ServicesGalleryContent {
  const valid =
    value?.useSanityContent === true &&
    nonEmpty(value.heading) &&
    nonEmpty(value.description) &&
    nonEmpty(value.profileName) &&
    nonEmpty(value.profileSubtitle) &&
    nonEmpty(value.profileLogoUrl) &&
    nonEmpty(value.profileLogoAlt) &&
    nonEmpty(value.buttonText) &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(
      (item) =>
        item &&
        nonEmpty(item._key) &&
        (item.mediaType === 'video' || item.mediaType === 'image') &&
        nonEmpty(item.mediaUrl) &&
        nonEmpty(item.label)
    )
  if (!valid) {
    invalidEnabled(value, 'Services Gallery')
    return FALLBACK_SERVICES_GALLERY
  }
  return {
    source: 'sanity',
    heading: value!.heading!,
    description: value!.description!,
    profileName: value!.profileName!,
    profileSubtitle: value!.profileSubtitle!,
    profileLogoUrl: value!.profileLogoUrl!,
    profileLogoAlt: value!.profileLogoAlt!,
    buttonText: value!.buttonText!,
    items: value!.items!.map((item) => ({
      key: item!._key!,
      mediaType: item!.mediaType!,
      mediaUrl: item!.mediaUrl!,
      label: item!.label!,
    })),
  }
}

export type ServicesPageContent = {
  hero: ServicesHeroContent
  expertiseStats: ServicesExpertiseContent
  brandsWeService: ServicesBrandsContent
  servicesGrid: ServicesGridContent
  processOfWork: ServicesProcessContent
  servicesGallery: ServicesGalleryContent
  ctaBanner: PageCtaContent
}

export function selectServicesPageContent(
  value: SanityServicesPage | null | undefined,
  localServices: ServiceCategory[] | null | undefined,
  cmsServices: SanityService[] | null | undefined
): ServicesPageContent {
  return {
    hero: selectServicesHeroContent(value?.hero),
    expertiseStats: selectServicesExpertiseContent(value?.expertiseStats),
    brandsWeService: selectServicesBrandsContent(value?.brandsWeService),
    servicesGrid: selectServicesGridContent(
      value?.servicesGrid,
      localServices,
      cmsServices
    ),
    processOfWork: selectServicesProcessContent(value?.processOfWork),
    servicesGallery: selectServicesGalleryContent(value?.servicesGallery),
    ctaBanner: selectPageCtaContent(
      value?.ctaBanner,
      'Services CTA Banner'
    ),
  }
}
