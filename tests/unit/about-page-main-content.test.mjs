import assert from 'node:assert/strict'
import test from 'node:test'

import { selectAboutPageMainSource } from '../../src/lib/cms/about-page-main.ts'

const complete = {
  useSanityContent: true,
  hero: {
    title: 'About',
    description: 'About description',
    backgroundImageUrl: 'https://cdn/hero.jpg',
  },
  story: [{
    _key: 'story', heading: 'Story', body: 'Body',
    imageUrl: 'https://cdn/story.jpg', imageAlt: 'Story image',
  }],
  ourValues: {
    heading: 'Values', description: 'Values description',
    cards: [{ _key: 'value', title: 'Value', description: 'Description', icon: 'wrench' }],
  },
  whyChooseUs: {
    sectionLabel: 'Why', heading: 'Choose us', subtitle: 'Reason',
    items: [{ _key: 'reason', title: 'Reason', description: 'Description', icon: 'wrench' }],
    topImageUrl: 'https://cdn/top.jpg', topImageAlt: 'Top image',
    bottomImageUrl: 'https://cdn/bottom.jpg', bottomImageAlt: 'Bottom image',
  },
  ceoQuote: {
    quoteText: 'Quote', highlightedPhrase: 'Quote', ceoName: 'Name',
    ceoTitle: 'Title', ceoPhotoUrl: 'https://cdn/ceo.jpg', ceoPhotoDescription: 'CEO portrait',
  },
}

test('About main-content toggle is atomic', () => {
  assert.equal(selectAboutPageMainSource({ ...complete, useSanityContent: false }), null)
  assert.equal(selectAboutPageMainSource({ ...complete, story: [] }), null)
  assert.equal(selectAboutPageMainSource(complete), complete)
})
