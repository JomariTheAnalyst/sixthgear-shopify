import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCollectionFilters,
  getFilteredCollection,
  buildShopifyFilters,
  listCollections,
} from "@lib/data/collections";
import { parseSearchParams, getDefaultFilterState } from "@lib/util/filterParams";
import JsonLd from "@modules/common/components/json-ld";
import {
  getBreadcrumbStructuredData,
  getLocalizedCanonicalPath,
} from "@lib/seo";
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
    title: result.collection.title,
    description:
      result.collection.description ||
      `${result.collection.title} collection`,
    alternates: {
      canonical: getLocalizedCanonicalPath(
        params.countryCode,
        `/collections/${params.handle}`
      ),
    },
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

  // Parallel fetches: Shopify filtered products, sidebar filters, collections menu
  const [result, sidebarFilters, { collections }] = await Promise.all([
    getFilteredCollection(params.handle, {
      filters: shopifyFilters,
      sortKey: filterState.sortKey,
      reverse: filterState.reverse,
      first: 24,
      after: urlParams.get("after") || undefined,
    }),
    getCollectionFilters(params.handle),
    listCollections({ limit: 100 }),
  ]);

  if (!result) notFound();
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    params.countryCode,
    [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/store" },
      {
        name: result.collection.title,
        path: `/collections/${params.handle}`,
      },
    ]
  );

  const collectionsMenu = collections.map((c: any) => ({
    handle: c.handle,
    title: c.title,
  }));

  return (
    <>
      <JsonLd id="collection-breadcrumbs" data={breadcrumbStructuredData} />
      <CollectionTemplate
        collection={result.collection}
        products={result.products}
        filters={result.filters}
        sidebarFilters={sidebarFilters}
        pageInfo={result.pageInfo}
        initialFilterState={filterState}
        countryCode={params.countryCode}
        collectionsMenu={collectionsMenu}
        heroTitle={result.collection.title}
        heroDescription={result.collection.description}
        heroImageUrl={result.collection.image?.url ?? null}
      />
    </>
  );
}
