import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FALLBACK_SERVICE_BRANDS_CONTENT,
  selectServiceBrandsContent,
} from '../../src/lib/cms/service-brands.ts'

const firstBrand = {
  _key: 'brand-yamaha',
  name: 'Yamaha',
  logoUrl: 'https://cdn.sanity.io/images/project/dataset/yamaha-logo.png',
  logoAlt: 'Yamaha logo',
  motorcycleImageUrl:
    'https://cdn.sanity.io/images/project/dataset/yamaha-motorcycle.png',
  motorcycleImageAlt: 'Blue Yamaha motorcycle',
  overview: 'Yamaha editorial overview.',
  keySentences: ['First Yamaha point.', 'Second Yamaha point.'],
  link: null,
  linkLabel: null,
}

const secondBrand = {
  _key: 'brand-suzuki',
  name: 'Suzuki',
  logoUrl: 'https://cdn.sanity.io/images/project/dataset/suzuki-logo.png',
  logoAlt: 'Suzuki logo',
  motorcycleImageUrl:
    'https://cdn.sanity.io/images/project/dataset/suzuki-motorcycle.png',
  motorcycleImageAlt: 'Red Suzuki motorcycle',
  overview: 'Suzuki editorial overview.',
  keySentences: ['Suzuki supporting point.'],
  link: '/collections/suzuki',
  linkLabel: 'Explore Suzuki',
}

const completeSanitySection = {
  useSanityContent: true,
  sectionTitle: 'Sanity service brands heading',
  sectionDescription: 'Sanity service brands description',
  brands: [firstBrand, secondBrand],
}

test('brands toggle false returns the complete existing fallback without mixing', () => {
  const result = selectServiceBrandsContent({
    ...completeSanitySection,
    useSanityContent: false,
  })

  assert.deepEqual(result, FALLBACK_SERVICE_BRANDS_CONTENT)
  assert.equal(result.source, 'fallback')
  assert.equal(result.brands.length, 8)
  assert.equal(result.sectionTitle, 'Motorcycle Brands We Service & Support')
})

test('valid enabled brands maps every revamped child value and preserves order', () => {
  const result = selectServiceBrandsContent(completeSanitySection)

  assert.equal(result.source, 'sanity')
  assert.equal(result.sectionTitle, 'Sanity service brands heading')
  assert.deepEqual(
    result.brands.map((brand) => brand.key),
    ['brand-yamaha', 'brand-suzuki']
  )
  assert.deepEqual(result.brands[0].keySentences, firstBrand.keySentences)
  assert.equal(result.brands[0].motorcycleImageUrl, firstBrand.motorcycleImageUrl)
  assert.equal(result.brands[1].linkLabel, 'Explore Suzuki')
  assert.equal(
    result.brands.some((brand) =>
      FALLBACK_SERVICE_BRANDS_CONTENT.brands.some(
        (fallback) => fallback.overview === brand.overview
      )
    ),
    false
  )
})

test('malformed required brand content falls back as one complete section', () => {
  const result = selectServiceBrandsContent({
    ...completeSanitySection,
    brands: [{ ...firstBrand, motorcycleImageUrl: null }],
  })

  assert.deepEqual(result, FALLBACK_SERVICE_BRANDS_CONTENT)
})

test('optional editorial links may be absent, but an unpaired link is malformed', () => {
  assert.equal(selectServiceBrandsContent(completeSanitySection).source, 'sanity')
  assert.equal(
    selectServiceBrandsContent({
      ...completeSanitySection,
      brands: [{ ...firstBrand, link: '/collections/yamaha' }],
    }).source,
    'fallback'
  )
})

test('Sanity service-brand content contains no duplicated commerce fields', () => {
  const result = selectServiceBrandsContent(completeSanitySection)
  const forbiddenFields = [
    'products',
    'prices',
    'inventory',
    'variants',
    'collectionProducts',
  ]

  for (const brand of result.brands) {
    for (const field of forbiddenFields) {
      assert.equal(Object.hasOwn(brand, field), false)
    }
  }
})
