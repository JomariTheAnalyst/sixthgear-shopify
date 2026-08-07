import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCollectionFilters,
  getFilteredCollection,
  buildShopifyFilters,
  listCollections,
} from "@lib/data/collections";
import { getCollection } from "@lib/shopify";
import { resolveShopifyImageMetafield } from "@lib/shopify/collection-images";
import { parseSearchParams } from "@lib/util/filterParams";
import JsonLd from "@modules/common/components/json-ld";
import {
  getAbsoluteSiteUrl,
  getBreadcrumbStructuredData,
  getCollectionItemListStructuredData,
  getFaqStructuredData,
  getLocalizedCanonicalPath,
  getMetadataImageUrl,
  getNoindexFollowRobots,
  getSiteName,
  hasNonCanonicalSearchParams,
} from "@lib/seo";
import CollectionHero from "@modules/collections/components/CollectionHero";
import CollectionSeoContent from "@modules/collections/components/CollectionSeoContent";
import CollectionTemplate from "@modules/collections/templates";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ handle: string; countryCode: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const shouldNoindex = hasNonCanonicalSearchParams(searchParams, {
    allowPaginationParams: true,
  });

  const collection = await getCollection(params.handle, { first: 0 });

  if (!collection) notFound();

  const title =
    params.handle === "helmet"
      ? "Helmets"
      : collection.seo?.title?.trim() || collection.title;
  const description =
    collection.seo?.description?.trim() ||
    collection.description ||
    `${collection.title} collection`;
  const canonicalPath = `/collections/${params.handle}`;
  const canonicalUrl = getAbsoluteSiteUrl(params.countryCode, canonicalPath);
  const imageUrl = getMetadataImageUrl(collection.image?.url);

  return {
    title: params.handle === "helmet" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: getLocalizedCanonicalPath(params.countryCode, canonicalPath),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: getSiteName(),
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    ...(shouldNoindex ? { robots: getNoindexFollowRobots() } : {}),
  };
}

export default async function CollectionPage(props: Props) {
  const params = await props.params;
  const rawSearchParams = await props.searchParams;

  const urlParams = new URLSearchParams();
  Object.entries(rawSearchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlParams.append(key, v));
    } else if (value !== undefined) {
      urlParams.append(key, value);
    }
  });

  const filterState = parseSearchParams(urlParams);
  const shopifyFilters = buildShopifyFilters(filterState);
  const afterCursor = urlParams.get("after") || undefined;
  const beforeCursor = urlParams.get("before") || undefined;

  const [result, sidebarFilters, { collections }] = await Promise.all([
    getFilteredCollection(params.handle, {
      filters: shopifyFilters,
      sortKey: filterState.sortKey,
      reverse: filterState.reverse,
      first: beforeCursor ? undefined : 24,
      after: beforeCursor ? undefined : afterCursor,
      last: beforeCursor ? 24 : undefined,
      before: beforeCursor,
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
        name:
          params.handle === "helmet" ? "Helmets" : result.collection.title,
        path: `/collections/${params.handle}`,
      },
    ]
  );

  const collectionsMenu = collections.map((c: any) => ({
    handle: c.handle,
    title: c.title,
  }));
  const seoLanding = result.collection.seoLanding;
  const relatedCollectionHandleSet = new Set(
    seoLanding?.relatedCollectionHandles ?? []
  );
  const relatedCollections = collectionsMenu.filter((collection) =>
    relatedCollectionHandleSet.has(collection.handle)
  );
  const serviceLinks =
    params.handle === "akrapovic-exhaust"
      ? [
          {
            href: "/services/accessories-installation",
            label: "Akrapovic exhaust installation Makati",
            description:
              "Confirm fitment and installation support at the SixthGearMoto Makati service center.",
          },
        ]
      : [];
  const itemListStructuredData =
    result.products.length > 0
      ? getCollectionItemListStructuredData(
          params.countryCode,
          `/collections/${params.handle}`,
          result.products
        )
      : null;
  const faqStructuredData =
    seoLanding?.faqItems && seoLanding.faqItems.length > 0
      ? getFaqStructuredData(seoLanding.faqItems)
      : null;
  const heroImage =
    resolveShopifyImageMetafield(result.collection.brandImageBanner) ??
    result.collection.image;

  return (
    <>
      <JsonLd id="collection-breadcrumbs" data={breadcrumbStructuredData} />
      {itemListStructuredData && (
        <JsonLd id="collection-item-list" data={itemListStructuredData} />
      )}
      {faqStructuredData && (
        <JsonLd id="collection-faq" data={faqStructuredData} />
      )}
      <CollectionHero
        title={result.collection.title}
        description={result.collection.description}
        backgroundImageUrl={heroImage?.url ?? null}
      />
      <CollectionSeoContent
        countryCode={params.countryCode}
        seoLanding={seoLanding}
        placement="primary"
      />
      <CollectionTemplate
        collection={result.collection}
        products={result.products}
        filters={result.filters}
        sidebarFilters={sidebarFilters}
        pageInfo={result.pageInfo}
        initialFilterState={filterState}
        countryCode={params.countryCode}
        collectionsMenu={collectionsMenu}
      />
      <CollectionSeoContent
        countryCode={params.countryCode}
        seoLanding={seoLanding}
        relatedCollections={relatedCollections}
        serviceLinks={serviceLinks}
        placement="secondary"
      />
    </>
  );
}
