"use client"

import { useState, useCallback, useTransition } from "react"
import { HttpTypes } from "@medusajs/types"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import type {
  ShopifyFilter,
  ShopifyPageInfo,
  ShopifyProductCard,
  FilterState,
  ProductCollectionSortKeys,
} from "@lib/shopify/types"
import { serializeFilterState } from "@lib/util/filterParams"
import FilterBar from "@modules/collections/components/FilterBar"
import SortSelector from "@modules/collections/components/SortSelector"
import ActiveFilterPills from "@modules/collections/components/ActiveFilterPills"
import MobileFilterDrawer from "@modules/collections/components/MobileFilterDrawer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard, {
  getBadgesFromTags,
} from "@modules/home/components/product-sections/product-card"
import SkeletonProductCard from "@modules/home/components/product-sections/product-card/skeleton-product-card"
import CollectionHero from "@modules/collections/components/CollectionHero"
import { startRouteProgress } from "@modules/common/components/route-progress"

type CollectionTemplateProps = {
  collection: {
    id: string
    title: string
    handle: string
    description: string
  }
  products: ShopifyProductCard[]
  filters: ShopifyFilter[]
  sidebarFilters: ShopifyFilter[]
  pageInfo: ShopifyPageInfo
  initialFilterState: FilterState
  countryCode: string
  collectionsMenu?: { handle: string; title: string }[]
  brandCollectionsMenu?: { handle: string; title: string }[]
  showSoldOutToggle?: boolean
  heroTitle: string
  heroDescription?: string
  heroImageUrl?: string | null
}

function mapShopifyProductToSharedCard(
  product: ShopifyProductCard
): HttpTypes.StoreProduct {
  const price = product.priceRange?.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
  const firstVariant = product.variants?.edges?.[0]?.node

  // Map all gallery images (or fallback to featuredImage)
  const images = product.images?.edges?.map((e: any) => ({ url: e.node.url })) || []
  if (images.length === 0 && product.featuredImage) {
    images.push({ url: product.featuredImage.url })
  }

  // Map all variants that came through the connection
  const variants = product.variants?.edges?.map((edge: any) => {
    const node = edge.node
    const variantPrice = node.price || price
    const variantCompare = node.compareAtPrice || compareAtPrice

    return {
      id: node.id,
      title: node.selectedOptions?.map((o: any) => o.value).join(" / ") || "Default Title",
      availableForSale: node.availableForSale !== false,
      allow_backorder: false,
      manage_inventory: true,
      inventory_quantity: node.availableForSale !== false ? 10 : 0, // Fallback logic
      options: node.selectedOptions?.map((o: any) => ({
        value: o.value,
        option: { title: o.name }
      })) || [],
      calculated_price: {
        calculated_amount: variantPrice ? parseFloat(variantPrice.amount) : null,
        original_amount: variantCompare ? parseFloat(variantCompare.amount) : null,
        currency_code: variantPrice?.currencyCode || "php",
      },
      // Pass down variant image through a custom field or standard Medusa field
      image: node.image ? { url: node.image.url } : null,
      thumbnail: node.image?.url || null,
    }
  }) || [
    {
      id: product.id,
      availableForSale: product.availableForSale,
      allow_backorder: false,
      manage_inventory: true,
      inventory_quantity: product.availableForSale ? 10 : 0,
      calculated_price: {
        calculated_amount: price ? parseFloat(price.amount) : null,
        original_amount: compareAtPrice ? parseFloat(compareAtPrice.amount) : null,
        currency_code: price?.currencyCode || "php",
      },
    }
  ]

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.featuredImage?.url,
    images,
    collection: { title: product.vendor || "Sixthgear" },
    availableForSale: product.availableForSale,
    tags: product.tags?.map((t: string) => ({ value: t })) || [],
    options: product.options?.map((opt: any) => ({
      id: opt.id,
      title: opt.name,
      values: opt.values?.map((v: string) => ({ id: v, value: v })) || []
    })) || [],
    variants,
  } as unknown as HttpTypes.StoreProduct
}

