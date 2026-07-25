import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FALLBACK_WHAT_WE_OFFER_CONTENT,
  selectWhatWeOfferContent,
} from '../../src/lib/cms/what-we-offer.ts'

const firstCard = {
  _key: 'offer-service',
  title: 'Sanity Service',
  backgroundImageUrl: 'https://cdn.sanity.io/images/project/dataset/service.jpg',
  imageAlt: 'Technician servicing a motorcycle',
  linkUrl: '/services',
  buttonText: 'DISCOVER',
}

const secondCard = {
  _key: 'offer-gear',
  title: 'Sanity Gear',
  backgroundImageUrl: 'https://cdn.sanity.io/images/project/dataset/gear.jpg',
  imageAlt: 'Motorcycle riding gear on display',
  linkUrl: '/store',
  buttonText: 'SHOP',
}

const validSection = {
  useSanityContent: true,
  sectionName: 'Sanity section label',
  heading: 'Sanity heading',
  cards: [secondCard, firstCard],
}

test('toggle absent or off returns the complete What We Offer fallback', () => {
  assert.deepEqual(selectWhatWeOfferContent({ cards: [firstCard] }), FALLBACK_WHAT_WE_OFFER_CONTENT)
  assert.deepEqual(
    selectWhatWeOfferContent({ ...validSection, useSanityContent: false }),
    FALLBACK_WHAT_WE_OFFER_CONTENT
  )
})

test('valid enabled content preserves Sanity card order and _key values', () => {
  const result = selectWhatWeOfferContent(validSection)

  assert.equal(result.source, 'sanity')
  assert.equal(result.sectionName, 'Sanity section label')
  assert.deepEqual(
    result.cards.map((card) => card.key),
    ['offer-gear', 'offer-service']
  )
  assert.deepEqual(
    result.cards.map((card) => card.imageAlt),
    [secondCard.imageAlt, firstCard.imageAlt]
  )
  assert.equal(result.cards.length, 2)
  assert.equal(
    result.cards.some((card) =>
      FALLBACK_WHAT_WE_OFFER_CONTENT.cards.some(
        (fallback) => fallback.key === card.key
      )
    ),
    false
  )
})

test('empty, malformed, or section-incomplete enabled content falls back atomically', () => {
  const cases = [
    { ...validSection, cards: [] },
    { ...validSection, cards: [{ ...firstCard, imageAlt: null }] },
    { ...validSection, cards: [{ ...firstCard, linkUrl: 'not-a-link' }] },
    { ...validSection, heading: null },
  ]

  for (const value of cases) {
    assert.deepEqual(selectWhatWeOfferContent(value), FALLBACK_WHAT_WE_OFFER_CONTENT)
  }
})

test('missing data or fetch-failure equivalent returns the complete fallback', () => {
  assert.deepEqual(selectWhatWeOfferContent(null), FALLBACK_WHAT_WE_OFFER_CONTENT)
})
