import type { MetadataRoute } from "next"
import { createClient } from "next-sanity"

import { shopifyGraphql } from "@lib/shopify/client"
import { getBaseURL } from "@lib/util/env"

export const revalidate = 3600

const COUNTRY_CODE = "ph"
const SHOPIFY_PAGE_SIZE = 250
const MAX_SHOPIFY_PAGES = 40

type SitemapEntry = MetadataRoute.Sitemap[number]

type ShopifySitemapNode = {
  handle: string
  updatedAt?: string | null
}

type ShopifySitemapConnection = {
  edges: Array<{
    node: ShopifySitemapNode
  }>
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

type SanitySitemapDocument = {
  slug?: string | null
  _updatedAt?: string | null
}

const productSitemapQuery = `
  query ProductSitemap($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          handle
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const collectionSitemapQuery = `
  query CollectionSitemap($first: Int!, $after: String) {
    collections(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          handle
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

function absoluteUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${getBaseURL()}/${COUNTRY_CODE}${path ? normalizedPath : ""}`
}

function toLastModified(value?: string | null) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

async function getAllShopifyNodes(
  rootField: "products" | "collections",
  query: string
): Promise<ShopifySitemapNode[]> {
  const nodes: ShopifySitemapNode[] = []
  let after: string | null = null

  for (let page = 0; page < MAX_SHOPIFY_PAGES; page++) {
    const { data, errors } = await shopifyGraphql<
      Record<typeof rootField, ShopifySitemapConnection>
    >(query, { first: SHOPIFY_PAGE_SIZE, after })

    if (errors?.length) {
      console.error(`[sitemap] Failed to fetch Shopify ${rootField}`, errors)
      break
    }

    const connection = data?.[rootField]
    if (!connection) {
      break
    }

    nodes.push(...connection.edges.map((edge) => edge.node))

    if (!connection.pageInfo.hasNextPage || !connection.pageInfo.endCursor) {
      break
    }

    after = connection.pageInfo.endCursor
  }

  return nodes
}

async function getSanitySitemapDocuments(
  type: "service" | "blogPost"
): Promise<SanitySitemapDocument[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) {
    return []
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-09",
    useCdn: true,
  })

  const query =
    type === "service"
      ? `*[_type == "service" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
      : `*[_type == "blogPost" && defined(slug.current) && defined(publishedAt)]{ "slug": slug.current, _updatedAt }`

  try {
    const result = await client.fetch<SanitySitemapDocument[] | null>(
      query,
      {},
      {
        next: {
          revalidate,
          tags: ["sanity"],
        },
      }
    )

    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error(`[sitemap] Failed to fetch Sanity ${type} documents`, error)
    return []
  }
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
  ]

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: "weekly",
    priority: route.priority,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, services, stories] = await Promise.all([
    getAllShopifyNodes("products", productSitemapQuery),
    getAllShopifyNodes("collections", collectionSitemapQuery),
    getSanitySitemapDocuments("service"),
    getSanitySitemapDocuments("blogPost"),
  ])

  return [
    ...staticRoutes(),
    ...collections
      .filter((collection) => collection.handle)
      .map((collection) => ({
        url: absoluteUrl(`/collections/${collection.handle}`),
        lastModified: toLastModified(collection.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ...products
      .filter((product) => product.handle)
      .map((product) => ({
        url: absoluteUrl(`/products/${product.handle}`),
        lastModified: toLastModified(product.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.9,
      })),
    ...services
      .filter((service) => service.slug)
      .map((service) => ({
        url: absoluteUrl(`/services/${service.slug}`),
        lastModified: toLastModified(service._updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...stories
      .filter((story) => story.slug)
      .map((story) => ({
        url: absoluteUrl(`/rider-stories/${story.slug}`),
        lastModified: toLastModified(story._updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ]
}
