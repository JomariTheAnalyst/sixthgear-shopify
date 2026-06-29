import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCollectionFilters,
  getFilteredCollection,
  buildShopifyFilters,
  listCollections,
} from "@lib/data/collections";
import { getCollectionProductsByHandle } from "@lib/shopify";
import type { ShopifyProductCard } from "@lib/shopify/types";
import { searchProducts } from "@lib/data/search";
import { parseSearchParams } from "@lib/util/filterParams";
import {
  getBreadcrumbStructuredData,
  getLocalizedCanonicalPath,
  getNoindexFollowRobots,
  hasNonCanonicalSearchParams,
} from "@lib/seo";
import CollectionHero from "@modules/collections/components/CollectionHero";
import CollectionTemplate from "@modules/collections/templates";
import JsonLd from "@modules/common/components/json-ld";

export const dynamic = "force-dynamic";

// The store page uses the "frontpage" collection as the "all products" view.
// Shopify filters only work inside collection.products() queries,
// so we must route through a collection handle.
const STORE_COLLECTION_HANDLE = "all-products";
const FIRST_GEAR_COLLECTION_HANDLE = "first-gear-coffee";
const BRAND_COLLECTION_HANDLE_PREFIX = "brand-";
const FIRST_GEAR_FILTER_LABELS = new Set([
  "first gear coffee",
  "coffee drinks",
  "non-coffee drinks",
  "snacks",
]);
const PAGE_SIZE = 24;

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

function isFirstGearCollection(handle?: string | null) {
  return handle?.trim().toLowerCase() === FIRST_GEAR_COLLECTION_HANDLE;
}

function isBrandCollection(handle?: string | null) {
  return (
    handle?.trim().toLowerCase().startsWith(BRAND_COLLECTION_HANDLE_PREFIX) ??
    false
  );
}

function normalizeFilterLabel(label?: string | null) {
  return label?.trim().toLowerCase() || "";
}

function mapStoreCollection(collection: any) {
  return {
    handle: collection.handle,
    title: collection.title,
  };
}

function filterStoreCollections(collections: any[]) {
  return collections
    .filter(
      (collection: any) =>
        !isFirstGearCollection(collection.handle) &&
        !isBrandCollection(collection.handle)
    )
    .map(mapStoreCollection);
}

function filterStoreBrandCollections(collections: any[]) {
  return collections
    .filter(
      (collection: any) =>
        !isFirstGearCollection(collection.handle) &&
        isBrandCollection(collection.handle)
    )
    .map(mapStoreCollection);
}

function isVendorFilter(
  filter: Awaited<ReturnType<typeof getCollectionFilters>>[number]
) {
  const id = normalizeFilterLabel(filter.id);
  const label = normalizeFilterLabel(filter.label);

  return (
    label === "vendor" ||
    label === "brand" ||
    id.includes("productvendor") ||
    id.includes("vendor")
  );
}

function filterStoreSidebarFilters(filters: Awaited<ReturnType<typeof getCollectionFilters>>) {
  return filters
    .filter((filter) => !isVendorFilter(filter))
    .map((filter) => ({
      ...filter,
      values: filter.values.filter(
        (value) => !FIRST_GEAR_FILTER_LABELS.has(normalizeFilterLabel(value.label))
      ),
    }))
    .filter((filter) => filter.values.length > 0);
}

function filterFirstGearProducts(
  products: ShopifyProductCard[],
  blockedProductIds: Set<string>
) {
  return products.filter((product) => !blockedProductIds.has(product.id));
}

