"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type {
  ShopifyFilter,
  ShopifyPageInfo,
  ShopifyProductCard,
  FilterState,
  ProductCollectionSortKeys,
} from "@lib/shopify/types";
import { serializeFilterState } from "@lib/util/filterParams";
import FilterSidebar from "@modules/collections/components/FilterSidebar";
import SortSelector from "@modules/collections/components/SortSelector";
import ActiveFilterPills from "@modules/collections/components/ActiveFilterPills";
import ProductCard from "@modules/home/components/product-sections/product-card";

type CollectionTemplateProps = {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
  };
  products: ShopifyProductCard[];
  filters: ShopifyFilter[];
  sidebarFilters: ShopifyFilter[];
  pageInfo: ShopifyPageInfo;
  initialFilterState: FilterState;
  countryCode: string;
};

function mapShopifyCardToMedusa(p: ShopifyProductCard) {
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.featuredImage?.url,
    images: p.featuredImage ? [{ url: p.featuredImage.url }] : [],
    collection: { title: p.vendor },
    variants: [
      {
        id: p.id,
        allow_backorder: false,
        manage_inventory: true,
        inventory_quantity: p.availableForSale ? 10 : 0,
        calculated_price: {
          calculated_amount: p.priceRange?.minVariantPrice
            ? parseFloat(p.priceRange.minVariantPrice.amount)
            : null,
          original_amount: p.compareAtPriceRange?.minVariantPrice
            ? parseFloat(p.compareAtPriceRange.minVariantPrice.amount)
            : null,
          currency_code:
            p.priceRange?.minVariantPrice?.currencyCode || "PHP",
        },
      },
    ],
  } as any;
}

export default function CollectionTemplate({
  collection,
  products,
  filters,
  sidebarFilters,
  pageInfo,
  initialFilterState,
  countryCode,
}: CollectionTemplateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const applyFilters = useCallback(
    (nextState: FilterState) => {
      setFilterState(nextState);
      const params = serializeFilterState(nextState);
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    },
    [router, pathname]
  );

  const handleSortChange = useCallback(
    (sortKey: ProductCollectionSortKeys, reverse: boolean) => {
      applyFilters({ ...filterState, sortKey, reverse });
    },
    [filterState, applyFilters]
  );

  const activeFilterCount =
    filterState.vendors.length +
    filterState.productTypes.length +
    filterState.tags.length +
    filterState.variantOptions.length +
    (filterState.priceRange ? 1 : 0) +
    (filterState.available ? 1 : 0);

  // Stub region for ProductCard compatibility
  const region = { id: "ph", currency_code: "php" } as any;

  return (
    <div className="bg-white pt-28">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
        {/* Collection Header */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight"
            style={{ fontFamily: "BRHendrix, sans-serif" }}
          >
            {collection.title}
          </h1>
          {collection.description && (
            <p className="mt-2 text-gray-600 text-sm md:text-base max-w-2xl">
              {collection.description}
            </p>
          )}
        </div>

        {/* Toolbar: Sort + Mobile Filter Toggle + Product Count */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* Mobile filter button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:border-gray-900 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-gray-900 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-sm text-gray-500">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </span>
          </div>

          <SortSelector
            currentSortKey={filterState.sortKey}
            currentReverse={filterState.reverse}
            onChange={handleSortChange}
          />
        </div>

        {/* Active Filter Pills */}
        <ActiveFilterPills activeState={filterState} onRemove={applyFilters} />

        {/* Main Layout: Sidebar + Product Grid */}
        <div className="flex gap-0 lg:gap-0">
          <FilterSidebar
            filters={sidebarFilters}
            activeState={filterState}
            onChange={applyFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={mapShopifyCardToMedusa(product)}
                      region={region}
                    />
                  ))}
                </div>

                {/* Load More */}
                {pageInfo.hasNextPage && pageInfo.endCursor && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={() => {
                        const params = serializeFilterState(filterState);
                        params.set("after", pageInfo.endCursor!);
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                      className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold uppercase text-sm tracking-wider hover:bg-gray-900 hover:text-white transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your filters to find what you&apos;re looking
                  for.
                </p>
                <button
                  onClick={() =>
                    applyFilters({
                      ...filterState,
                      vendors: [],
                      productTypes: [],
                      tags: [],
                      variantOptions: [],
                      priceRange: null,
                      available: false,
                    })
                  }
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold uppercase rounded hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
