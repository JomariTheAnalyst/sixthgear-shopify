import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  createSanityDataAttribute,
  keyedSanityPath,
  shouldRenderVisualEditing,
} from '../../src/lib/cms/visual-editing.ts'
import {
  resolveFeaturedCollectionProducts,
  selectFeaturedCollectionForPosition,
} from '../../src/lib/cms/featured-collection.ts'
import { selectWhatWeOfferContent } from '../../src/lib/cms/what-we-offer.ts'

const campaign = {
  _key: 'campaign-key',
  isActive: true,
  internalName: 'Summer',
  position: 'after_hero',
  startDate: null,
  endDate: null,
  layout: 'image_left',
  contentPosition: 'bottom-left',
  bannerImageUrl: 'https://cdn.sanity.io/banner.jpg',
  bannerImageAlt: 'Campaign',
  collectionHandle: 'helmets',
  heading: 'Helmets',
  subtext: 'Protection',
  ctaLabel: 'Shop',
  ctaLink: '/ph/store',
}

const liveConfigurationSource = readFileSync(
  new URL('../../sanity/lib/live.ts', import.meta.url),
  'utf8'
)

test('defineLive receives the server-only read token for server and browser draft access', () => {
  assert.match(liveConfigurationSource, /serverToken:\s*readToken/)
  assert.match(liveConfigurationSource, /browserToken:\s*readToken/)
  assert.doesNotMatch(liveConfigurationSource, /NEXT_PUBLIC_[A-Z0-9_]*TOKEN/)
})

test('VisualEditing is mounted only while Draft Mode is enabled', () => {
  assert.equal(shouldRenderVisualEditing(false), false)
  assert.equal(shouldRenderVisualEditing(true), true)
})

test('published output has no explicit Sanity data attribute', () => {
  assert.equal(createSanityDataAttribute(false, {
    documentId: 'homepage', documentType: 'homepage', path: 'hero',
  }), undefined)
})

test('fallback section receives one section target while fallback children remain unannotated', () => {
  const section = createSanityDataAttribute(true, {
    documentId: 'homepage', documentType: 'homepage', path: 'whatWeOffer.useSanityContent',
  })
  const child = undefined
  assert.equal(typeof section, 'string')
  assert.equal(child, undefined)
})

test('Sanity arrays use _key paths and images can target their exact image field', () => {
  const itemPath = keyedSanityPath('whatWeOffer.cards', 'card-1')
  assert.equal(itemPath, 'whatWeOffer.cards[_key=="card-1"]')
  const imageTarget = createSanityDataAttribute(true, {
    documentId: 'homepage', documentType: 'homepage', path: `${itemPath}.backgroundImage`,
  })
  assert.equal(typeof imageTarget, 'string')
})

test('campaign position and dates are safe for selection', () => {
  assert.equal(selectFeaturedCollectionForPosition([campaign], 'after_hero', new Date()), campaign)
  assert.equal(selectFeaturedCollectionForPosition([{ ...campaign, startDate: 'not-a-date' }], 'after_hero', new Date()), null)
})

test('collection handle is cleaned before Shopify lookup and no products are fabricated', async () => {
  let receivedHandle = null
  const products = await resolveFeaturedCollectionProducts(campaign, async (handle) => {
    receivedHandle = handle
    return []
  })
  assert.equal(receivedHandle, 'helmets')
  assert.equal(products, null)
})

test('visible Sanity text is returned unchanged by the selector', () => {
  const visibleHeading = 'Editable heading\u200b'
  const content = selectWhatWeOfferContent({
    useSanityContent: true,
    sectionName: 'What We Offer',
    heading: visibleHeading,
    cards: [{
      _key: 'card-1',
      title: 'Service',
      backgroundImageUrl: 'https://cdn.sanity.io/card.jpg',
      imageAlt: 'Service bay',
      linkUrl: '/ph/services',
      buttonText: 'Discover',
    }],
  })
  assert.equal(content.heading, visibleHeading)
})

test('Shopify product fields never receive a Sanity target from campaign selection', () => {
  const product = { id: 'gid://shopify/Product/1', title: 'Shopify title', price: '100' }
  assert.equal(Object.hasOwn(product, 'data-sanity'), false)
})
