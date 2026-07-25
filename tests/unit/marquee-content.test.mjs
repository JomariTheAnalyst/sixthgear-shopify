import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FALLBACK_MARQUEE_CONTENT,
  selectMarqueeContent,
} from '../../src/lib/cms/marquee.ts'

test('marquee toggle false returns the complete hardcoded fallback', () => {
  const result = selectMarqueeContent({
    useSanityContent: false,
    items: [{ _key: 'ignored', text: 'MUST NOT LEAK' }],
  })

  assert.equal(result.source, 'fallback')
  assert.deepEqual(result, FALLBACK_MARQUEE_CONTENT)
  assert.equal(result.items.length, 4)
})

test('valid enabled marquee uses only Sanity items in editor order with stable keys', () => {
  const result = selectMarqueeContent({
    useSanityContent: true,
    items: [
      { _key: 'second', text: 'SECOND MESSAGE' },
      { _key: 'first', text: 'FIRST MESSAGE' },
    ],
  })

  assert.equal(result.source, 'sanity')
  assert.deepEqual(result.items, [
    { key: 'second', text: 'SECOND MESSAGE' },
    { key: 'first', text: 'FIRST MESSAGE' },
  ])
  assert.equal(
    result.items.some((item) =>
      FALLBACK_MARQUEE_CONTENT.items.some((fallback) => fallback.text === item.text)
    ),
    false
  )
})

test('enabled marquee with missing or malformed items falls back as one unit', () => {
  assert.deepEqual(
    selectMarqueeContent({ useSanityContent: true, items: [] }),
    FALLBACK_MARQUEE_CONTENT
  )
  assert.deepEqual(
    selectMarqueeContent({
      useSanityContent: true,
      items: [{ _key: 'valid-key', text: '   ' }],
    }),
    FALLBACK_MARQUEE_CONTENT
  )
})
