/**
 * Shared premium product card used across home sections, listing-style adapters,
 * wishlist, and recommendation grids.
 */

"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { ShoppingCart, Plus } from "lucide-react"

import { getProductPricing } from "@lib/util/get-product-pricing"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const QuickShopModal = dynamic(
  () => import("@modules/common/components/quick-shop-modal"),
  {
    ssr: false,
    loading: () => null,
  }
)

export type BadgeMode = "discount" | "rank" | "new" | "hot"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  badges?: BadgeMode[]
  rank?: number
  region?: HttpTypes.StoreRegion
  countryCode?: string
  inventoryMap?: Record<string, number>
  rating?: { average_rating: number; count: number }
  preserveSource?: boolean
}

export function getBadgesFromTags(tags: string[] = []): BadgeMode[] {
  const normalized = tags.map((tag) => tag.toLowerCase().replace(/[\s-_]+/g, ""))
  const badges: BadgeMode[] = []

  if (normalized.some((tag) => tag === "hotdeal" || tag === "hotdeals")) {
    badges.push("hot")
  }

  if (
    normalized.some((tag) => tag === "newarrival" || tag === "newarrivals")
  ) {
    badges.push("new")
  }

  return badges
}

export default function ProductCard({
  product,
  badges = [],
  region,
  countryCode,
  inventoryMap,
  preserveSource = false,
}: ProductCardProps) {
  const [showQuickShop, setShowQuickShop] = useState(false)

  const pricing = getProductPricing(product)
  const galleryImages = (product.images || [])
    .map((image: any) => image?.url)
    .filter((url): url is string => Boolean(url))
  const imageUrl = product.thumbnail || galleryImages[0]
  const hoverImageUrl =
    galleryImages.find((url) => url !== imageUrl) || null
  const firstVariant = product.variants?.[0]
  const canAddToCart = Boolean(firstVariant)
  const brandName = product.collection?.title || "Sixthgear"
  const productAvailableForSale = (product as any).availableForSale

  const resolvedCountryCode =
    countryCode || region?.countries?.[0]?.iso_2 || "ph"

  const isVariantInStock = (variant: NonNullable<typeof product.variants>[number]) => {
    const variantAvailableForSale = (variant as any).availableForSale

    if (variantAvailableForSale === true) return true
    if (variantAvailableForSale === false) return false

    if (inventoryMap && variant.id in inventoryMap) {
      return inventoryMap[variant.id] > 0
    }

    if (variant.allow_backorder === true) return true
    if (variant.manage_inventory === false) return true

    if (
      variant.inventory_quantity !== null &&
      variant.inventory_quantity !== undefined
    ) {
      return variant.inventory_quantity > 0
    }

    return false
  }

  const isInStock = (() => {
    const hasAvailableVariant = product.variants?.some(isVariantInStock)
    if (hasAvailableVariant) return true

    if (product.variants && product.variants.length > 0) {
      return productAvailableForSale === true
    }

    if (productAvailableForSale === true) return true
    if (productAvailableForSale === false) return false

    return false
  })()

  // Dynamic variant availability text from Shopify options
  const availabilityText = (() => {
    if (!product.options || product.options.length === 0) return null

    const colorOption = product.options.find(o => 
      o.title?.toLowerCase() === "color" || o.title?.toLowerCase() === "colour" || o.title?.toLowerCase() === "renk"
    )
    const sizeOption = product.options.find(o => 
      o.title?.toLowerCase() === "size" || o.title?.toLowerCase() === "beden"
    )

    const colorCount = colorOption?.values?.length || 0
    const sizeCount = sizeOption?.values?.length || 0

    if (colorCount > 1 && sizeCount > 1) {
      return `Available in ${colorCount} colors and ${sizeCount} sizes`
    } else if (colorCount > 1) {
      return `Available in ${colorCount} colors`
    } else if (sizeCount > 1) {
      return `Available in ${sizeCount} sizes`
    } else if (colorCount === 1 || sizeCount === 1) {
      return "Size/Color options available"
    }
    
    return null
  })()

  const openQuickShop = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setShowQuickShop(true)
  }

  return (
    <article className="group h-full flex flex-col bg-white">
      {/* ── Image Area ── */}
      <div className="relative group w-full aspect-square bg-white overflow-hidden">

        {/* Dynamic "Save X%" badge — top-left with padding */}
        {pricing.isOnSale && pricing.discountPct && (
          <span className="absolute top-2 left-2 z-30 bg-[#e62020] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1.5 leading-none tracking-wide rounded-sm">
            Save {pricing.discountPct}%
          </span>
        )}

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          preserveSource={preserveSource}
          className="absolute inset-0 w-full h-full block"
        >
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={product.title || "Product"}
                fill
                className={`object-contain p-5 sm:p-6 transition-opacity duration-300 ease-in-out ${
                  hoverImageUrl ? "group-hover:opacity-0" : ""
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {hoverImageUrl && (
                <Image
                  src={hoverImageUrl}
                  alt={product.title || "Product"}
                  fill
                  className="absolute inset-0 object-contain p-5 sm:p-6 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-200">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Sold Out Overlay */}
          {!isInStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <span className="bg-white border border-gray-200 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Sold Out
              </span>
            </div>
          )}
        </LocalizedClientLink>
      </div>

      {/* ── Text Section ── */}
      <div className="flex flex-col flex-1 pt-4 px-4 pb-4">
        {/* Vendor */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          preserveSource={preserveSource}
          className="block"
        >
          <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.1em] text-gray-400 leading-none mb-1">
            {brandName}
          </p>
        </LocalizedClientLink>

        {/* Product Title — max 2 lines */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          preserveSource={preserveSource}
          className="block"
        >
          <h3 className="text-[14px] sm:text-[15px] font-bold text-[#111] leading-snug line-clamp-2">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {/* VARIANT AVAILABILITY */}
        {availabilityText && (
          <p className="text-[11px] text-gray-500 font-medium italic mt-1.5">
            {availabilityText}
          </p>
        )}

        {/* Pricing & Cart Action Row */}
        <div className="mt-auto pt-2 flex w-full items-end justify-between gap-2">
          <div className="flex flex-col flex-1">
            {pricing.hasPrice ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                {pricing.isOnSale && pricing.formattedOriginal ? (
                  <>
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#e62020]">
                      {pricing.formattedCalculated}
                    </span>
                    <span className="text-[11px] sm:text-[12px] text-gray-400 line-through font-normal">
                      {pricing.formattedOriginal}
                    </span>
                  </>
                ) : (
                  <span className="text-[13px] sm:text-[14px] font-bold text-gray-900">
                    {pricing.formattedCalculated}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[12px] text-gray-400 font-normal">Price unavailable</span>
            )}
          </div>

          {/* Quick Shop Trigger Icon */}
          <button
            type="button"
            onClick={openQuickShop}
            disabled={!canAddToCart || !isInStock}
            aria-label="Quick shop"
            className={`flex-shrink-0 w-9 h-9 flex items-center justify-center transition-colors duration-200 rounded-sm ${
              isInStock && canAddToCart
                ? "text-gray-900 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-[18px] h-[18px] stroke-[2]" fill="none" />
              <span className="absolute -bottom-0.5 -right-0.5 bg-white text-gray-900 rounded-full">
                <Plus className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* QuickShop Modal */}
      {showQuickShop && (
        <QuickShopModal
          product={product}
          countryCode={resolvedCountryCode}
          isOpen={showQuickShop}
          onClose={() => setShowQuickShop(false)}
        />
      )}
    </article>
  )
}