export default function CollectionTemplate({
  collection,
  products,
  filters,
  sidebarFilters,
  pageInfo,
  initialFilterState,
  countryCode,
  collectionsMenu,
  brandCollectionsMenu,
  showSoldOutToggle = false,
  heroTitle,
  heroDescription,
  heroImageUrl,
}: CollectionTemplateProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filterState, setFilterState] =
    useState<FilterState>(initialFilterState)
  const [isPending, startTransition] = useTransition()

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const activeBrandCollection = brandCollectionsMenu?.find(
    (collection) => collection.handle === filterState.collection
  )

  const buildCursorUrl = useCallback((
    direction: "next" | "previous",
    cursor: string
  ) => {
    const params = serializeFilterState(filterState)

    const query = searchParams.get("query")
    if (query) {
      params.set("query", query)
    }

    params.delete("page")
    params.delete("after")
    params.delete("before")

    if (direction === "next") {
      params.set("after", cursor)
    } else {
      params.set("before", cursor)
    }

    const qs = params.toString()
    return `${pathname}${qs ? `?${qs}` : ""}`
  }, [filterState, searchParams, pathname])

  const applyFilters = useCallback(
    (nextState: FilterState) => {
      setFilterState(nextState)
      const params = serializeFilterState(nextState)
      
      // Preserve search query if active
      const query = searchParams.get("query")
      if (query) {
        params.set("query", query)
      }

      // Reset pagination when filters change
      params.delete("page")
      params.delete("after")
      params.delete("before")

      const queryString = params.toString()
      startTransition(() => {
        startRouteProgress()
        router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
      })
    },
    [router, pathname, searchParams]
  )

  const goToCursor = useCallback((
    direction: "next" | "previous",
    cursor: string
  ) => {
    startTransition(() => {
      startRouteProgress()
      router.push(buildCursorUrl(direction, cursor))
    })
  }, [router, buildCursorUrl])

  const handleSortChange = useCallback(
    (sortKey: ProductCollectionSortKeys, reverse: boolean) => {
      applyFilters({ ...filterState, sortKey, reverse })
    },
    [filterState, applyFilters]
  )

  // Calculate total active filters for indicator
  const activeCount =
    filterState.vendors.length +
    filterState.productTypes.length +
    filterState.tags.length +
    filterState.variantOptions.length +
    (filterState.priceRange ? 1 : 0) +
    (filterState.available ? 1 : 0) +
    (filterState.showSoldOut ? 1 : 0) +
    (filterState.onSale ? 1 : 0) +
    (activeBrandCollection ? 1 : 0)

  const displayProducts = filterState.onSale
    ? products.filter((p) => {
        const minOriginal = p.compareAtPriceRange?.minVariantPrice?.amount;
        const minCalculated = p.priceRange?.minVariantPrice?.amount;
        return (
          minOriginal &&
          minCalculated &&
          parseFloat(minOriginal) > parseFloat(minCalculated)
        );
      })
    : products;

  return (
    <div className="min-h-screen bg-white">
      <CollectionHero
        title={heroTitle}
        description={heroDescription}
        backgroundImageUrl={heroImageUrl}
      />
      <div className="border-b border-gray-100 bg-gray-50/60">
        <div className="mx-auto max-w-[1440px] px-4 pb-4 pt-4 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li>
                <LocalizedClientLink
                  href="/"
                  className="hover:text-gray-700 transition-colors"
                >
                  Home
                </LocalizedClientLink>
              </li>
              <li aria-hidden="true">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </li>
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="hover:text-gray-700 transition-colors"
                >
                  Shop
                </LocalizedClientLink>
              </li>
              {collection.handle !== "all-products" && (
                <>
                  <li aria-hidden="true">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </li>
                  <li>
                    <span
                      className="text-gray-600 font-medium"
                      aria-current="page"
                    >
                      {collection.title}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-12 lg:py-8">
        
        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={sidebarFilters}
          activeState={filterState}
          onChange={applyFilters}
          collectionsMenu={collectionsMenu}
          brandCollectionsMenu={brandCollectionsMenu}
          showSoldOutToggle={showSoldOutToggle}
          productCount={displayProducts.length}
        />

        {/* Unified Filter & Sort Bar */}
        <div className={`mt-2 mb-6 border-y border-gray-200 py-3 relative z-30 transition-opacity duration-200 ${
          isPending ? "opacity-40 pointer-events-none" : ""
        }`}>
          {/* Mobile Top Row */}
          <div className="flex items-center justify-between md:hidden">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#111]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h8" />
              </svg>
              Filters
              {activeCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold ml-0.5">
                  {activeCount}
                </span>
              )}
            </button>
            <SortSelector
              currentSortKey={filterState.sortKey}
              currentReverse={filterState.reverse}
              onChange={handleSortChange}
            />
          </div>

          {/* Desktop Row */}
          <div className="hidden md:flex flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <FilterBar
                filters={sidebarFilters}
                activeState={filterState}
                onChange={applyFilters}
                collectionsMenu={collectionsMenu}
                brandCollectionsMenu={brandCollectionsMenu}
                showSoldOutToggle={showSoldOutToggle}
              />
            </div>

            <div className="flex items-center justify-end gap-6 flex-shrink-0">
              <span className="text-[13px] text-gray-500 whitespace-nowrap">
                 Showing <span className="font-bold text-[#111]">{displayProducts.length}</span> products
              </span>
              <SortSelector
                currentSortKey={filterState.sortKey}
                currentReverse={filterState.reverse}
                onChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        <ActiveFilterPills activeState={filterState} onRemove={applyFilters} />

        <div>
          <div className="mt-4">
            {isPending || displayProducts.length > 0 ? (
              <>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l border-t border-gray-200"
                  role="list"
                  aria-label={isPending ? "Loading products" : `${products.length} products`}
                >
                  {isPending ? (
                    Array.from({ length: displayProducts.length || 12 }).map((_, i) => (
                      <div role="listitem" className="h-full border-r border-b border-gray-200" key={i}>
                        <SkeletonProductCard />
                      </div>
                    ))
                  ) : (
                    displayProducts.map((product) => (
                      <PLPProductCard
                        key={product.id}
                        product={product}
                        countryCode={countryCode}
                      />
                    ))
                  )}
                </div>

                {!isPending && (pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
                  <div className="mb-8 mt-12 flex items-center justify-center gap-2">
                    {pageInfo.hasPreviousPage && pageInfo.startCursor && (
                      <button
                        onClick={() => goToCursor("previous", pageInfo.startCursor!)}
                        className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
                        aria-label="Previous products"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                      </button>
                    )}

                    {pageInfo.hasNextPage && pageInfo.endCursor && (
                      <button
                        onClick={() => goToCursor("next", pageInfo.endCursor!)}
                        className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
                        aria-label="Next products"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

              </>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-24 text-center"
                role="status"
                aria-live="polite"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                  <svg
                    className="w-7 h-7 text-gray-300"
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
                </div>
                <h3 className="mb-1.5 text-lg font-semibold text-gray-900">
                  No products found
                </h3>
                <p className="mb-6 max-w-xs text-sm leading-relaxed text-gray-500">
                  Try adjusting your filters to find what you&apos;re looking
                  for.
                </p>
                <button
                  onClick={() =>
                    applyFilters({
                      ...filterState,
                      collection: null,
                      vendors: [],
                      productTypes: [],
                      tags: [],
                      variantOptions: [],
                      priceRange: null,
                      available: false,
                      showSoldOut: false,
                      onSale: false,
                    })
                  }
                  className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PLPProductCard({
  product,
  countryCode,
}: {
  product: ShopifyProductCard
  countryCode: string
}) {
  return (
    <div role="listitem" className="h-full bg-white border-r border-b border-gray-200">
      <ProductCard
        product={mapShopifyProductToSharedCard(product)}
        countryCode={countryCode}
        badges={getBadgesFromTags(product.tags)}
        preserveSource
      />
    </div>
  )
}