function getStoreProductFilters(filterState: ReturnType<typeof parseSearchParams>) {
  const filters = buildShopifyFilters(filterState);

  if (filterState.showSoldOut) {
    return filters;
  }

  const alreadyFiltersAvailability = filters.some(
    (filter) => filter.available === true
  );

  return alreadyFiltersAvailability ? filters : [...filters, { available: true }];
}

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ countryCode: string }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { countryCode } = await props.params;
  const searchParams = await props.searchParams;
  const shouldNoindex = hasNonCanonicalSearchParams(searchParams, {
    allowPaginationParams: true,
  });

  return {
    title: "Shop",
    description:
      "Browse helmets, apparel, accessories, and motorcycle parts from SixthgearMoto.",
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/store"),
    },
    ...(shouldNoindex ? { robots: getNoindexFollowRobots() } : {}),
  };
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const rawSearchParams = await props.searchParams;
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    params.countryCode,
    [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/store" },
    ]
  );

  const urlParams = new URLSearchParams();
  Object.entries(rawSearchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlParams.append(key, v));
    } else if (value !== undefined) {
      urlParams.append(key, value);
    }
  });

  const searchQuery = urlParams.get("query")?.trim() || "";
  const filterState = parseSearchParams(urlParams);
  const selectedCollectionHandle =
    filterState.collection?.trim() || STORE_COLLECTION_HANDLE;

  if (isFirstGearCollection(selectedCollectionHandle)) {
    notFound();
  }

  const shopifyFilters = getStoreProductFilters(filterState);
  const afterCursor = urlParams.get("after") || undefined;
  const beforeCursor = urlParams.get("before") || undefined;
  const firstGearProducts = await getCollectionProductsByHandle(
    FIRST_GEAR_COLLECTION_HANDLE,
    250
  );
  const firstGearProductIds = new Set(
    firstGearProducts.map((product) => product.id)
  );

  if (searchQuery) {
    const searchSort = mapSearchSort(filterState.sortKey);

    const [searchResult, sidebarFilters, { collections }] =
      await Promise.all([
        searchProducts(searchQuery, {
          first: beforeCursor ? undefined : PAGE_SIZE,
          after: beforeCursor ? undefined : afterCursor,
          last: beforeCursor ? PAGE_SIZE : undefined,
          before: beforeCursor,
          sortKey: searchSort.sortKey,
        }),
        getCollectionFilters(selectedCollectionHandle),
        listCollections({ limit: 100 }),
      ]);

    const searchProductsForView = searchSort.reverse
      ? [...searchResult.products].reverse()
      : searchResult.products;

    const collectionsMenu = filterStoreCollections(collections);
    const brandCollectionsMenu = filterStoreBrandCollections(collections);
    const sidebarFiltersForView = filterStoreSidebarFilters(sidebarFilters);
    const searchProductsWithoutCoffee = filterFirstGearProducts(
      searchProductsForView,
      firstGearProductIds
    );

    const searchCollection = {
      id: "search-results",
      handle: "search-results",
      title: `Results for "${searchQuery}"`,
      description: `${searchResult.totalCount} product${searchResult.totalCount !== 1 ? "s" : ""} found`,
    };

    return (
      <>
        <JsonLd id="store-breadcrumbs" data={breadcrumbStructuredData} />
        <CollectionHero
          title={searchCollection.title}
          description={searchCollection.description}
          backgroundImageUrl={null}
        />
        <CollectionTemplate
          collection={searchCollection}
          products={searchProductsWithoutCoffee}
          filters={[]}
          sidebarFilters={sidebarFiltersForView}
          pageInfo={searchResult.pageInfo}
          initialFilterState={filterState}
          countryCode={params.countryCode}
          collectionsMenu={collectionsMenu}
          brandCollectionsMenu={brandCollectionsMenu}
          showSoldOutToggle={false}
        />
      </>
    );
  }

  const [result, sidebarFilters, { collections }] = await Promise.all([
    getFilteredCollection(selectedCollectionHandle, {
      filters: shopifyFilters,
      sortKey: filterState.sortKey,
      reverse: filterState.reverse,
      first: beforeCursor ? undefined : PAGE_SIZE,
      after: beforeCursor ? undefined : afterCursor,
      last: beforeCursor ? PAGE_SIZE : undefined,
      before: beforeCursor,
    }),
    getCollectionFilters(selectedCollectionHandle),
    listCollections({ limit: 100 }),
  ]);

  if (!result) {
    notFound();
  }

  const collectionsMenu = filterStoreCollections(collections);
  const brandCollectionsMenu = filterStoreBrandCollections(collections);
  const sidebarFiltersForView = filterStoreSidebarFilters(sidebarFilters);
  const filtersForView = filterStoreSidebarFilters(result.filters);
  const productsForView = filterFirstGearProducts(
    result.products,
    firstGearProductIds
  );

  const storeCollection =
    selectedCollectionHandle === STORE_COLLECTION_HANDLE
      ? {
          ...result.collection,
          title: "Shop",
          description: "Explore all of our products.",
        }
      : result.collection;

  return (
    <>
      <JsonLd id="store-breadcrumbs" data={breadcrumbStructuredData} />
      <CollectionHero
        title={result.collection.title}
        description={result.collection.description}
        backgroundImageUrl={result.collection.image?.url ?? null}
      />
      <CollectionTemplate
        collection={storeCollection}
        products={productsForView}
        filters={filtersForView}
        sidebarFilters={sidebarFiltersForView}
        pageInfo={result.pageInfo}
        initialFilterState={filterState}
        countryCode={params.countryCode}
        collectionsMenu={collectionsMenu}
        brandCollectionsMenu={brandCollectionsMenu}
        showSoldOutToggle
      />
    </>
  );
}
