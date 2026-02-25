import { shopifyGraphql } from "./client";
import { getProductQuery, getProductsQuery, getProductRecommendationsQuery } from "./queries/product";
import { getCollectionQuery, getCollectionsQuery } from "./queries/collection";
import { predictiveSearchQuery, searchProductsQuery } from "./queries/search";

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
}

export async function getProducts(options: {
  first?: number;
  after?: string;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<{ products: ShopifyProductCard[]; pageInfo: ShopifyPageInfo }> {
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
}

export async function getCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const { data, errors } = await shopifyGraphql<{
    collections: {
      edges: { node: ShopifyCollection }[];
    };
  }>(getCollectionsQuery, { first });

  if (errors && errors.length > 0) {
    throw new Error(`Shopify API Error (getCollections): ${JSON.stringify(errors)}`);
  }

  return data?.collections?.edges.map((e) => e.node) || [];
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
