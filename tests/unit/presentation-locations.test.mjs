import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CANONICAL_SINGLETON_IDS,
  isCanonicalSingletonId,
  presentationLocations,
  resolveBlogPostPath,
} from '../../sanity/presentation/locations.ts'

test('canonical singleton locations resolve to the approved storefront routes', () => {
  assert.equal(presentationLocations.homepage.resolve({ id: 'homepage' }).locations[0].href, '/ph')
  assert.equal(presentationLocations.aboutPage.resolve({ id: 'aboutPage' }).locations[0].href, '/ph/about')
  assert.equal(presentationLocations.servicesPage.resolve({ id: 'servicesPage' }).locations[0].href, '/ph/services')
  assert.equal(presentationLocations.marketing.resolve({ id: 'marketing' }).locations[0].href, '/ph')
})

test('only canonical singleton IDs are accepted, including their draft form', () => {
  assert.deepEqual(CANONICAL_SINGLETON_IDS, {
    homepage: 'homepage',
    aboutPage: 'aboutPage',
    servicesPage: 'servicesPage',
    marketing: 'marketing',
  })
  assert.equal(isCanonicalSingletonId('drafts.homepage', 'homepage'), true)
  assert.equal(isCanonicalSingletonId('generated-homepage', 'homepage'), false)
})

test('blog post slug resolves safely and missing slug produces no broken route', () => {
  assert.equal(resolveBlogPostPath('night-ride'), '/ph/rider-stories/night-ride')
  assert.equal(resolveBlogPostPath(''), null)
  assert.equal(resolveBlogPostPath('bad/slug'), null)
  assert.equal(presentationLocations.blogPost.resolve({ slug: null, title: 'Draft' }).locations, undefined)
})
