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
} from "@lib/shopify/types";

// ─── Fetch available filter options for the sidebar ───────────────────────────

export async function getCollectionFilters(handle: string): Promise<ShopifyFilter[]> {
  const { data, errors } = await shopifyGraphql<{
    collection: {
      products: {
        filters: ShopifyFilter[];
      };
    };
  }>(getCollectionFiltersQuery, { handle });

  if (errors && errors.length > 0) {
    console.error("Shopify API Error (getCollectionFilters):", errors);
    return [];
  }

  return data?.collection?.products?.filters || [];
}

// ─── Fetch filtered + sorted products for collection page ─────────────────────

export async function getFilteredCollection(
  handle: string,
  options?: {
    filters?: ProductFilter[];
    sortKey?: ProductCollectionSortKeys;
    reverse?: boolean;
    first?: number;
    after?: string;
  }
): Promise<{
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: ShopifyImage | null;
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
    handle,
    options?.sortKey ?? "default",
    String(options?.first ?? 24),
    options?.after ?? "page-1",
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
        first: options?.first || 24,
        after: options?.after || null,
      });

      if (errors && errors.length > 0) {
        console.error("Shopify API Error (getFilteredCollection):", errors);
      }

      if (!data?.collection) return null;

      const { products, ...collectionInfo } = data.collection;

      return {
        collection: collectionInfo,
        products: products.edges.map((e) => e.node),
        filters: products.filters || [],
        pageInfo: products.pageInfo,
      };
    },
    TTL.COLLECTION
  )
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

// ─── Build ProductFilter[] from FilterState ───────────────────────────────────

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

// ─── Backward-compatible exports ──────────────────────────────────────────────

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
