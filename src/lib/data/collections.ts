import { shopifyGraphql } from "@lib/shopify/client";
import { getCollectionFiltersQuery, getCollectionWithFiltersQuery, getCollectionsQuery } from "@lib/shopify/queries/collection";
import { cacheKey, getCached, TTL } from "@lib/cache/redis";
import type {
  ShopifyFilter,
  ShopifyPageInfo,
  ShopifyCollection,
  ShopifyProductCard,
  ShopifyImage,
  ShopifyMoney,
  FilterState,
  ProductFilter,
  ProductCollectionSortKeys,
  ShopifyCollectionFaqItem,
  ShopifyCollectionSeoLanding,
  ShopifyMetafield,
} from "@lib/shopify/types";

const SEO_LANDING_NAMESPACE = "seo_landing"

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Fetch available filter options for the sidebar Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export async function getCollectionFilters(handle: string): Promise<ShopifyFilter[]> {
  const { data, errors } = await shopifyGraphql<{
    collection: {
      products: {
        filters: ShopifyFilter[];
      };
    };
  }>(getCollectionFiltersQuery, { handle });

  if (errors && errors.length > 0) {
    return [];
  }

  return data?.collection?.products?.filters || [];
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Fetch filtered + sorted products for collection page Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export async function getFilteredCollection(
  handle: string,
  options?: {
    filters?: ProductFilter[];
    sortKey?: ProductCollectionSortKeys;
    reverse?: boolean;
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<{
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: ShopifyImage | null;
    brandImageBanner?: ShopifyMetafield | null;
    metafields?: ShopifyMetafield[] | null;
    seoLanding?: ShopifyCollectionSeoLanding;
  };
  products: ShopifyProductCard[];
  filters: ShopifyFilter[];
  pageInfo: ShopifyPageInfo;
} | null> {
  const sortedFilters = (options?.filters ?? [])
    .map((filter) => sortObjectKeys(filter))
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))

  const key = cacheKey(
    "collection",
    "image-metafields-v1",
    handle,
    options?.sortKey ?? "default",
    String(options?.first ?? "null"),
    options?.after ?? "null",
    String(options?.last ?? "null"),
    options?.before ?? "null",
    JSON.stringify(sortedFilters)
  )

  return getCached(
    key,
    async () => {
      const { data, errors } = await shopifyGraphql<{
        collection: {
          id: string;
          title: string;
          handle: string;
          description: string;
          image: ShopifyImage | null;
          brandImageBanner?: ShopifyMetafield | null;
          metafields?: Array<ShopifyMetafield | null> | null;
          products: {
            filters: ShopifyFilter[];
            edges: { cursor: string; node: ShopifyProductCard }[];
            pageInfo: ShopifyPageInfo;
          };
        };
      }>(getCollectionWithFiltersQuery, {
        handle,
        filters: options?.filters || [],
        sortKey: options?.sortKey || "COLLECTION_DEFAULT",
        reverse: options?.reverse || false,
        first: options?.first,
        after: options?.after || null,
        last: options?.last,
        before: options?.before || null,
      });

      if (errors && errors.length > 0) {
      }

      if (!data?.collection) return null;

      const { products, ...collectionInfo } = data.collection;
      const metafields = collectionInfo.metafields?.filter(
        (field): field is ShopifyMetafield => Boolean(field)
      ) ?? [];

      return {
        collection: {
          ...collectionInfo,
          metafields,
          seoLanding: normalizeCollectionSeoLanding(metafields),
        },
        products: products.edges.map((e) => e.node),
        filters: products.filters || [],
        pageInfo: products.pageInfo,
      };
    },
    TTL.COLLECTION
  )
}

