import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCollectionFilters,
  getFilteredCollection,
  buildShopifyFilters,
} from "@lib/data/collections";
import { parseSearchParams } from "@lib/util/filterParams";
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

  // Parse filter state from URL
  const filterState = parseSearchParams(urlParams);

  // Build Shopify ProductFilter[] from our clean state
  const shopifyFilters = buildShopifyFilters(filterState);

  // Fetch filtered products from the frontpage collection
  const result = await getFilteredCollection(STORE_COLLECTION_HANDLE, {
    filters: shopifyFilters,
    sortKey: filterState.sortKey,
    reverse: filterState.reverse,
    first: 24,
    after: urlParams.get("after") || undefined,
  });

  if (!result) {
    console.error("StorePage: getFilteredCollection returned null for handle:", STORE_COLLECTION_HANDLE);
    console.error("StorePage: Filters used:", JSON.stringify(shopifyFilters));
    console.error("StorePage: Sorting used:", filterState.sortKey, filterState.reverse);
    notFound();
  }

  // Fetch sidebar filters (unfiltered to show all available options)
  const sidebarFilters = await getCollectionFilters(STORE_COLLECTION_HANDLE);

  // Override collection title to "Shop" for the store page
  const storeCollection = {
    ...result.collection,
    title: "Shop",
    description: "Explore all of our products.",
  };

  return (
    <CollectionTemplate
      collection={storeCollection}
      products={result.products}
      filters={result.filters}
      sidebarFilters={sidebarFilters}
      pageInfo={result.pageInfo}
      initialFilterState={filterState}
      countryCode={params.countryCode}
    />
  );
}
