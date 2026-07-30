import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const readSource = (relativePath) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8')

const announcementBar = readSource(
  'src/modules/layout/components/announcement-bar/index.tsx'
)
const announcementSchema = readSource(
  'sanity/schemaTypes/announcement-bar.ts'
)
const marketingQuery = readSource('src/lib/cms/queries.ts')

test('announcement bar renders active Sanity messages as a seamless marquee', () => {
  assert.match(announcementBar, /message\.isActive/)
  assert.match(announcementBar, /useGSAP/)
  assert.match(announcementBar, /xPercent: -50/)
  assert.match(announcementBar, /min-w-\[100vw\] shrink-0/)
  assert.match(announcementBar, /className="flex min-h-\[36px\] w-max/)
  assert.match(announcementBar, /<AnnouncementSequence[\s\S]*duplicate/)
  assert.match(announcementBar, /rounded-full bg-current/)
  assert.doesNotMatch(announcementBar, /max-w-\[1440px\]/)
  assert.doesNotMatch(announcementBar, /setInterval/)
  assert.doesNotMatch(announcementBar, /setIdx/)
})

test('marquee preserves links, dismissal, and accessible duplicate behavior', () => {
  assert.match(announcementBar, /href=\{cleanSanityString\(message\.link\)\}/)
  assert.match(announcementBar, /tabIndex=\{duplicate \? -1 : undefined\}/)
  assert.match(announcementBar, /aria-hidden=\{duplicate \|\| undefined\}/)
  assert.match(announcementBar, /sessionStorage\.setItem\("sg_bar_dismissed"/)
})

test('existing Sanity fields support the marquee without a content migration', () => {
  assert.match(announcementSchema, /name: 'rotationSpeed'/)
  assert.match(announcementSchema, /title: 'Marquee Pace \(seconds per message\)'/)
  assert.match(announcementSchema, /Rule\.required\(\)\.max\(60\)/)
  assert.match(marketingQuery, /announcementBar \{[\s\S]*rotationSpeed/)
  assert.match(marketingQuery, /messages\[\] \{[\s\S]*text,[\s\S]*link,[\s\S]*isActive/)
})
