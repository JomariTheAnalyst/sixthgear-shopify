import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCollectionFilters,
  getFilteredCollection,
  buildShopifyFilters,
  listCollections,
} from "@lib/data/collections";
import { getCollectionHero } from "@lib/cms/client";
import { parseSearchParams, getDefaultFilterState } from "@lib/util/filterParams";
import CollectionTemplate from "@modules/collections/templates";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ handle: string; countryCode: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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

  // Parallel fetches: Shopify filtered products, sidebar filters, collections menu, CMS hero
  const [result, sidebarFilters, { collections }, collectionHero] = await Promise.all([
    getFilteredCollection(params.handle, {
      filters: shopifyFilters,
      sortKey: filterState.sortKey,
      reverse: filterState.reverse,
      first: 24,
      after: urlParams.get("after") || undefined,
    }),
    getCollectionFilters(params.handle),
    listCollections({ limit: 100 }),
    getCollectionHero(params.handle),
  ]);

  if (!result) notFound();

  const collectionsMenu = collections.map((c: any) => ({
    handle: c.handle,
    title: c.title,
  }));

  return (
    <CollectionTemplate
      collection={result.collection}
      products={result.products}
      filters={result.filters}
      sidebarFilters={sidebarFilters}
      pageInfo={result.pageInfo}
      initialFilterState={filterState}
      countryCode={params.countryCode}
      collectionsMenu={collectionsMenu}
      heroData={collectionHero}
    />
  );
}
