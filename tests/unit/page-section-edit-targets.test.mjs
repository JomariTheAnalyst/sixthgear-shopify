import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { keyedSanityPath } from '../../src/lib/cms/visual-editing.ts'

const aboutTemplate = readFileSync(
  new URL('../../src/modules/about/templates/index.tsx', import.meta.url),
  'utf8'
)
const servicesTemplate = readFileSync(
  new URL('../../src/modules/services/templates/index.tsx', import.meta.url),
  'utf8'
)

test('About and Services templates target every canonical section field', () => {
  for (const path of [
    'hero',
    'whyChooseUs',
    'ourStory',
    'ourSpaceExperience',
    'ourValues',
    'ceoQuote',
    'ctaBanner',
  ]) {
    assert.match(
      path === 'ourSpaceExperience' ? readFileSync(
        new URL('../../src/modules/home/components/projects/index.tsx', import.meta.url),
        'utf8'
      ) : aboutTemplate,
      new RegExp(path)
    )
  }

  for (const path of [
    'hero',
    'expertiseStats',
    'brandsWeService',
    'servicesGrid',
    'processOfWork',
    'servicesGallery',
    'ctaBanner',
  ]) {
    assert.match(servicesTemplate, new RegExp(path))
  }
})

test('keyed array edit paths preserve Sanity _key targeting safely', () => {
  assert.equal(
    keyedSanityPath('ourStory.items', 'story-key'),
    'ourStory.items[_key=="story-key"]'
  )
  assert.equal(
    keyedSanityPath('servicesGallery.items', 'quote"key'),
    'servicesGallery.items[_key=="quote\\"key"]'
  )
})

test('singleton config removes global creation and duplicate actions', () => {
  const config = readFileSync(
    new URL('../../sanity.config.ts', import.meta.url),
    'utf8'
  )
  assert.match(config, /newDocumentOptions/)
  assert.match(config, /action !== 'duplicate'/)
  assert.match(config, /'aboutPage'/)
  assert.match(config, /'servicesPage'/)
})
