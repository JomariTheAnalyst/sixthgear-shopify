import { stegaClean } from 'next-sanity'
import { defineLocations, type DocumentLocationResolvers } from 'sanity/presentation'

export const CANONICAL_SINGLETON_IDS = {
  homepage: 'homepage',
  aboutPage: 'aboutPage',
  servicesPage: 'servicesPage',
  marketing: 'marketing',
} as const

export function isCanonicalSingletonId(value: unknown, canonicalId: string): boolean {
  if (typeof value !== 'string') return false
  return stegaClean(value).replace(/^drafts\./, '') === canonicalId
}

export function resolveBlogPostPath(slug: unknown): string | null {
  if (typeof slug !== 'string') return null
  const cleanSlug = stegaClean(slug).trim()
  if (!cleanSlug || cleanSlug.includes('/') || cleanSlug.includes('\\')) return null
  return `/rider-stories/${encodeURIComponent(cleanSlug)}`
}

function singletonLocation(id: unknown, canonicalId: string, title: string, href: string) {
  return isCanonicalSingletonId(id, canonicalId)
    ? { locations: [{ title, href }] }
    : { message: `Only the canonical ${canonicalId} singleton has a storefront location.` }
}

export const presentationLocations: DocumentLocationResolvers = {
  homepage: defineLocations({
    select: { id: '_id' },
    resolve: (value) => singletonLocation(value?.id, CANONICAL_SINGLETON_IDS.homepage, 'Homepage', '/'),
  }),
  aboutPage: defineLocations({
    select: { id: '_id' },
    resolve: (value) =>
      singletonLocation(value?.id, CANONICAL_SINGLETON_IDS.aboutPage, 'About Page', '/about'),
  }),
  servicesPage: defineLocations({
    select: { id: '_id' },
    resolve: (value) =>
      singletonLocation(
        value?.id,
        CANONICAL_SINGLETON_IDS.servicesPage,
        'Services Page',
        '/services'
      ),
  }),
  marketing: defineLocations({
    select: { id: '_id' },
    resolve: (value) =>
      singletonLocation(value?.id, CANONICAL_SINGLETON_IDS.marketing, 'Homepage marketing', '/'),
  }),
  blogPost: defineLocations({
    select: { slug: 'slug.current', title: 'title' },
    resolve: (value) => {
      const slug = value?.slug
      const title = value?.title
      const href = resolveBlogPostPath(slug)
      return href
        ? { locations: [{ title: typeof title === 'string' ? stegaClean(title) : 'Rider Story', href }] }
        : { message: 'Add a slug before opening this Rider Story in the Visual Editor.' }
    },
  }),
}
