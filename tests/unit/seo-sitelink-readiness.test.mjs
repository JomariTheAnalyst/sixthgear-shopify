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
  assert.match(hero, /heading:\s*["']SIXTHGEAR MOTO["']/)
  assert.doesNotMatch(categories, /<h1/)
  assert.match(stories, /href="\/rider-stories"/)
  assert.match(stories, />\s*View All Rider Stories\s*</)
})

test('approved routes use clean absolute titles and matching social titles', () => {
  const rootLayout = readSource('src/app/layout.tsx')
  const homepage = readSource('src/app/[countryCode]/(main)/page.tsx')
  const routeSources = [
    {
      source: readSource('src/app/[countryCode]/(main)/store/page.tsx'),
      title: 'Shop',
    },
    {
      source: readSource('src/app/[countryCode]/(main)/services/page.tsx'),
      title: 'Services',
    },
    {
      source: readSource('src/app/[countryCode]/(main)/contact/page.tsx'),
      title: 'Contact Us',
    },
    {
      source: readSource('src/app/[countryCode]/(main)/about/page.tsx'),
      title: 'About Us',
    },
    {
      source: readSource(
        'src/app/[countryCode]/(main)/rider-stories/page.tsx'
      ),
      title: 'Rider Stories',
    },
  ]
  const firstGear = readSource(
    'src/app/[countryCode]/(main)/first-gear/page.tsx'
  )
  const collections = readSource(
    'src/app/[countryCode]/(main)/collections/[handle]/page.tsx'
  )

  assert.match(rootLayout, /template:\s*["']%s \| SixthGearMoto["']/)
  assert.match(homepage, /const title = ["']SixthGearMoto["']/)
  assert.match(homepage, /title:\s*\{\s*absolute:\s*title,?\s*\}/)

  for (const { source, title } of routeSources) {
    assert.match(source, new RegExp(`const title = ["']${title}["']`))
    assert.match(source, /title:\s*\{\s*absolute:\s*title,?\s*\}/)
    assert.match(source, /openGraph:\s*\{[\s\S]*?title,/)
    assert.match(source, /twitter:\s*\{[\s\S]*?title,/)
  }

  assert.match(
    firstGear,
    /title:\s*\{\s*absolute:\s*["']First Gear Coffee["']\s*\}/
  )
  assert.match(collections, /params\.handle === ["']helmet["']/)
  assert.match(collections, /\? ["']Helmets["']/)
  assert.match(
    collections,
    /params\.handle === ["']helmet["']\s*\?\s*\{\s*absolute:\s*title\s*\}/
  )
})

test('primary sitelink destinations use approved labels and unlocalized paths', () => {
  const nav = readSource('src/modules/layout/templates/nav/nav-client.tsx')
  const footer = readSource('src/modules/layout/templates/footer/index.tsx')
  const combined = `${nav}\n${footer}`
  const approvedLinks = [
    ['Shop', '/store'],
    ['Services', '/services'],
    ['Helmets', '/collections/helmet'],
    ['First Gear Coffee', '/first-gear'],
    ['Contact Us', '/contact'],
  ]

  for (const [name, href] of approvedLinks) {
    assert.match(
      combined,
      new RegExp(`name:\\s*["']${name}["'],\\s*href:\\s*["']${href}["']`)
    )
  }

  assert.doesNotMatch(combined, /href:\s*["']\/ph\//)
  assert.doesNotMatch(combined, /\/collections\/helmets/)
})

test('WebSite schema keeps approved SixthGearMoto names', () => {
  const seo = readSource('src/lib/seo.ts')

  assert.match(seo, /const SITE_NAME = ["']SixthGearMoto["']/)
  assert.match(
    seo,
    /const SITE_ALTERNATE_NAME = ["']Sixth Gear Moto["']/
  )
  assert.match(
    seo,
    /getWebsiteStructuredData[\s\S]*?name:\s*BRAND_NAME,[\s\S]*?alternateName:\s*SITE_ALTERNATE_NAME/
  )
})