export function normalizeCollectionSeoLanding(
  metafields?: Array<ShopifyMetafield | null> | null
): ShopifyCollectionSeoLanding {
  const fields = new Map<string, ShopifyMetafield>()

  metafields?.forEach((field) => {
    if (field?.namespace === SEO_LANDING_NAMESPACE && field.key) {
      fields.set(field.key, field)
    }
  })

  return {
    introHeading: textField(fields.get("intro_heading")),
    introBody: textField(fields.get("intro_body")),
    buyingGuideHeading: textField(fields.get("buying_guide_heading")),
    buyingGuideBody: textField(fields.get("buying_guide_body")),
    fitmentHeading: textField(fields.get("fitment_heading")),
    fitmentBody: textField(fields.get("fitment_body")),
    bottomContent: textField(fields.get("bottom_content")),
    relatedCollectionHandles: handleListField(
      fields.get("related_collection_handles")
    ),
    faqItems: faqItemsField(fields.get("faq_items")),
  }
}

function textField(field?: ShopifyMetafield): string | undefined {
  const value = extractMetafieldText(field?.value)
  return value || undefined
}

function extractMetafieldText(value?: string | null): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    return ""
  }

  const parsed = parseJson(trimmed)
  if (parsed) {
    const richText = extractRichText(parsed).trim()
    if (richText) {
      return richText
    }
  }

  return trimmed
}

function handleListField(field?: ShopifyMetafield): string[] {
  const value = field?.value?.trim()
  if (!value) {
    return []
  }

  const parsed = parseJson(value)
  const rawItems = Array.isArray(parsed)
    ? parsed
    : value.split(/[\n,]/).map((item) => item.trim())

  return Array.from(
    new Set(
      rawItems
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().toLowerCase())
        .filter((item) => /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(item))
    )
  )
}

function faqItemsField(field?: ShopifyMetafield): ShopifyCollectionFaqItem[] {
  const parsed = parseJson(field?.value)
  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null
      }

      const question = extractMetafieldText(
        String((item as Record<string, unknown>).question ?? "")
      )
      const answer = extractMetafieldText(
        String((item as Record<string, unknown>).answer ?? "")
      )

      return question && answer ? { question, answer } : null
    })
    .filter((item): item is ShopifyCollectionFaqItem => Boolean(item))
}

function parseJson(value?: string | null): unknown | null {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function extractRichText(node: unknown): string {
  if (typeof node === "string") {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(extractRichText).filter(Boolean).join("\n\n")
  }

  if (!node || typeof node !== "object") {
    return ""
  }

  const record = node as Record<string, unknown>

  if (typeof record.value === "string") {
    return record.value
  }

  if (typeof record.text === "string") {
    return record.text
  }

  if (Array.isArray(record.children)) {
    return record.children.map(extractRichText).filter(Boolean).join(" ")
  }

  return ""
}

function sortObjectKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sortObjectKeys(item)) as T
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObjectKeys((value as Record<string, unknown>)[key])
        return acc
      }, {}) as T
  }

  return value
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Build ProductFilter[] from FilterState Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export function buildShopifyFilters(state: FilterState): ProductFilter[] {
  const filters: ProductFilter[] = [];

  if (state.priceRange) {
    filters.push({ price: { min: state.priceRange.min, max: state.priceRange.max } });
  }

  if (state.available) {
    filters.push({ available: true });
  }

  state.vendors.forEach((v) => filters.push({ productVendor: v }));
  state.productTypes.forEach((t) => filters.push({ productType: t }));
  state.tags.forEach((tag) => filters.push({ tag }));
  state.variantOptions.forEach((opt) =>
    filters.push({ variantOption: { name: opt.name, value: opt.value } })
  );

  return filters;
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Backward-compatible exports Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

import { getCollection, getCollections } from "@lib/shopify";

export const getCollectionByHandle = async (handle?: string) => {
  if (!handle) return null;
  try {
    return await getCollection(handle);
  } catch {
    return null;
  }
};

export const listCollections = async (opts?: any) => {
  try {
    const collections = await getCollections(opts?.limit || 20);
    return { collections };
  } catch {
    return { collections: [] };
  }
};

export const getProductsByCollectionHandle = async (_handle?: string, _limit?: number, _regionId?: string) => [] as any[];
export const getNewArrivals = async (_limit?: number, _regionId?: string) => [] as any[];
