import { shopifyGraphql } from "./client";
import { getProductQuery, getProductsQuery, getProductsByIdsQuery, getProductRecommendationsQuery } from "./queries/product";
import { getCollectionQuery, getCollectionsQuery } from "./queries/collection";
import { predictiveSearchQuery, searchProductsQuery } from "./queries/search";
import { cacheKey, getCached, TTL } from "@lib/cache/redis";

import {
  ShopifyProduct,
  ShopifyProductCard,
  ShopifyPageInfo,
  ShopifyCollection,
  ShopifyPredictiveSearchResult,
  ShopifySearchResult,
  ShopifyMoney
} from "./types";

export function formatPrice(money: ShopifyMoney): string {
  if (!money) return "";
  const amount = parseFloat(money.amount);
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: money.currencyCode,
  }).format(amount);
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const key = cacheKey("product", handle);

  return getCached(
    key,
    async () => {
      const { data, errors } = await shopifyGraphql<{
        product: Omit<ShopifyProduct, "metafields"> & { metafields?: Array<{ key: string, namespace: string, value: string } | null> };
      }>(getProductQuery, { handle });

      if (errors && errors.length > 0) {
        throw new Error(`Shopify API Error (getProduct): ${JSON.stringify(errors)}`);
      }

      if (!data?.product) {
        return null;
      }

      const metafields = data.product.metafields?.filter(Boolean) as ShopifyProduct["metafields"];

      return {
        ...data.product,
        metafields
      };
    },
    TTL.PRODUCT
  );
}

export async function getProducts(options: {
  first?: number;
  after?: string;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<{ products: ShopifyProductCard[]; pageInfo: ShopifyPageInfo }> {
  const key = cacheKey(
    "products",
    options.sortKey ?? "default",
    String(options.first ?? 12),
    options.query ?? "all"
  );

  return getCached(
    key,
    async () => {
      const { data, errors } = await shopifyGraphql<{
        products: {
          edges: { node: ShopifyProductCard }[];
          pageInfo: ShopifyPageInfo;
        };
      }>(getProductsQuery, {
        first: options.first || 20,
        after: options.after,
        query: options.query,
        sortKey: options.sortKey,
        reverse: options.reverse,
      });

      if (errors && errors.length > 0) {
        throw new Error(`Shopify API Error (getProducts): ${JSON.stringify(errors)}`);
      }

      return {
        products: data?.products?.edges.map((e) => e.node) || [],
        pageInfo: data?.products?.pageInfo || { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null },
      };
    },
    TTL.PRODUCT
  );
}

export async function getProductsByIds(ids: string[]): Promise<ShopifyProductCard[]> {
  if (!ids || ids.length === 0) return [];

  // Sort logically for consistent cache keys
  const sortedIds = [...ids].sort();
  const keyStr = sortedIds.join(",");
  const keyHash = Array.from(keyStr).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0).toString(16);
  const key = cacheKey("products-by-ids", keyHash);

  return getCached(
    key,
    async () => {
      const { data, errors } = await shopifyGraphql<{
        nodes: ShopifyProductCard[];
      }>(getProductsByIdsQuery, { ids: sortedIds });

      if (errors && errors.length > 0) {
        throw new Error(`Shopify API Error (getProductsByIds): ${JSON.stringify(errors)}`);
      }

      // Filter out nulls (if a product was deleted) and enforce original order
      const fetchedNodes = (data?.nodes || []).filter(Boolean);
      return ids
        .map(id => fetchedNodes.find(n => n.id === id))
        .filter(Boolean) as ShopifyProductCard[];
    },
    TTL.PRODUCT
  );
}

export async function getCollection(
  handle: string,
  options?: {
    first?: number;
    after?: string;
    filters?: any[];
    sortKey?: string;
    reverse?: boolean;
  }
): Promise<ShopifyCollection | null> {
  const key = cacheKey("collection", handle);

  return getCached(
    key,
    async () => {
      const { data, errors } = await shopifyGraphql<{ collection: ShopifyCollection }>(getCollectionQuery, {
        handle,
        first: options?.first || 20,
        after: options?.after,
        filters: options?.filters,
        sortKey: options?.sortKey,
        reverse: options?.reverse,
      });

      if (errors && errors.length > 0) {
        throw new Error(`Shopify API Error (getCollection): ${JSON.stringify(errors)}`);
      }

      return data?.collection || null;
    },
    TTL.COLLECTION
  );
}

export async function getCollectionProductsByHandle(
  handle: string,
  first: number = 4
): Promise<ShopifyProductCard[]> {
  const collection = await getCollection(handle, { first });
  
  if (!collection || !collection.products?.edges) {
    return [];
  }
  
  return collection.products.edges.map(edge => edge.node);
}

export async function getCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const key = cacheKey("collections", "all");

  return getCached(
    key,
    async () => {
      const { data, errors } = await shopifyGraphql<{
        collections: {
          edges: { node: ShopifyCollection }[];
        };
      }>(getCollectionsQuery, { first });

      if (errors && errors.length > 0) {
        throw new Error(`Shopify API Error (getCollections): ${JSON.stringify(errors)}`);
      }

      return data?.collections?.edges.map((e) => e.node) || [];
    },
    TTL.COLLECTIONS_LIST
  );
}

export async function getPredictiveSearch(query: string): Promise<ShopifyPredictiveSearchResult> {
  const { data, errors } = await shopifyGraphql<{
    predictiveSearch: ShopifyPredictiveSearchResult;
  }>(predictiveSearchQuery, { query });

  if (errors && errors.length > 0) {
    throw new Error(`Shopify API Error (getPredictiveSearch): ${JSON.stringify(errors)}`);
  }

  return data?.predictiveSearch || { products: [], collections: [], pages: [] };
}

export async function searchProducts(
  query: string,
  options?: {
    first?: number;
    after?: string;
    sortKey?: string;
  }
): Promise<{ products: ShopifyProductCard[]; pageInfo: ShopifyPageInfo; totalCount: number }> {
  const { data, errors } = await shopifyGraphql<{
    search: {
      edges: { node: ShopifyProductCard }[];
      pageInfo: ShopifyPageInfo;
      totalCount: number;
    };
  }>(searchProductsQuery, {
    query,
    first: options?.first || 20,
    after: options?.after,
    sortKey: options?.sortKey,
  });

  if (errors && errors.length > 0) {
    throw new Error(`Shopify API Error (searchProducts): ${JSON.stringify(errors)}`);
  }

  return {
    products: data?.search?.edges.map((e) => e.node) || [],
    pageInfo: data?.search?.pageInfo || { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null },
    totalCount: data?.search?.totalCount || 0,
  };
}

export async function getProductRecommendations(productId: string): Promise<ShopifyProductCard[]> {
  const { data, errors } = await shopifyGraphql<{
    productRecommendations: ShopifyProductCard[];
  }>(getProductRecommendationsQuery, { productId });

  if (errors && errors.length > 0) {
    throw new Error(`Shopify API Error (getProductRecommendations): ${JSON.stringify(errors)}`);
  }

  return data?.productRecommendations || [];
}
