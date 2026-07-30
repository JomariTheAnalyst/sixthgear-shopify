import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildSitemapEntries,
  buildSitemapUrl,
} from '../../src/lib/sitemap.ts'

const serviceSlugs = [
  'preventive-maintenance',
  'repairs-diagnostics',
  'accessories-installation',
  'wheels-drivetrain',
  'detailing-protection',
  'performance-upgrades',
  'roadside-assistance',
  'rider-support',
]

const shopifyProductUpdatedAt = '2026-01-02T03:04:05.000Z'
const shopifyCollectionUpdatedAt = '2026-02-03T04:05:06.000Z'
const sanityServiceUpdatedAt = '2026-03-04T05:06:07.000Z'
const sanityStoryUpdatedAt = '2026-04-05T06:07:08.000Z'

function fixtureEntries() {
  return buildSitemapEntries({
    products: [
      {
        handle: 'helmet™-visor',
        updatedAt: shopifyProductUpdatedAt,
      },
    ],
    collections: [
      {
        handle: 'helmet',
        updatedAt: shopifyCollectionUpdatedAt,
      },
    ],
    cmsServices: [
      {
        slug: 'preventive-maintenance',
        _updatedAt: sanityServiceUpdatedAt,
      },
    ],
    localServiceSlugs: serviceSlugs,
    stories: [
      {
        slug: 'first-ride',
        _updatedAt: sanityStoryUpdatedAt,
      },
    ],
  })
}

function entryFor(entries, path) {
  const entry = entries.find(
    ({ url }) => url === `https://www.sixthgearmoto.com${path}`
  )
  assert.ok(entry, `Expected sitemap entry for ${path}`)
  return entry
}

test('sitemap URLs encode non-ASCII segments once on the preferred host', () => {
  assert.equal(
    buildSitemapUrl('/products/helmet™-visor'),
    'https://www.sixthgearmoto.com/ph/products/helmet%E2%84%A2-visor'
  )
  assert.equal(
    buildSitemapUrl('/products/helmet%E2%84%A2-visor'),
    'https://www.sixthgearmoto.com/ph/products/helmet%E2%84%A2-visor'
  )
})

test('sitemap includes the required main and service URLs exactly once', () => {
  const entries = fixtureEntries()
  const urls = entries.map(({ url }) => url)

  assert.equal(new Set(urls).size, urls.length)

  for (const path of [
    '/ph',
    '/ph/store',
    '/ph/about',
    '/ph/services',
    '/ph/contact',
    '/ph/rider-stories',
    '/ph/first-gear',
    '/ph/collections/helmet',
  ]) {
    entryFor(entries, path)
  }

  for (const slug of serviceSlugs) {
    entryFor(entries, `/ph/services/${slug}`)
  }

  for (const url of urls) {
    const parsed = new URL(url)
    assert.equal(parsed.origin, 'https://www.sixthgearmoto.com')
    assert.equal(parsed.search, '')
    assert.doesNotMatch(parsed.pathname, /\/ph\/ph(?:\/|$)/)
    assert.doesNotMatch(parsed.pathname, /\/PH(?:\/|$)/)
    assert.doesNotMatch(parsed.pathname, /\/collections\/helmets(?:\/|$)/)
    assert.doesNotMatch(url, /[^\x00-\x7F]/)
  }
})

test('sitemap preserves source dates and omits invented local service dates', () => {
  const entries = fixtureEntries()

  assert.equal(
    entryFor(entries, '/ph/products/helmet%E2%84%A2-visor').lastModified?.toISOString(),
    shopifyProductUpdatedAt
  )
  assert.equal(
    entryFor(entries, '/ph/collections/helmet').lastModified?.toISOString(),
    shopifyCollectionUpdatedAt
  )
  assert.equal(
    entryFor(entries, '/ph/services/preventive-maintenance').lastModified?.toISOString(),
    sanityServiceUpdatedAt
  )
  assert.equal(
    entryFor(entries, '/ph/rider-stories/first-ride').lastModified?.toISOString(),
    sanityStoryUpdatedAt
  )

  for (const slug of serviceSlugs.slice(1)) {
    assert.equal(
      Object.hasOwn(entryFor(entries, `/ph/services/${slug}`), 'lastModified'),
      false
    )
  }
})
