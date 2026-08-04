import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const readSource = (relativePath) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8")

const homepage = readSource("src/app/[countryCode]/(main)/page.tsx")
const videoFeature = readSource(
  "src/modules/home/components/video-feature/index.tsx"
)
const selector = readSource("src/lib/cms/video-feature.ts")
const schema = readSource("sanity/schemaTypes/video-feature-section.ts")
const schemaIndex = readSource("sanity/schemaTypes/index.ts")
const homepageSchema = readSource("sanity/schemaTypes/homepage.ts")
const queries = readSource("src/lib/cms/queries.ts")
const client = readSource("src/lib/cms/client.ts")

test("renders the CMS-selected video feature immediately after the homepage marquee", () => {
  const marqueePosition = homepage.indexOf("<MarqueeStrip />")
  const videoPosition = homepage.indexOf(
    "<VideoFeature data={videoFeatureContent} />"
  )
  const nextBannerPosition = homepage.indexOf(
    '<FeaturedCollectionBanner data={getFeatured("after_hero")} />'
  )

  assert.ok(marqueePosition >= 0)
  assert.ok(videoPosition > marqueePosition)
  assert.ok(nextBannerPosition > videoPosition)
  assert.match(homepage, /getHomepageVideoFeature\(\)/)
  assert.match(homepage, /selectVideoFeatureContent\(homepageVideoFeature\)/)
  assert.match(homepage, /videoFeatureContent\.enabled/)
  assert.match(homepage, /videoFeature\.useSanityContent/)
})

test("defines and queries a complete Sanity video model", () => {
  assert.match(schema, /name: 'videoFeatureSection'/)
  assert.match(schema, /name: 'videoUpload'/)
  assert.match(schema, /accept: 'video\/\*'/)
  assert.match(schema, /name: 'videoUrl'/)
  assert.match(schema, /res\.cloudinary\.com/)
  assert.match(schema, /youtu\.be/)
  assert.match(schema, /youtube\.com/)
  assert.match(schema, /youtube-nocookie\.com/)
  assert.match(schema, /name: 'poster'/)
  assert.match(schema, /name: 'startMuted'/)
  assert.match(schema, /name: 'loop'/)
  assert.match(schema, /name: 'ctaLabel'/)
  assert.match(schemaIndex, /videoFeatureSection/)
  assert.match(homepageSchema, /name: 'videoFeature'/)
  assert.match(queries, /"uploadedVideoUrl": videoUpload\.asset->url/)
  assert.match(queries, /"posterUrl": poster\.asset->url/)
  assert.match(client, /getHomepageVideoFeature/)
})

test("selects uploaded, Cloudinary, and YouTube media with a built-in fallback", () => {
  assert.match(
    selector,
    /https:\/\/res\.cloudinary\.com\/djn9ubf6a\/video\/upload\/v1785828228\/sixthgear-trailer_aqziuc\.mp4/
  )
  assert.match(selector, /section\.sourceType === 'upload'/)
  assert.match(selector, /getYouTubeVideoId/)
  assert.match(selector, /youtube-nocookie\.com\/embed/)
  assert.match(selector, /i\.ytimg\.com\/vi/)
  assert.match(selector, /section\.enabled !== false/)
  assert.match(selector, /source: 'sanity'/)
  assert.match(selector, /source: 'fallback'/)
})

test("uses scoped GSAP MorphSVG playback chrome with cleanup and reduced motion", () => {
  assert.match(videoFeature, /MorphSVGPlugin/)
  assert.match(videoFeature, /gsap\.registerPlugin\(useGSAP, MorphSVGPlugin\)/)
  assert.match(videoFeature, /type: "rotational"/)
  assert.match(videoFeature, /map: "complexity"/)
  assert.match(videoFeature, /contextSafe/)
  assert.match(videoFeature, /chromeHideTweenRef/)
  assert.match(videoFeature, /playerControlsRef/)
  assert.match(videoFeature, /prefers-reduced-motion: reduce/)
  assert.match(videoFeature, /if \(playing\) hideChrome\(1\)/)
  assert.match(videoFeature, /autoAlpha: 0/)
  assert.match(videoFeature, /onPointerEnter/)
  assert.match(videoFeature, /onPointerMove/)
  assert.match(videoFeature, /onPointerLeave/)
})

test("provides functional controls for native video and YouTube", () => {
  assert.match(videoFeature, /data\.media\.kind === "native"/)
  assert.match(videoFeature, /<iframe/)
  assert.match(videoFeature, /postYouTubeCommand\("playVideo"|isPlaying \? "pauseVideo" : "playVideo"/)
  assert.match(videoFeature, /postYouTubeCommand\("seekTo"/)
  assert.match(videoFeature, /postYouTubeCommand\("getCurrentTime"\)/)
  assert.match(videoFeature, /setInterval/)
  assert.match(videoFeature, /window\.clearInterval/)
  assert.match(videoFeature, /aria-label="Video progress"/)
  assert.match(videoFeature, /aria-label="Toggle fullscreen"/)
  assert.match(videoFeature, /document\.exitFullscreen/)
  assert.match(videoFeature, /player\.requestFullscreen/)
  assert.match(videoFeature, /onTimeUpdate/)
  assert.match(videoFeature, /onVolumeChange/)
})

test("keeps the video presentation accessible and CMS-driven", () => {
  assert.match(videoFeature, /preload="metadata"/)
  assert.match(videoFeature, /playsInline/)
  assert.match(videoFeature, /muted=\{data\.startMuted\}/)
  assert.match(videoFeature, /aria-label=\{data\.videoLabel\}/)
  assert.match(videoFeature, /aria-label=\{isPlaying \? "Pause video" : "Play video"\}/)
  assert.match(videoFeature, /aria-pressed=\{isPlaying\}/)
  assert.match(videoFeature, /className="relative aspect-video/)
  assert.match(videoFeature, /\{data\.title\}/)
  assert.match(videoFeature, /\{data\.description\}/)
  assert.match(videoFeature, /data\.ctaLabel/)
  assert.match(videoFeature, /data\.ctaLink/)
})
