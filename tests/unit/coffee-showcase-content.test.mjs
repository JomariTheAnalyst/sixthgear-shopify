import assert from 'node:assert/strict'
import test from 'node:test'

import { isCompleteSanityCoffeeShowcase } from '../../src/lib/cms/coffee-showcase.ts'
import { selectCoffeeShowcaseContent } from '../../src/modules/home/components/coffee-showcase/content.ts'

const imageStory = {
  _key: 'image-story',
  mediaType: 'image',
  imageUrl: 'https://cdn.sanity.io/images/project/dataset/image.jpg',
  videoUrl: null,
  imageAlt: 'Coffee being poured beside a motorcycle helmet',
  eyebrow: 'Sanity eyebrow',
  title: 'Sanity image title',
  caption: 'Sanity image caption',
}

const videoStory = {
  _key: 'video-story',
  mediaType: 'video',
  imageUrl: null,
  videoUrl: 'https://cdn.sanity.io/files/project/dataset/video.mp4',
  imageAlt: 'Riders sharing coffee in the lounge',
  eyebrow: 'Second eyebrow',
  title: 'Sanity video title',
  caption: 'Sanity video caption',
}

const completeSanityContent = {
  useSanityContent: true,
  sectionHeading: 'Sanity heading',
  coffeeIconUrl: 'https://cdn.sanity.io/images/project/dataset/icon.png',
  descriptionText: 'Sanity description',
  storyProfileLogoUrl: 'https://cdn.sanity.io/images/project/dataset/logo.png',
  storyProfileName: 'Sanity profile',
  storyProfileSubtitle: 'Sanity subtitle',
  buttonText: null,
  buttonLink: null,
  coffeeItems: [videoStory, imageStory],
}

test('false selects the complete fallback without mixing provided CMS fields', () => {
  const result = selectCoffeeShowcaseContent({
    useSanityContent: false,
    sectionHeading: 'This value must not leak into the fallback',
  })

  assert.equal(result.source, 'fallback')
  assert.equal(result.sectionHeading, 'More Than Riding Gear\nWe Serve Great Coffee Too')
  assert.equal(result.coffeeItems.length, 6)
  assert.equal(result.buttonLink, '/first-gear')
})

test('true selects only Sanity content and preserves editor ordering', () => {
  assert.equal(isCompleteSanityCoffeeShowcase(completeSanityContent), true)

  const result = selectCoffeeShowcaseContent(completeSanityContent)

  assert.equal(result.source, 'sanity')
  assert.equal(result.sectionHeading, 'Sanity heading')
  assert.deepEqual(
    result.coffeeItems.map((item) => item.key),
    ['video-story', 'image-story']
  )
  assert.equal(result.coffeeItems[0].src, videoStory.videoUrl)
  assert.equal(result.coffeeItems[1].src, imageStory.imageUrl)
  assert.equal(result.buttonText, null)
  assert.equal(result.buttonLink, null)
})

test('enabled but incomplete Sanity content fails validation as one unit', () => {
  assert.equal(
    isCompleteSanityCoffeeShowcase({
      ...completeSanityContent,
      coffeeItems: [{ ...imageStory, caption: null }],
    }),
    false
  )

  assert.equal(
    isCompleteSanityCoffeeShowcase({
      ...completeSanityContent,
      buttonText: 'Explore',
      buttonLink: null,
    }),
    false
  )
})
