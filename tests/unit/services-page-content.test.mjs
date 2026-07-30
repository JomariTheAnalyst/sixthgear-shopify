import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  FALLBACK_SERVICES_BRANDS,
  FALLBACK_SERVICES_EXPERTISE,
  FALLBACK_SERVICES_GALLERY,
  FALLBACK_SERVICES_HERO,
  FALLBACK_SERVICES_PROCESS,
  selectServicesBrandsContent,
  selectServicesExpertiseContent,
  selectServicesGalleryContent,
  selectServicesGridContent,
  selectServicesHeroContent,
  selectServicesPageContent,
  selectServicesProcessContent,
} from '../../src/lib/cms/services-page-content.ts'
import {
  FALLBACK_PAGE_CTA,
  selectPageCtaContent,
} from '../../src/lib/cms/page-cta.ts'

const localServices = [{
  id: 'local-service',
  slug: 'local-service',
  title: 'Local Service',
  shortTitle: 'Local',
  description: 'Complete local description',
  shortDescription: 'Local description',
  image: '/local.jpg',
  items: [],
}]

const cmsService = {
  _id: 'service-cms',
  title: 'CMS Service',
  slug: 'cms-service',
  icon: 'wrench',
  shortDescription: 'CMS service description',
  fullDescription: null,
  heroImageUrl: null,
  seoTitle: null,
  seoDescription: null,
  socialImageUrl: null,
  features: null,
  localContent: null,
  internalLinks: null,
  faqItems: null,
  ctaLabel: null,
  ctaLink: null,
  displayOrder: 1,
}

const valid = {
  hero: {
    useSanityContent: true,
    title: 'Sanity Services',
    shortTitle: 'Sanity',
    description: 'Sanity hero description',
    heroImageUrl: 'https://cdn/hero.jpg',
    heroImageAlt: 'Services hero',
  },
  expertiseStats: {
    useSanityContent: true,
    sectionHeading: 'Custom expertise heading',
    sectionDescription: 'Custom expertise description',
    highlights: [{
      _key: 'highlight',
      title: 'Custom highlight',
      description: 'Custom highlight description',
    }],
    assistance: {
      heading: 'Custom assistance',
      description: 'Custom assistance description',
      buttonText: 'Custom action',
      buttonLink: '/contact',
    },
    backgroundImageUrl: 'https://cdn/workshop.jpg',
    backgroundImageAlt: 'Workshop image',
  },
  brandsWeService: {
    useSanityContent: true,
    sectionHeading: 'Custom brands',
    brands: [{
      _key: 'brand',
      name: 'Custom Brand',
      logoUrl: 'https://cdn/brand.svg',
      logoAlt: 'Custom Brand logo',
    }],
  },
  servicesGrid: {
    useSanityContent: true,
    sectionHeading: 'Custom grid',
    useCustomServices: true,
    featuredServices: [{ _key: 'featured', service: cmsService }],
  },
  processOfWork: {
    useSanityContent: true,
    sectionHeading: 'Custom process',
    steps: [{
      _key: 'step',
      number: 'A',
      title: 'Custom step',
      description: 'Custom step description',
    }],
  },
  servicesGallery: {
    useSanityContent: true,
    heading: 'Custom gallery',
    description: 'Custom gallery description',
    profileName: 'Custom profile',
    profileSubtitle: 'Custom subtitle',
    profileLogoUrl: 'https://cdn/logo.png',
    profileLogoAlt: 'Custom logo',
    buttonText: 'Custom booking',
    items: [{
      _key: 'media',
      mediaType: 'video',
      mediaUrl: 'https://cdn/video.mp4',
      label: 'Custom video',
    }],
  },
  ctaBanner: {
    useSanityContent: true,
    preTitle: 'Services CTA pretitle',
    headline: 'Services CTA headline',
    headlineHighlight: 'headline',
    buttonLabel: 'Services CTA button',
    buttonLink: '/store',
    footerTagline: 'Services CTA footer',
    socialLinks: {
      instagram: 'https://instagram.com/services',
      facebook: 'https://facebook.com/services',
      tiktok: 'https://tiktok.com/@services',
    },
  },
}

