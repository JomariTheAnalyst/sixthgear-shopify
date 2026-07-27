import type { SanityAboutPage } from './types'
import { stegaClean } from 'next-sanity'

const cleanSanityString = stegaClean

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && cleanSanityString(value).trim().length > 0
}

export function isCompleteAboutPageMain(value: SanityAboutPage) {
  const hero = value.hero
  const story = value.story
  const ourValues = value.ourValues
  const whyChooseUs = value.whyChooseUs
  const ceoQuote = value.ceoQuote

  return (
    value.useSanityContent === true &&
    isNonEmptyString(hero?.title) &&
    isNonEmptyString(hero?.description) &&
    isNonEmptyString(hero?.backgroundImageUrl) &&
    Array.isArray(story) &&
    story.length > 0 &&
    story.every(
      (item) =>
        isNonEmptyString(item._key) &&
        isNonEmptyString(item.heading) &&
        isNonEmptyString(item.body) &&
        isNonEmptyString(item.imageUrl) &&
        isNonEmptyString(item.imageAlt)
    ) &&
    isNonEmptyString(ourValues?.heading) &&
    isNonEmptyString(ourValues?.description) &&
    Array.isArray(ourValues.cards) &&
    ourValues.cards.length > 0 &&
    ourValues.cards.every(
      (item) =>
        isNonEmptyString(item._key) &&
        isNonEmptyString(item.title) &&
        isNonEmptyString(item.description) &&
        isNonEmptyString(item.icon)
    ) &&
    isNonEmptyString(whyChooseUs?.sectionLabel) &&
    isNonEmptyString(whyChooseUs?.heading) &&
    isNonEmptyString(whyChooseUs?.subtitle) &&
    Array.isArray(whyChooseUs.items) &&
    whyChooseUs.items.length > 0 &&
    whyChooseUs.items.every(
      (item) =>
        isNonEmptyString(item._key) &&
        isNonEmptyString(item.title) &&
        isNonEmptyString(item.description) &&
        isNonEmptyString(item.icon)
    ) &&
    isNonEmptyString(whyChooseUs.topImageUrl) &&
    isNonEmptyString(whyChooseUs.topImageAlt) &&
    isNonEmptyString(whyChooseUs.bottomImageUrl) &&
    isNonEmptyString(whyChooseUs.bottomImageAlt) &&
    isNonEmptyString(ceoQuote?.quoteText) &&
    isNonEmptyString(ceoQuote.ceoName) &&
    isNonEmptyString(ceoQuote.ceoTitle) &&
    isNonEmptyString(ceoQuote.ceoPhotoUrl) &&
    isNonEmptyString(ceoQuote.ceoPhotoDescription)
  )
}

export function selectAboutPageMainSource(
  value: SanityAboutPage | null | undefined
) {
  return value && isCompleteAboutPageMain(value) ? value : null
}
