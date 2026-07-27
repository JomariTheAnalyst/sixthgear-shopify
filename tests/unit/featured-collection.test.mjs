import assert from 'node:assert/strict'
import test from 'node:test'

import {
  isFeaturedCollectionScheduleActive,
  resolveFeaturedCollectionProducts,
  selectFeaturedCollectionForPosition,
} from '../../src/lib/cms/featured-collection.ts'

const campaign = {
  isActive: true,
  internalName: 'July collection',
  position: 'after_hero',
  startDate: null,
  endDate: null,
  layout: 'image_left',
  contentPosition: 'bottom-left',
  bannerImageUrl: 'https://cdn.sanity.io/images/project/dataset/banner.jpg',
  bannerImageAlt: 'Motorcycle gear collection campaign',
  collectionHandle: 'featured-gear',
  heading: 'Featured gear',
  subtext: null,
  ctaLabel: 'View collection',
  ctaLink: '/collections/featured-gear',
}

const now = new Date('2026-07-22T12:00:00.000Z')

test('inactive, future, expired, and invalid schedules are ineligible', () => {
  assert.equal(
    isFeaturedCollectionScheduleActive({ ...campaign, isActive: false }, now),
    false
  )
  assert.equal(
    isFeaturedCollectionScheduleActive(
      { ...campaign, startDate: '2026-07-23T00:00:00.000Z' },
      now
    ),
    false
  )
  assert.equal(
    isFeaturedCollectionScheduleActive(
      { ...campaign, endDate: '2026-07-21T00:00:00.000Z' },
      now
    ),
    false
  )
  assert.equal(
    isFeaturedCollectionScheduleActive(
      { ...campaign, startDate: 'not-a-date' },
      now
    ),
    false
  )
})

test('active campaigns without dates or inside a date range are eligible', () => {
  assert.equal(isFeaturedCollectionScheduleActive(campaign, now), true)
  assert.equal(
    isFeaturedCollectionScheduleActive(
      {
        ...campaign,
        startDate: '2026-07-20T00:00:00.000Z',
        endDate: '2026-07-24T00:00:00.000Z',
      },
      now
    ),
    true
  )
})

test('placement selection rejects unsupported or incomplete campaigns', () => {
  assert.equal(
    selectFeaturedCollectionForPosition(
      [{ ...campaign, position: 'after_projects' }],
      'after_hero',
      now
    ),
    null
  )
  assert.equal(
    selectFeaturedCollectionForPosition(
      [{ ...campaign, collectionHandle: null }],
      'after_hero',
      now
    ),
    null
  )
  assert.equal(
    selectFeaturedCollectionForPosition([campaign], 'after_hero', now),
    campaign
  )
})

test('Shopify collection resolution has no fabricated product fallback', async () => {
  const product = { id: 'gid://shopify/Product/1' }
  assert.deepEqual(
    await resolveFeaturedCollectionProducts(campaign, async () => [product]),
    [product]
  )
  assert.equal(
    await resolveFeaturedCollectionProducts(campaign, async () => []),
    null
  )
  assert.equal(
    await resolveFeaturedCollectionProducts(campaign, async () => {
      throw new Error('Shopify unavailable')
    }),
    null
  )
})
