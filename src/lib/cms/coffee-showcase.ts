import type {
  SanityCoffeeItem,
  SanityCoffeeItemQueryResult,
  SanityCoffeeShowcaseContent,
  SanityCoffeeShowcaseQueryResult,
} from './types'

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isCompleteCoffeeItem(
  item: SanityCoffeeItemQueryResult | null
): item is SanityCoffeeItem {
  if (
    !item ||
    !isNonEmptyString(item._key) ||
    !isNonEmptyString(item.imageAlt) ||
    !isNonEmptyString(item.eyebrow) ||
    !isNonEmptyString(item.title) ||
    !isNonEmptyString(item.caption)
  ) {
    return false
  }

  if (item.mediaType === 'video') {
    return isNonEmptyString(item.videoUrl)
  }

  return item.mediaType === 'image' && isNonEmptyString(item.imageUrl)
}

export function isCompleteSanityCoffeeShowcase(
  value: SanityCoffeeShowcaseQueryResult
): value is SanityCoffeeShowcaseContent {
  const hasButtonText = isNonEmptyString(value.buttonText)
  const hasButtonLink = isNonEmptyString(value.buttonLink)

  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.sectionHeading) &&
    isNonEmptyString(value.coffeeIconUrl) &&
    isNonEmptyString(value.descriptionText) &&
    isNonEmptyString(value.storyProfileLogoUrl) &&
    isNonEmptyString(value.storyProfileName) &&
    isNonEmptyString(value.storyProfileSubtitle) &&
    hasButtonText === hasButtonLink &&
    Array.isArray(value.coffeeItems) &&
    value.coffeeItems.length > 0 &&
    value.coffeeItems.every(isCompleteCoffeeItem)
  )
}
