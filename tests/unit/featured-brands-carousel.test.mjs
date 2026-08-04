import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

const readSource = (relativePath) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8")

const carousel = readSource(
  "src/modules/home/components/featured-brand/brand-cards.tsx"
)
const horizontalLoop = readSource(
  "src/modules/home/components/featured-brand/horizontal-loop.ts"
)
const dragCursor = readSource("src/components/drag-cursor/index.tsx")
const section = readSource(
  "src/modules/home/components/featured-brand/index.tsx"
)
const homepage = readSource("src/app/[countryCode]/(main)/page.tsx")
const shopify = readSource("src/lib/shopify/index.ts")
const query = readSource("src/lib/shopify/queries/collection.ts")

test("renders one real 4:5 card set controlled by the GSAP seamless loop", () => {
  assert.match(carousel, /createHorizontalLoop/)
  assert.match(carousel, /Draggable\.create/)
  assert.match(horizontalLoop, /official horizontalLoop helper pattern/)
  assert.match(horizontalLoop, /repeat: -1/)
  assert.match(horizontalLoop, /paused: true/)
  assert.match(horizontalLoop, /onReverseComplete/)
  assert.match(carousel, /brands\.map\(\(brand, sourceIndex\)/)
  assert.doesNotMatch(carousel, /useEmblaCarousel|createLoopSlides|duplicate/)
  assert.match(carousel, /aspect-\[4\/5\]/)
  assert.match(carousel, /w-\[72vw\]/)
  assert.match(carousel, /lg:w-\[26vw\]/)
  assert.match(carousel, /xl:w-\[22vw\]/)
  assert.match(carousel, /object-cover/)
  assert.match(carousel, />\s*SHOP NOW\s*</)
  assert.match(carousel, /mt-3 hidden[\s\S]*md:inline-flex/)
  assert.match(
    carousel,
    /className="group relative block h-full w-full overflow-hidden bg-neutral-900 focus-visible:outline/
  )
  assert.match(section, /w-full overflow-hidden/)
  assert.match(section, /<div className="w-full">/)
})

test("prevents navigation after a real drag and preserves normal card links", () => {
  assert.match(carousel, /dragClickables: true/)
  assert.match(carousel, /DRAG_THRESHOLD_PX = 8/)
  assert.match(carousel, /minimumMovement: DRAG_THRESHOLD_PX/)
  assert.match(carousel, /onDragStart\(\)/)
  assert.match(carousel, /draggedRef\.current = true/)
  assert.match(carousel, /onClickCapture=\{handleCardClickCapture\}/)
  assert.match(carousel, /event\.preventDefault\(\)/)
  assert.match(carousel, /event\.stopPropagation\(\)/)
  assert.match(carousel, /draggedRef\.current = false/)
  assert.match(
    carousel,
    /const handlePointerDown[\s\S]*draggedRef\.current = false/
  )
  assert.match(carousel, /<LocalizedClientLink/)
  assert.doesNotMatch(carousel, /autoPlay|autoplay/i)
  assert.match(carousel, /inertia: !reducedMotion/)
  assert.match(carousel, /onThrowUpdate\(\)/)
  assert.doesNotMatch(carousel, /requestAnimationFrame|setTimeout/)
  assert.doesNotMatch(carousel, /snapProgress|settleToNearestCard/)
})

test("supports horizontal trackpads without intercepting vertical wheel input", () => {
  assert.match(carousel, /addEventListener\("wheel", handleWheel/)
  assert.match(
    carousel,
    /Math\.abs\(event\.deltaX\) <= Math\.abs\(event\.deltaY\)/
  )
  assert.match(carousel, /event\.preventDefault\(\)/)
  assert.match(carousel, /\{ passive: false \}/)
})

test("adds reduced-motion parallax and a fine-pointer GSAP drag cursor", () => {
  assert.match(carousel, /data-brand-parallax/)
  assert.match(carousel, /PARALLAX_MAX_PERCENT = 7/)
  assert.match(carousel, /measureParallax/)
  assert.match(carousel, /parallaxMetrics/)
  assert.doesNotMatch(carousel, /getBoundingClientRect/)
  assert.match(carousel, /onLoad=\{onImageLoad\}/)
  assert.match(carousel, /prefers-reduced-motion: reduce/)
  assert.match(carousel, /parallaxSetters\.forEach\(\(setX\) => setX\(0\)\)/)
  assert.match(carousel, /<DragCursor ref=\{dragCursorRef\}/)
  assert.match(dragCursor, /\(hover: hover\) and \(pointer: fine\)/)
  assert.match(dragCursor, /if \(!enabled\) return null/)
  assert.match(dragCursor, /gsap\.quickTo\(cursor, "x"/)
  assert.match(dragCursor, /positionImmediately\(clientX, clientY\)/)
  assert.match(dragCursor, /pointer-events-none fixed/)
  assert.match(dragCursor, /border-\[3px\][\s\S]*bg-white/)
  assert.match(dragCursor, /<span>DRAG<\/span>/)
  assert.doesNotMatch(dragCursor, /clientWidth \/ 2|clientHeight \/ 2/)
  assert.match(carousel, /draggable\?\.kill\(\)/)
  assert.match(carousel, /resizeObserver\.disconnect\(\)/)
  assert.match(dragCursor, /pointerQuery\.removeEventListener/)
  assert.match(dragCursor, /gsap\.killTweensOf\(cursor\)/)
})

test("uses only paginated Shopify collections for the rendered section", () => {
  assert.match(homepage, /getBrandCollections\(\)/)
  assert.match(homepage, /\/collections\/\$\{collection\.handle\}/)
  assert.doesNotMatch(homepage, /getHomepageShopByBrands|shopByBrands/)
  assert.doesNotMatch(homepage, /SanityEditTarget[^>]*shopByBrands/)
  assert.match(shopify, /first: 250, after/)
  assert.match(shopify, /while \(true\)/)
  assert.match(shopify, /brand-prefix-v2/)
  assert.match(shopify, /Matching brand collections/)
  assert.match(query, /collections\(first: \$first, after: \$after/)
  assert.match(query, /hasNextPage[\s\S]*endCursor/)
  assert.doesNotMatch(homepage, /slice\(0, 4\)/)
})

test("uses a local decorative placeholder when a collection image is missing", () => {
  const placeholder = new URL(
    "../../public/images/placeholders/brand-collection.svg",
    import.meta.url
  )

  assert.equal(existsSync(placeholder), true)
  assert.match(readFileSync(placeholder, "utf8"), /viewBox="0 0 400 500"/)
  assert.match(homepage, /decorativeImage: image === null/)
  assert.match(carousel, /brand\.decorativeImage \? "" : brand\.imageAlt/)
})
