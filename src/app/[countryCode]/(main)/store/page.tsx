import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCollectionFilters,
  getFilteredCollection,
  buildShopifyFilters,
  listCollections,
} from "@lib/data/collections";
import { searchProducts } from "@lib/data/search";
import { parseSearchParams } from "@lib/util/filterParams";
import { getCollectionHero } from "@lib/cms/client";
import CollectionTemplate from "@modules/collections/templates";

export const metadata: Metadata = {
  title: "Shop | Sixthgear Moto",
  description: "Explore all of our products.",
};

export const dynamic = "force-dynamic";

// The store page uses the "frontpage" collection as the "all products" view.
// Shopify filters only work inside collection.products() queries,
// so we must route through a collection handle.
const STORE_COLLECTION_HANDLE = "all-products";

function mapSearchSort(
  sortKey: string | undefined
): { sortKey: "RELEVANCE" | "PRICE"; reverse: boolean } {
  switch (sortKey) {
    case "PRICE_ASC":
      return { sortKey: "PRICE", reverse: false };
    case "PRICE_DESC":
      return { sortKey: "PRICE", reverse: true };
    case "RELEVANCE":
      return { sortKey: "RELEVANCE", reverse: false };
    case "COLLECTION_DEFAULT":
    case "CREATED_AT":
    case "TITLE_ASC":
    case "TITLE_DESC":
    default:
      return { sortKey: "RELEVANCE", reverse: false };
  }
}

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ countryCode: string }>;
};

export default async function StorePage(props: Params) {
  const params = await props.params;
  const rawSearchParams = await props.searchParams;

  // Convert raw searchParams to URLSearchParams
  const urlParams = new URLSearchParams();
  Object.entries(rawSearchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlParams.append(key, v));
    } else if (value !== undefined) {
      urlParams.append(key, value);
    }
  });

  // Detect search mode
  const searchQuery = urlParams.get("query")?.trim() || "";

  // Parse filter state from URL
  const filterState = parseSearchParams(urlParams);
  const selectedCollectionHandle =
    filterState.collection?.trim() || STORE_COLLECTION_HANDLE;

  // Build Shopify ProductFilter[] from our clean state
  const shopifyFilters = buildShopifyFilters(filterState);

  // --- SEARCH MODE ---
  if (searchQuery) {
    const searchSort = mapSearchSort(filterState.sortKey);
    const [searchResult, sidebarFilters, { collections }, storeHero] =
      await Promise.all([
        searchProducts(searchQuery, {
          first: 24,
          sortKey: searchSort.sortKey,
        }),
        getCollectionFilters(selectedCollectionHandle),
        listCollections({ limit: 100 }),
        getCollectionHero(selectedCollectionHandle),
      ]);

    const searchProductsForView = searchSort.reverse
      ? [...searchResult.products].reverse()
      : searchResult.products;

    const collectionsMenu = collections.map((c: any) => ({
      handle: c.handle,
      title: c.title,
    }));

    const searchCollection = {
      id: "search-results",
      handle: "search-results",
      title: `Results for "${searchQuery}"`,
      description: `${searchResult.totalCount} product${searchResult.totalCount !== 1 ? "s" : ""} found`,
    };

    return (
      <CollectionTemplate
        collection={searchCollection}
        products={searchProductsForView}
        filters={[]}
        sidebarFilters={sidebarFilters}
        pageInfo={searchResult.pageInfo}
        initialFilterState={filterState}
        countryCode={params.countryCode}
        collectionsMenu={collectionsMenu}
        heroData={storeHero}
      />
    );
  }

  // --- BROWSE MODE (existing logic) ---
  const [result, sidebarFilters, { collections }, storeHero] = await Promise.all([
    getFilteredCollection(selectedCollectionHandle, {
      filters: shopifyFilters,
      sortKey: filterState.sortKey,
      reverse: filterState.reverse,
      first: 24,
      after: urlParams.get("after") || undefined,
    }),
    getCollectionFilters(selectedCollectionHandle),
    listCollections({ limit: 100 }),
    getCollectionHero(selectedCollectionHandle),
  ]);

  if (!result) {
    console.error("StorePage: getFilteredCollection returned null for handle:", selectedCollectionHandle);
    console.error("StorePage: Filters used:", JSON.stringify(shopifyFilters));
    console.error("StorePage: Sorting used:", filterState.sortKey, filterState.reverse);
    notFound();
  }

  const collectionsMenu = collections.map((c: any) => ({
    handle: c.handle,
    title: c.title,
  }));

  // Override collection title to "Shop" for the store page
  const storeCollection =
    selectedCollectionHandle === STORE_COLLECTION_HANDLE
      ? {
          ...result.collection,
          title: "Shop",
          description: "Explore all of our products.",
        }
      : result.collection;

  return (
    <CollectionTemplate
      collection={storeCollection}
      products={result.products}
      filters={result.filters}
      sidebarFilters={sidebarFilters}
      pageInfo={result.pageInfo}
      initialFilterState={filterState}
      countryCode={params.countryCode}
      collectionsMenu={collectionsMenu}
      heroData={storeHero}
    />
  );
}
