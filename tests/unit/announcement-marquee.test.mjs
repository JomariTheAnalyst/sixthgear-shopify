import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const source = readFileSync(
  new URL(
    "../../src/modules/marketing/components/announcement-strip/marquee-strip.tsx",
    import.meta.url
  ),
  "utf8"
)

test("uses two measured groups for a gapless GSAP marquee", () => {
  assert.match(source, /firstGroupRef/)
  assert.match(source, /baseSequenceRef/)
  assert.match(source, /x: -groupWidth/)
  assert.match(source, /ease: "none"/)
  assert.match(source, /repeat: -1/)
  assert.match(source, /aria-hidden="true"/)
  assert.doesNotMatch(source, /animate-marquee|allMessages/)
})

test("fills short message groups and refreshes after layout changes", () => {
  assert.match(source, /Math\.ceil\(viewportWidth \/ baseWidth\)/)
  assert.match(source, /copiesPerGroup/)
  assert.match(source, /ResizeObserver/)
  assert.match(source, /document\.fonts\?\.ready/)
  assert.match(source, /resizeObserver\.disconnect\(\)/)
})

test("honors reduced motion and cleans up GSAP work", () => {
  assert.match(source, /prefers-reduced-motion: no-preference/)
  assert.match(source, /prefers-reduced-motion: reduce/)
  assert.match(source, /tween\?\.kill\(\)/)
  assert.match(source, /media\.revert\(\)/)
  assert.match(source, /revertOnUpdate: true/)
})
