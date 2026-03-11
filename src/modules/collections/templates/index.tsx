"use client"

import { useState, useCallback, useTransition } from "react"
import { HttpTypes } from "@medusajs/types"
import { useRouter, usePathname } from "next/navigation"

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
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard, {
  getBadgesFromTags,
} from "@modules/home/components/product-sections/product-card"
import SkeletonProductCard from "@modules/home/components/product-sections/product-card/skeleton-product-card"
import CollectionHero from "@modules/collections/components/CollectionHero"
import type { SanityCollectionHero } from "@lib/cms/types"

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
  heroData?: SanityCollectionHero | null
}

function mapShopifyProductToSharedCard(
  product: ShopifyProductCard
): HttpTypes.StoreProduct {
  const price = product.priceRange?.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
  const firstVariant = product.variants?.edges?.[0]?.node

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.featuredImage?.url,
    images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    collection: { title: product.vendor || "Sixthgear" },
    tags: product.tags?.map((t: string) => ({ value: t })) || [],
    options: product.options?.map((opt: any) => ({
      id: opt.id,
      title: opt.name,
      values: opt.values?.map((v: string) => ({ id: v, value: v })) || []
    })) || [],
    variants: [
      {
        id: firstVariant?.id || product.id,
        allow_backorder: false,
        manage_inventory: true,
        inventory_quantity: product.availableForSale ? 10 : 0,
        calculated_price: {
          calculated_amount: price ? parseFloat(price.amount) : null,
          original_amount: compareAtPrice
            ? parseFloat(compareAtPrice.amount)
            : null,
          currency_code: price?.currencyCode || "php",
        },
      },
    ],
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
  heroData,
}: CollectionTemplateProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [filterState, setFilterState] =
    useState<FilterState>(initialFilterState)
  const [isPending, startTransition] = useTransition()

  const applyFilters = useCallback(
    (nextState: FilterState) => {
      setFilterState(nextState)
      const params = serializeFilterState(nextState)
      const queryString = params.toString()
      startTransition(() => {
        router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
      })
    },
    [router, pathname]
  )

  const handleSortChange = useCallback(
    (sortKey: ProductCollectionSortKeys, reverse: boolean) => {
      applyFilters({ ...filterState, sortKey, reverse })
    },
    [filterState, applyFilters]
  )

  return (
    <div className="min-h-screen bg-white">
      <CollectionHero
        data={heroData ?? null}
        fallbackTitle={collection.title}
        fallbackDescription={collection.description}
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

          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-12 lg:py-8">
        
        {/* Unified Filter & Sort Bar */}
        <div className={`mt-2 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-y border-gray-200 py-3 relative z-30 transition-opacity duration-200 ${
          isPending ? "opacity-40 pointer-events-none" : ""
        }`}>
          <div className="flex-1 min-w-0">
            <FilterBar
              filters={sidebarFilters}
              activeState={filterState}
              onChange={applyFilters}
              collectionsMenu={collectionsMenu}
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0">
            <span className="text-[12px] md:text-[13px] text-gray-500 whitespace-nowrap hidden sm:block">
               Showing <span className="font-bold text-[#111]">{products.length}</span> products
            </span>
            <SortSelector
              currentSortKey={filterState.sortKey}
              currentReverse={filterState.reverse}
              onChange={handleSortChange}
            />
          </div>
        </div>

        <ActiveFilterPills activeState={filterState} onRemove={applyFilters} />

        <div>
          <div className="mt-4">
            {isPending || products.length > 0 ? (
              <>
                <div
                  className="grid grid-cols-2 gap-y-10 gap-x-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12"
                  role="list"
                  aria-label={isPending ? "Loading products" : `${products.length} products`}
                >
                  {isPending ? (
                    Array.from({ length: products.length || 12 }).map((_, i) => (
                      <div role="listitem" className="h-full" key={i}>
                        <SkeletonProductCard />
                      </div>
                    ))
                  ) : (
                    products.map((product) => (
                      <PLPProductCard
                        key={product.id}
                        product={product}
                        countryCode={countryCode}
                      />
                    ))
                  )}
                </div>

                {!isPending && pageInfo.hasNextPage && pageInfo.endCursor && (
                  <div className="mb-4 mt-12 flex justify-center">
                    <button
                      onClick={() => {
                        const params = serializeFilterState(filterState)
                        params.set("after", pageInfo.endCursor!)
                        router.push(`${pathname}?${params.toString()}`)
                      }}
                      className="group inline-flex items-center gap-2 rounded-lg border border-gray-900 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-gray-900 transition-all duration-200 hover:bg-gray-900 hover:text-white"
                    >
                      Load More
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </button>
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
                      vendors: [],
                      productTypes: [],
                      tags: [],
                      variantOptions: [],
                      priceRange: null,
                      available: false,
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
    <div role="listitem" className="h-full">
      <ProductCard
        product={mapShopifyProductToSharedCard(product)}
        countryCode={countryCode}
        badges={getBadgesFromTags(product.tags)}
      />
    </div>
  )
}
