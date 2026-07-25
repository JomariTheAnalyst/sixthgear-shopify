import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FALLBACK_CTA_BANNER,
  FALLBACK_FRANCHISE,
  FALLBACK_HOMEPAGE_ABOUT,
  FALLBACK_SATISFIED_CUSTOMERS,
  selectCtaBannerContent,
  selectFranchiseContent,
  selectHomepageAboutContent,
  selectSatisfiedCustomersContent,
} from '../../src/lib/cms/homepage-editorial.ts'

test('Homepage About uses its existing switch as an atomic source selector', () => {
  const valid = {
    useCustomAbout: true,
    kicker: 'Sanity label',
    title: 'Sanity title',
    description: 'Sanity description',
    highlights: ['One', 'Two'],
    primaryCta: { text: 'Read', link: '/about' },
    imageTop: 'https://cdn.sanity.io/top.jpg',
    imageBottom: 'https://cdn.sanity.io/bottom.jpg',
    videoUrl: null,
  }
  assert.deepEqual(
    selectHomepageAboutContent({ ...valid, useCustomAbout: false }),
    FALLBACK_HOMEPAGE_ABOUT
  )
  assert.deepEqual(
    selectHomepageAboutContent({ ...valid, highlights: [] }),
    FALLBACK_HOMEPAGE_ABOUT
  )
  assert.equal(selectHomepageAboutContent(valid).source, 'sanity')
})

test('new editorial toggles keep complete fallbacks visible when absent or off', () => {
  assert.deepEqual(
    selectSatisfiedCustomersContent({ sectionTitle: 'Ignored', customers: [] }),
    FALLBACK_SATISFIED_CUSTOMERS
  )
  assert.deepEqual(
    selectFranchiseContent({ useSanityContent: false }),
    FALLBACK_FRANCHISE
  )
  assert.deepEqual(
    selectCtaBannerContent(null),
    FALLBACK_CTA_BANNER
  )
})

test('Satisfied Customers preserves Sanity order and _key without appending fallback rows', () => {
  const result = selectSatisfiedCustomersContent({
    useSanityContent: true,
    sectionTitle: 'Sanity riders',
    customers: [
      { _key: 'second', name: 'Second', photoUrl: 'https://cdn/second.jpg' },
      { _key: 'first', name: 'First', photoUrl: 'https://cdn/first.jpg' },
    ],
  })
  assert.equal(result.source, 'sanity')
  assert.deepEqual(result.customers.map((item) => item.key), ['second', 'first'])
  assert.equal(result.customers.length, 2)
})
