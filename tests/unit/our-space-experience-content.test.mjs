import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FALLBACK_OUR_SPACE_EXPERIENCE,
  selectOurSpaceExperienceContent,
} from '../../src/lib/cms/our-space-experience.ts'

const firstItem = {
  _key: 'space-coffee',
  title: 'Coffee bar',
  description: 'Fresh coffee for riders.',
  imageUrl: 'https://cdn.sanity.io/images/project/dataset/coffee.jpg',
  imageAlt: 'Coffee bar inside SixthGear',
}

const secondItem = {
  _key: 'space-lounge',
  title: 'Rider lounge',
  description: 'A space for riders to meet.',
  imageUrl: 'https://cdn.sanity.io/images/project/dataset/lounge.jpg',
  imageAlt: 'Riders meeting in the lounge',
}

const validSection = {
  useSanityContent: true,
  sectionTitle: 'Our Sanity space',
  sectionDescription: 'Sanity description',
  items: [secondItem, firstItem],
}

test('toggle absent or disabled returns the complete Our Space fallback', () => {
  assert.deepEqual(
    selectOurSpaceExperienceContent({ items: [firstItem] }),
    FALLBACK_OUR_SPACE_EXPERIENCE
  )
  assert.deepEqual(
    selectOurSpaceExperienceContent({
      ...validSection,
      useSanityContent: false,
    }),
    FALLBACK_OUR_SPACE_EXPERIENCE
  )
})

test('valid enabled content preserves order and _key values', () => {
  const result = selectOurSpaceExperienceContent(validSection)
  assert.equal(result.source, 'sanity')
  assert.deepEqual(
    result.items.map((item) => item.key),
    ['space-lounge', 'space-coffee']
  )
  assert.equal(result.items.length, 2)
})

test('empty or malformed enabled content falls back atomically', () => {
  for (const value of [
    { ...validSection, items: [] },
    { ...validSection, items: [{ ...firstItem, imageAlt: null }] },
    { ...validSection, sectionDescription: null },
  ]) {
    assert.deepEqual(
      selectOurSpaceExperienceContent(value),
      FALLBACK_OUR_SPACE_EXPERIENCE
    )
  }
})

test('missing data or fetch-failure equivalent returns the fallback', () => {
  assert.deepEqual(
    selectOurSpaceExperienceContent(null),
    FALLBACK_OUR_SPACE_EXPERIENCE
  )
})
