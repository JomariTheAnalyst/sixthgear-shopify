import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const readSource = (relativePath) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8")

const homepage = readSource("src/app/[countryCode]/(main)/page.tsx")
const hero = readSource("src/modules/home/components/hero/index.tsx")
const marquee = readSource("src/components/marquee-strip/index.tsx")
const seamlessLoop = readSource(
  "src/components/marquee-strip/seamless-loop.ts"
)
const fonts = readSource("src/lib/fonts.ts")
const layout = readSource("src/app/layout.tsx")
const brands = readSource(
  "src/modules/home/components/featured-brand/index.tsx"
)

test("orders Hero, Shop by Brands, then the standalone social marquee", () => {
  const heroPosition = homepage.indexOf("<Hero data={homepageHero}")
  const brandsPosition = homepage.indexOf(
    "<FeaturedBrand brands={shopifyBrandCards}"
  )
  const marqueePosition = homepage.indexOf("<MarqueeStrip />")

  assert.ok(heroPosition >= 0)
  assert.ok(brandsPosition > heroPosition)
  assert.ok(marqueePosition > brandsPosition)
  assert.doesNotMatch(hero, /MarqueeStrip|marquee-strip/)
  assert.doesNotMatch(homepage, /getHomepageMarquee|homepageMarquee/)
  assert.match(brands, /className="w-full"/)
  assert.doesNotMatch(brands, /max-w-\[1600px\]/)
})

test("registers and uses both National display fonts", () => {
  assert.match(fonts, /export const nationalCompressed = localFont/)
  assert.match(fonts, /national-2-compressed-extrabold\.woff2/)
  assert.match(fonts, /variable: "--font-national-compressed"/)
  assert.match(fonts, /export const nationalCondensed = localFont/)
  assert.match(fonts, /national-2-condensed-extrabold\.woff2/)
  assert.match(fonts, /variable: "--font-national-condensed"/)
  assert.match(layout, /nationalCompressed\.variable/)
  assert.match(layout, /nationalCondensed\.variable/)
  assert.match(marquee, /nationalCompressed\.className/)
  assert.match(marquee, /nationalCondensed\.className/)
})

test("builds a slower top row and faster bottom row with accessible copies", () => {
  assert.match(marquee, /TOP_ROW_DURATION_SECONDS = 48/)
  assert.match(marquee, /BOTTOM_ROW_DURATION_SECONDS = 24/)
  assert.match(marquee, /createSeamlessLoop\(topItems/)
  assert.match(marquee, /createSeamlessLoop\(bottomItems/)
  assert.match(marquee, /durationSeconds: TOP_ROW_DURATION_SECONDS/)
  assert.match(marquee, /durationSeconds: BOTTOM_ROW_DURATION_SECONDS/)
  assert.doesNotMatch(marquee, /xPercent: -50|TopPhraseSequence|SocialSequence/)
  assert.match(seamlessLoop, /official seamless horizontalLoop helper/)
  assert.match(seamlessLoop, /repeat = -1/)
  assert.match(seamlessLoop, /onReverseComplete/)
  assert.match(seamlessLoop, /\.fromTo\(/)
  assert.match(seamlessLoop, /immediateRender: false/)
  assert.match(seamlessLoop, /timeline\.progress\(1, true\)\.progress/)
  assert.match(marquee, /BOTTOM_ROW_SLOW_SCALE = 0\.35/)
  assert.match(marquee, /aria-hidden=\{copyIndex > 0 \|\| undefined\}/)
  assert.match(marquee, /tabIndex=\{copyIndex > 0 \? -1 : undefined\}/)
  assert.match(marquee, /motion-reduce:hidden/)
  assert.match(marquee, /prefers-reduced-motion: reduce/)
  assert.match(marquee, /ResizeObserver/)
  assert.match(marquee, /document\.fonts\?\.ready/)
  assert.match(marquee, /getRequiredCopies/)
})

test("uses business social profiles with the exact Instagram override", () => {
  assert.match(marquee, /businessInfo\.socialProfiles/)
  assert.match(
    marquee,
    /https:\/\/www\.instagram\.com\/sixthgear_moto_supply\//
  )
  assert.match(marquee, /name: "YOUTUBE"/)
  assert.match(marquee, /name: "TIKTOK"/)
  assert.match(marquee, /name: "FACEBOOK"/)
  assert.match(marquee, /name: "INSTAGRAM"/)
  assert.match(marquee, /name: "LINKEDIN"/)
  assert.match(marquee, /target="_blank"/)
  assert.match(marquee, /rel="noopener noreferrer"/)
  assert.match(marquee, /hover:text-\[#F16D34\]/)
  assert.match(marquee, /focus-visible:text-\[#F16D34\]/)
  assert.match(marquee, /bg-white/)
  assert.doesNotMatch(marquee, /bg-\[#DDE8E8\]/)
  assert.match(marquee, /gap-7 will-change-transform/)
  assert.match(marquee, /text-\[52px\][\s\S]*lg:text-\[112px\]/)
  assert.match(
    marquee,
    /onMouseEnter=\{\(\) => setBottomSpeed\(BOTTOM_ROW_SLOW_SCALE\)\}/
  )
})
