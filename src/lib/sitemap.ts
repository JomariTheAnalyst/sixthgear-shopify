import type { MetadataRoute } from "next"

import { PREFERRED_PRODUCTION_BASE_URL } from "./util/env.ts"

type SitemapEntry = MetadataRoute.Sitemap[number]

export type SitemapSourceNode = {
  handle: string
  updatedAt?: string | null
}

export type SitemapDocument = {
  slug?: string | null
  _updatedAt?: string | null
}

type SitemapSources = {
  products: SitemapSourceNode[]
  collections: SitemapSourceNode[]
  cmsServices: SitemapDocument[]
  localServiceSlugs: string[]
  stories: SitemapDocument[]
}

function encodePathSegment(segment: string) {
  try {
    return encodeURIComponent(decodeURIComponent(segment))
  } catch {
    return encodeURIComponent(segment)
  }
}

export function buildSitemapUrl(path = "") {
  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : ""
  const encodedPath = (normalizedPath || "/")
    .split("/")
    .map(encodePathSegment)
    .join("/")

  return new URL(encodedPath, `${PREFERRED_PRODUCTION_BASE_URL}/`).href
}

export function toSitemapLastModified(value?: string | null) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function withLastModified(
  entry: Omit<SitemapEntry, "lastModified">,
  value?: string | null
): SitemapEntry {
  const lastModified = toSitemapLastModified(value)

  return lastModified ? { ...entry, lastModified } : entry
}

function staticRoutes(): SitemapEntry[] {
  const routes = [
    { path: "", priority: 1 },
    { path: "/store", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/services", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
    { path: "/rider-stories", priority: 0.6 },
    { path: "/first-gear", priority: 0.6 },
    { path: "/returns-warranty", priority: 0.4 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/government-compliance", priority: 0.3 },
  ]

  return routes.map((route) => ({
    url: buildSitemapUrl(route.path),
    changeFrequency: "weekly",
    priority: route.priority,
  }))
}

export function buildSitemapEntries({
  products,
  collections,
  cmsServices,
  localServiceSlugs,
  stories,
}: SitemapSources): MetadataRoute.Sitemap {
  const serviceEntriesBySlug = new Map<string, SitemapDocument>()

  localServiceSlugs
    .filter(Boolean)
    .forEach((slug) => {
      serviceEntriesBySlug.set(slug, { slug })
    })

  cmsServices
    .filter((service) => service.slug)
    .forEach((service) => {
      serviceEntriesBySlug.set(service.slug!, service)
    })

  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes(),
    ...collections
      .filter((collection) => collection.handle)
      .map((collection) =>
        withLastModified(
          {
            url: buildSitemapUrl(`/collections/${collection.handle}`),
            changeFrequency: "daily",
            priority: 0.8,
          },
          collection.updatedAt
        )
      ),
    ...products
      .filter((product) => product.handle)
      .map((product) =>
        withLastModified(
          {
            url: buildSitemapUrl(`/products/${product.handle}`),
            changeFrequency: "daily",
            priority: 0.9,
          },
          product.updatedAt
        )
      ),
    ...Array.from(serviceEntriesBySlug.values())
      .filter((service) => service.slug)
      .map((service) =>
        withLastModified(
          {
            url: buildSitemapUrl(`/services/${service.slug}`),
            changeFrequency: "monthly",
            priority: 0.7,
          },
          service._updatedAt
        )
      ),
    ...stories
      .filter((story) => story.slug)
      .map((story) =>
        withLastModified(
          {
            url: buildSitemapUrl(`/rider-stories/${story.slug}`),
            changeFrequency: "monthly",
            priority: 0.6,
          },
          story._updatedAt
        )
      ),
  ]

  return Array.from(
    new Map(entries.map((entry) => [entry.url, entry])).values()
  )
}
