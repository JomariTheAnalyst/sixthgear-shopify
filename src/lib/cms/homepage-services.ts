import type { SanityServiceItem, SanityServicesSection } from './types'
import { stegaClean } from 'next-sanity'

const cleanSanityString = stegaClean

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && cleanSanityString(value).trim().length > 0
}

function isCompleteService(item: SanityServiceItem) {
  return (
    isNonEmptyString(item._key) &&
    isNonEmptyString(item.title) &&
    isNonEmptyString(item.description) &&
    isNonEmptyString(item.image) &&
    (isNonEmptyString(item.slug) || isNonEmptyString(item.link))
  )
}

export function isCompleteHomepageServices(value: SanityServicesSection) {
  return (
    value.useCustomServices === true &&
    isNonEmptyString(value.sectionTitle) &&
    isNonEmptyString(value.sectionDescription) &&
    Array.isArray(value.services) &&
    value.services.length > 0 &&
    value.services.every(isCompleteService)
  )
}

export function selectHomepageServicesSource(
  value: SanityServicesSection | null | undefined
) {
  return value && isCompleteHomepageServices(value) ? value : null
}