const cases = [
  [selectServicesHeroContent, valid.hero, FALLBACK_SERVICES_HERO, 'title'],
  [selectServicesExpertiseContent, valid.expertiseStats, FALLBACK_SERVICES_EXPERTISE, 'sectionHeading'],
  [selectServicesBrandsContent, valid.brandsWeService, FALLBACK_SERVICES_BRANDS, 'sectionHeading'],
  [selectServicesProcessContent, valid.processOfWork, FALLBACK_SERVICES_PROCESS, 'sectionHeading'],
  [selectServicesGalleryContent, valid.servicesGallery, FALLBACK_SERVICES_GALLERY, 'heading'],
]

for (const [selector, value, fallback, requiredField] of cases) {
  test(`Services ${requiredField} section independently follows the atomic source rule`, () => {
    assert.deepEqual(selector({ ...value, useSanityContent: false }), fallback)
    assert.equal(selector(value).source, 'sanity')
    assert.deepEqual(selector({ ...value, [requiredField]: null }), fallback)
    assert.deepEqual(selector(null), fallback)
  })
}

test('Services Grid source toggle is independent from custom ordering', () => {
  const fallback = selectServicesGridContent(
    { ...valid.servicesGrid, useSanityContent: false },
    localServices,
    [cmsService]
  )
  assert.equal(fallback.source, 'fallback')
  assert.equal(fallback.services[0].title, 'Local Service')

  const custom = selectServicesGridContent(
    valid.servicesGrid,
    localServices,
    [cmsService]
  )
  assert.equal(custom.source, 'sanity')
  assert.equal(custom.useCustomServices, true)
  assert.equal(custom.services[0].key, 'featured')

  const automatic = selectServicesGridContent(
    { ...valid.servicesGrid, useCustomServices: false },
    localServices,
    [cmsService]
  )
  assert.equal(automatic.source, 'sanity')
  assert.equal(automatic.useCustomServices, false)
  assert.equal(automatic.services[0].key, 'service-cms')
})

test('one invalid Services section does not affect valid sections or mix fields', () => {
  const result = selectServicesPageContent(
    {
      ...valid,
      brandsWeService: {
        ...valid.brandsWeService,
        sectionHeading: 'Must not leak',
        brands: [],
      },
    },
    localServices,
    [cmsService]
  )
  assert.equal(result.hero.source, 'sanity')
  assert.equal(result.expertiseStats.source, 'sanity')
  assert.deepEqual(result.brandsWeService, FALLBACK_SERVICES_BRANDS)
  assert.notEqual(result.brandsWeService.sectionHeading, 'Must not leak')
  assert.equal(result.servicesGrid.source, 'sanity')
  assert.equal(result.processOfWork.source, 'sanity')
  assert.equal(result.servicesGallery.source, 'sanity')
})

test('missing Services document returns every complete fallback', () => {
  const result = selectServicesPageContent(null, localServices, [])
  assert.equal(result.hero.source, 'fallback')
  assert.equal(result.expertiseStats.source, 'fallback')
  assert.equal(result.brandsWeService.source, 'fallback')
  assert.equal(result.servicesGrid.source, 'fallback')
  assert.equal(result.processOfWork.source, 'fallback')
  assert.equal(result.servicesGallery.source, 'fallback')
  assert.equal(result.ctaBanner.source, 'fallback')
})

test('Expertise Stats renders supplied selected content', () => {
  const selected = selectServicesExpertiseContent(valid.expertiseStats)
  const component = readFileSync(
    new URL(
      '../../src/modules/services/components/expertise-stats/index.tsx',
      import.meta.url
    ),
    'utf8'
  )
  assert.equal(selected.heading, 'Custom expertise heading')
  assert.equal(selected.highlights[0].title, 'Custom highlight')
  assert.equal(selected.assistance.heading, 'Custom assistance')
  assert.match(component, /\{content\.heading\}/)
  assert.match(component, /content\.highlights\.map/)
  assert.match(component, /\{content\.assistance\.heading\}/)
  assert.doesNotMatch(component, /companyData/)
})

test('Services CTA Banner independently follows the atomic source rule', () => {
  assert.deepEqual(
    selectPageCtaContent(
      { ...valid.ctaBanner, useSanityContent: false },
      'Services CTA Banner'
    ),
    FALLBACK_PAGE_CTA
  )
  assert.equal(
    selectPageCtaContent(valid.ctaBanner, 'Services CTA Banner').source,
    'sanity'
  )
  assert.deepEqual(
    selectPageCtaContent(
      { ...valid.ctaBanner, buttonLabel: null },
      'Services CTA Banner'
    ),
    FALLBACK_PAGE_CTA
  )
})
