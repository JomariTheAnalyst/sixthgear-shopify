"use client"

import { useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import type {
  ShopifyFilter,
  ShopifyPageInfo,
  ShopifyProductCard,
  FilterState,
  ProductCollectionSortKeys,
} from "@lib/shopify/types"
import { serializeFilterState } from "@lib/util/filterParams"
import FilterSidebar from "@modules/collections/components/FilterSidebar"
import SortSelector from "@modules/collections/components/SortSelector"
import ActiveFilterPills from "@modules/collections/components/ActiveFilterPills"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WishlistButton from "@modules/wishlist/components/wishlist-button"
import { ShoppingCart, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { addToCart } from "@lib/data/cart"
import { useCartStore } from "@lib/cart"

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
  const router = useRouter()
  const pathname = usePathname()
  const [filterState, setFilterState] =
    useState<FilterState>(initialFilterState)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const applyFilters = useCallback(
    (nextState: FilterState) => {
      setFilterState(nextState)
      const params = serializeFilterState(nextState)
      const queryString = params.toString()
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    },
    [router, pathname]
  )

  const handleSortChange = useCallback(
    (sortKey: ProductCollectionSortKeys, reverse: boolean) => {
      applyFilters({ ...filterState, sortKey, reverse })
    },
    [filterState, applyFilters]
  )

  const activeFilterCount =
    filterState.vendors.length +
    filterState.productTypes.length +
    filterState.tags.length +
    filterState.variantOptions.length +
    (filterState.priceRange ? 1 : 0) +
    (filterState.available ? 1 : 0)

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Page Header ─── */}
      <div className="border-b border-gray-100 bg-gray-50/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
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

          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="mt-1.5 text-sm text-gray-500 max-w-xl leading-relaxed">
                  {collection.description}
                </p>
              )}
            </div>
            <p className="text-xs font-medium text-gray-400 tracking-widest uppercase">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Main Layout ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-8">
        {/* Toolbar: Mobile Filter + Sort */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Mobile filter trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
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
                  strokeWidth={1.5}
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-gray-900 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <SortSelector
            currentSortKey={filterState.sortKey}
            currentReverse={filterState.reverse}
            onChange={handleSortChange}
          />
        </div>

        {/* Active Filter Pills */}
        <ActiveFilterPills activeState={filterState} onRemove={applyFilters} />

        {/* Sidebar + Grid */}
        <div className="flex gap-0 lg:gap-8">
          <FilterSidebar
            filters={sidebarFilters}
            activeState={filterState}
            onChange={applyFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {products.length > 0 ? (
              <>
                <div
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
                  role="list"
                  aria-label={`${products.length} products`}
                >
                  {products.map((product) => (
                    <PLPProductCard
                      key={product.id}
                      product={product}
                      countryCode={countryCode}
                    />
                  ))}
                </div>

                {/* Load More */}
                {pageInfo.hasNextPage && pageInfo.endCursor && (
                  <div className="flex justify-center mt-12 mb-4">
                    <button
                      onClick={() => {
                        const params = serializeFilterState(filterState)
                        params.set("after", pageInfo.endCursor!)
                        router.push(`${pathname}?${params.toString()}`)
                      }}
                      className="group inline-flex items-center gap-2 px-8 py-3 border border-gray-900 text-gray-900 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200"
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

                {/* Result Summary */}
                <div className="text-center py-8">
                  <p className="text-xs text-gray-400 tracking-wide">
                    Showing {products.length} product
                    {products.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </>
            ) : (
              /* ─── Empty State ─── */
              <div
                className="flex flex-col items-center justify-center py-24 text-center"
                role="status"
                aria-live="polite"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-5 border border-gray-100">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
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
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
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

/* ─── PLP Product Card ─── */
function PLPProductCard({
  product,
  countryCode,
}: {
  product: ShopifyProductCard
  countryCode: string
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const setCart = useCartStore((s) => s.setCart)
  const setCartStoreId = useCartStore((s) => s.setCartId)

  const price = product.priceRange?.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
  const imageUrl = product.featuredImage?.url
  const isOnSale =
    compareAtPrice &&
    price &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)
  const discountPct = isOnSale
    ? Math.round(
        ((parseFloat(compareAtPrice!.amount) - parseFloat(price!.amount)) /
          parseFloat(compareAtPrice!.amount)) *
          100
      )
    : null

  const formatPrice = (amount: string, currencyCode: string) => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: currencyCode || "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const firstVariant = product.variants?.edges?.[0]?.node
  const canAddToCart = firstVariant && product.availableForSale

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!canAddToCart || isAdding || added) return

    setIsAdding(true)
    try {
      const updatedCart = await addToCart({
        variantId: firstVariant.id,
        quantity: 1,
        countryCode,
      })
      
      if (updatedCart) {
        setCart(updatedCart as any)
        setCartStoreId(updatedCart.id)
        setAdded(true)
        toast.success("Added to Cart", {
          description: `${product.vendor || "Sixthgear"} ${product.title}`,
        })
        setTimeout(() => setAdded(false), 2400)
      }
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <article
      role="listitem"
      className="group relative flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-300"
    >
      {/* Image */}
      <div className="relative">
        <div className="absolute right-2.5 top-2.5 z-20">
          <WishlistButton
            productData={{
              handle: product.handle,
              id: product.id,
              title: product.title || "",
              imageUrl: product.featuredImage?.url || null,
              imageAlt: product.featuredImage?.altText || product.title || null,
              price: price ? parseFloat(price.amount) : 0,
              compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice.amount) : null,
              currencyCode: price?.currencyCode || "PHP",
              availableForSale: product.availableForSale,
              vendor: product.vendor || "Sixthgear",
              variantId: firstVariant?.id || product.id,
            }}
            className="border border-gray-200 bg-white/90"
          />
        </div>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <div className="relative aspect-square bg-gray-50/80 overflow-hidden">
            {/* Discount Badge */}
            {isOnSale && discountPct && discountPct >= 5 && (
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="inline-flex items-center px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded tracking-wide">
                  -{discountPct}%
                </span>
              </div>
            )}

            {/* Sold Out Overlay */}
            {!product.availableForSale && (
              <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest border border-gray-300 px-3 py-1.5 rounded bg-white/80">
                  Sold Out
                </span>
              </div>
            )}

            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.title || "Product"}
                fill
                className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </LocalizedClientLink>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 gap-1.5">
        {/* Brand */}
        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium truncate">
          {product.vendor || "Sixthgear"}
        </p>

        {/* Title */}
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {/* Price Row + Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            {price ? (
              <>
                <span
                  className={`text-sm sm:text-base font-bold ${
                    isOnSale ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {formatPrice(price.amount, price.currencyCode)}
                </span>
                {isOnSale && compareAtPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(
                      compareAtPrice.amount,
                      compareAtPrice.currencyCode
                    )}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-400">Price unavailable</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.availableForSale || isAdding}
            aria-label={added ? "Added to cart" : "Add to cart"}
            title="Add to cart"
            className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              added
                ? "bg-green-500 text-white border border-green-500 shadow-sm"
                : product.availableForSale
                ? "bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white hover:shadow-md"
                : "bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : added ? (
              <Check className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
