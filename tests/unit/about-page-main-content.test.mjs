import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FALLBACK_ABOUT_CEO_QUOTE,
  FALLBACK_ABOUT_HERO_SECTION,
  FALLBACK_ABOUT_STORY_SECTION,
  FALLBACK_ABOUT_VALUES,
  FALLBACK_ABOUT_WHY_CHOOSE_US,
  selectAboutCeoQuoteContent,
  selectAboutHeroContent,
  selectAboutPageContent,
  selectAboutStoryContent,
  selectAboutValuesContent,
  selectAboutWhyChooseUsContent,
} from '../../src/lib/cms/about-page-main.ts'
import { FALLBACK_PAGE_CTA } from '../../src/lib/cms/page-cta.ts'
import { selectPageCtaContent } from '../../src/lib/cms/page-cta.ts'

const valid = {
  hero: {
    useSanityContent: true,
    title: 'Sanity About',
    description: 'Sanity About description',
    backgroundImageUrl: 'https://cdn/hero.jpg',
    backgroundImageAlt: 'Sanity Hero',
  },
  ourStory: {
    useSanityContent: true,
    items: [{
      _key: 'story',
      heading: 'Sanity Story',
      body: 'Sanity body',
      imageUrl: 'https://cdn/story.jpg',
      imageAlt: 'Story image',
    }],
  },
  ourValues: {
    useSanityContent: true,
    heading: 'Sanity Values',
    description: 'Sanity values description',
    cards: [{
      _key: 'value',
      title: 'Sanity Value',
      description: 'Sanity value description',
      icon: 'wrench',
    }],
  },
  whyChooseUs: {
    useSanityContent: true,
    sectionLabel: 'Sanity Why',
    heading: 'Sanity Choose us',
    subtitle: 'Sanity reason',
    items: [{
      _key: 'reason',
      title: 'Sanity Reason',
      description: 'Sanity reason description',
      icon: 'wrench',
    }],
    topImageUrl: 'https://cdn/top.jpg',
    topImageAlt: 'Top image',
    bottomImageUrl: 'https://cdn/bottom.jpg',
    bottomImageAlt: 'Bottom image',
  },
  ceoQuote: {
    useSanityContent: true,
    quoteText: 'Sanity Quote',
    highlightedPhrase: 'Quote',
    ceoName: 'Sanity Name',
    ceoTitle: 'Sanity Title',
    ceoPhotoUrl: 'https://cdn/ceo.jpg',
    ceoPhotoDescription: 'CEO portrait',
  },
  ctaBanner: {
    useSanityContent: true,
    preTitle: 'Sanity pretitle',
    headline: 'Sanity headline',
    headlineHighlight: 'headline',
    buttonLabel: 'Sanity button',
    buttonLink: '/sanity',
    footerTagline: 'Sanity footer',
    socialLinks: {
      instagram: 'https://instagram.com/sanity',
      facebook: 'https://facebook.com/sanity',
      tiktok: 'https://tiktok.com/@sanity',
    },
  },
}

const cases = [
  {
    name: 'Hero',
    selector: selectAboutHeroContent,
    value: valid.hero,
    fallback: FALLBACK_ABOUT_HERO_SECTION,
    corrupt: (value) => ({ ...value, description: null }),
  },
  {
    name: 'Our Story',
    selector: selectAboutStoryContent,
    value: valid.ourStory,
    fallback: FALLBACK_ABOUT_STORY_SECTION,
    corrupt: (value) => ({ ...value, items: [{ ...value.items[0], body: null }] }),
  },
  {
    name: 'Why Choose Us',
    selector: selectAboutWhyChooseUsContent,
    value: valid.whyChooseUs,
    fallback: FALLBACK_ABOUT_WHY_CHOOSE_US,
    corrupt: (value) => ({ ...value, topImageAlt: null }),
  },
  {
    name: 'Our Values',
    selector: selectAboutValuesContent,
    value: valid.ourValues,
    fallback: FALLBACK_ABOUT_VALUES,
    corrupt: (value) => ({ ...value, cards: [{ ...value.cards[0], title: null }] }),
  },
  {
    name: 'CEO Quote',
    selector: selectAboutCeoQuoteContent,
    value: valid.ceoQuote,
    fallback: FALLBACK_ABOUT_CEO_QUOTE,
    corrupt: (value) => ({ ...value, ceoName: null }),
  },
]

for (const entry of cases) {
  test(`About ${entry.name} independently follows the atomic source rule`, () => {
    assert.deepEqual(
      entry.selector({ ...entry.value, useSanityContent: false }),
      entry.fallback
    )
    assert.equal(entry.selector(entry.value).source, 'sanity')
    assert.deepEqual(entry.selector(entry.corrupt(entry.value)), entry.fallback)
    assert.deepEqual(entry.selector(null), entry.fallback)
  })
}

test('About incomplete content never mixes Sanity fields into fallback', () => {
  const result = selectAboutHeroContent({
    ...valid.hero,
    title: 'This must not leak',
    description: null,
  })
  assert.deepEqual(result, FALLBACK_ABOUT_HERO_SECTION)
  assert.notEqual(result.title, 'This must not leak')
})

test('About sections are independent and the legacy master toggle is ignored', () => {
  const result = selectAboutPageContent({
    ...valid,
    useSanityContent: false,
    ourValues: { ...valid.ourValues, heading: null },
  })
  assert.equal(result.hero.source, 'sanity')
  assert.equal(result.story.source, 'sanity')
  assert.equal(result.whyChooseUs.source, 'sanity')
  assert.equal(result.ceoQuote.source, 'sanity')
  assert.equal(result.ctaBanner.source, 'sanity')
  assert.deepEqual(result.ourValues, FALLBACK_ABOUT_VALUES)
})

test('missing About document returns every complete fallback', () => {
  const result = selectAboutPageContent(null)
  assert.deepEqual(result.hero, FALLBACK_ABOUT_HERO_SECTION)
  assert.deepEqual(result.story, FALLBACK_ABOUT_STORY_SECTION)
  assert.deepEqual(result.whyChooseUs, FALLBACK_ABOUT_WHY_CHOOSE_US)
  assert.deepEqual(result.ourValues, FALLBACK_ABOUT_VALUES)
  assert.deepEqual(result.ceoQuote, FALLBACK_ABOUT_CEO_QUOTE)
  assert.deepEqual(result.ctaBanner, FALLBACK_PAGE_CTA)
})

test('About CTA Banner independently follows the atomic source rule', () => {
  assert.deepEqual(
    selectPageCtaContent(
      { ...valid.ctaBanner, useSanityContent: false },
      'About CTA Banner'
    ),
    FALLBACK_PAGE_CTA
  )
  assert.equal(
    selectPageCtaContent(valid.ctaBanner, 'About CTA Banner').source,
    'sanity'
  )
  assert.deepEqual(
    selectPageCtaContent(
      { ...valid.ctaBanner, headline: null },
      'About CTA Banner'
    ),
    FALLBACK_PAGE_CTA
  )
})
