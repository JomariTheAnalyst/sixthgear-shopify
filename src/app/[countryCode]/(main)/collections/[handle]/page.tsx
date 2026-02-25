import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCollections } from "@lib/shopify";
import {
  getCollectionFilters,
  getFilteredCollection,
  buildShopifyFilters,
} from "@lib/data/collections";
import { parseSearchParams, getDefaultFilterState } from "@lib/util/filterParams";
import CollectionTemplate from "@modules/collections/templates";

export const revalidate = 60;

type Props = {
  params: Promise<{ handle: string; countryCode: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  try {
    const collections = await getCollections(50);
    return collections.map((c) => ({ handle: c.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const result = await getFilteredCollection(params.handle, { first: 0 });

  if (!result) notFound();

  return {
    title: `${result.collection.title} | Sixthgear Moto`,
    description:
      result.collection.description ||
      `${result.collection.title} collection`,
  };
}

export default async function CollectionPage(props: Props) {
  const params = await props.params;
  const rawSearchParams = await props.searchParams;

  // Convert raw searchParams object to URLSearchParams
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

  // Fetch filtered products
  const result = await getFilteredCollection(params.handle, {
    filters: shopifyFilters,
    sortKey: filterState.sortKey,
    reverse: filterState.reverse,
    first: 24,
    after: urlParams.get("after") || undefined,
  });

  if (!result) notFound();

  // Fetch sidebar filters (unfiltered to show all options)
  const sidebarFilters = await getCollectionFilters(params.handle);

  return (
    <CollectionTemplate
      collection={result.collection}
      products={result.products}
      filters={result.filters}
      sidebarFilters={sidebarFilters}
      pageInfo={result.pageInfo}
      initialFilterState={filterState}
      countryCode={params.countryCode}
    />
  );
}
