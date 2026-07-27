import assert from 'node:assert/strict'
import test from 'node:test'

import {
  selectHomepageServicesSource,
} from '../../src/lib/cms/homepage-services.ts'

const valid = {
  useCustomServices: true,
  sectionTitle: 'Sanity services',
  sectionDescription: 'Sanity service description',
  services: [
    {
      _key: 'service-one',
      title: 'Service one',
      description: 'Complete description',
      image: 'https://cdn.sanity.io/service.jpg',
      slug: 'service-one',
      link: null,
    },
  ],
}

test('Homepage Services returns fallback mode for absent, disabled, or malformed data', () => {
  assert.equal(selectHomepageServicesSource(null), null)
  assert.equal(
    selectHomepageServicesSource({ ...valid, useCustomServices: false }),
    null
  )
  assert.equal(
    selectHomepageServicesSource({
      ...valid,
      services: [{ ...valid.services[0], image: null }],
    }),
    null
  )
})

test('Homepage Services preserves a complete Sanity array without merging', () => {
  const result = selectHomepageServicesSource(valid)
  assert.equal(result, valid)
  assert.deepEqual(result.services.map((item) => item._key), ['service-one'])
})
