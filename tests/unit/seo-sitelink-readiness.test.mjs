import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  PREFERRED_PRODUCTION_BASE_URL,
  getBaseURL,
} from '../../src/lib/util/env.ts'
import {
  BOOKABLE_SERVICE_SLUGS,
  getServiceCtaAction,
} from '../../src/lib/services-data.ts'

const readSource = (relativePath) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8')

test('production SEO helpers use the preferred www host', () => {
  assert.equal(
    PREFERRED_PRODUCTION_BASE_URL,
    'https://www.sixthgearmoto.com'
  )
  assert.equal(getBaseURL(), 'https://www.sixthgearmoto.com')
})

test('Helmets uses the singular handle and has a permanent redirect', () => {
  const nextConfig = readSource('next.config.js')
  const categorySchema = readSource('sanity/schemaTypes/categoryItem.ts')
  const collectionSectionSchema = readSource(
    'sanity/schemaTypes/homepageCollectionSection.ts'
  )

  assert.match(nextConfig, /source:\s*"\/:countryCode\/collections\/helmets"/)
  assert.match(
    nextConfig,
    /destination:\s*"\/:countryCode\/collections\/helmet"/
  )
  assert.match(nextConfig, /permanent:\s*true/)
  assert.doesNotMatch(categorySchema, /\/collections\/helmets/)
  assert.match(categorySchema, /\/collections\/helmet/)
  assert.doesNotMatch(collectionSectionSchema, /Example: helmets/)
  assert.match(collectionSectionSchema, /Example: helmet/)
})

test('localized product-section links receive unlocalized paths', () => {
  const homepage = readSource('src/app/[countryCode]/(main)/page.tsx')
  const hotDeals = readSource(
    'src/modules/home/components/product-sections/hot-deals-section/index.tsx'
  )
  const bestSellers = readSource(
    'src/modules/home/components/product-sections/best-sellers-section/index.tsx'
  )

  for (const source of [homepage, hotDeals, bestSellers]) {
    assert.doesNotMatch(source, /viewAllLink=\{`\/\$\{countryCode\}\//)
  }
  assert.match(homepage, /viewAllLink="\/store\?tag=new-arrival"/)
})

test('only the six workshop services use booking CTAs', () => {
  assert.deepEqual([...BOOKABLE_SERVICE_SLUGS], [
    'preventive-maintenance',
    'repairs-diagnostics',
    'accessories-installation',
    'wheels-drivetrain',
    'detailing-protection',
    'performance-upgrades',
  ])

  for (const slug of BOOKABLE_SERVICE_SLUGS) {
    assert.equal(getServiceCtaAction(slug), 'booking')
  }

  assert.equal(getServiceCtaAction('roadside-assistance'), 'contact')
  assert.equal(getServiceCtaAction('rider-support'), 'contact')
  assert.equal(getServiceCtaAction('unclassified-service'), 'contact')
})

test('homepage keeps the Hero H1 and exposes the Rider Stories index', () => {
  const hero = readSource('src/modules/home/components/hero/index.tsx')
  const categories = readSource(
    'src/modules/home/components/categories/index.tsx'
  )
  const stories = readSource(
    'src/modules/home/components/client-stories/index.tsx'
  )

  assert.match(hero, /<h1/)
  assert.doesNotMatch(categories, /<h1/)
  assert.match(stories, /href="\/rider-stories"/)
  assert.match(stories, />\s*View All Rider Stories\s*</)
})
