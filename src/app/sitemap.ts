import type { MetadataRoute } from "next"
import { createClient } from "next-sanity"

import {
  buildSitemapEntries,
  type SitemapDocument,
  type SitemapSourceNode,
} from "@lib/sitemap"
import { getAllServiceSlugs } from "@lib/strapi/services"
import { shopifyGraphql } from "@lib/shopify/client"

export const revalidate = 3600

const SHOPIFY_PAGE_SIZE = 250
const MAX_SHOPIFY_PAGES = 40

type ShopifySitemapConnection = {
  edges: Array<{
    node: SitemapSourceNode
  }>
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
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

async function getAllShopifyNodes(
  rootField: "products" | "collections",
  query: string
): Promise<SitemapSourceNode[]> {
  const nodes: SitemapSourceNode[] = []
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
): Promise<SitemapDocument[]> {
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
    const result = await client.fetch<SitemapDocument[] | null>(
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, cmsServices, localServiceSlugs, stories] = await Promise.all([
    getAllShopifyNodes("products", productSitemapQuery),
    getAllShopifyNodes("collections", collectionSitemapQuery),
    getSanitySitemapDocuments("service"),
    getAllServiceSlugs(),
    getSanitySitemapDocuments("blogPost"),
  ])
  return buildSitemapEntries({
    products,
    collections,
    cmsServices,
    localServiceSlugs,
    stories,
  })
}