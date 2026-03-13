/**
 * Shared premium product card used across home sections, listing-style adapters,
 * wishlist, and recommendation grids.
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { ShoppingCart, Flame, Truck, Plus } from "lucide-react"

import { getProductPricing } from "@lib/util/get-product-pricing"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WishlistButton from "@modules/wishlist/components/wishlist-button"
import QuickShopModal from "@modules/common/components/quick-shop-modal"

export type BadgeMode = "discount" | "rank" | "new" | "hot"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  badges?: BadgeMode[]
  rank?: number
  region?: HttpTypes.StoreRegion
  countryCode?: string
  inventoryMap?: Record<string, number>
  rating?: { average_rating: number; count: number }
}

export function getBadgesFromTags(tags: string[] = []): BadgeMode[] {
  const normalized = tags.map((tag) => tag.toLowerCase().replace(/[\s-_]+/g, ""))
  const badges: BadgeMode[] = []

  if (normalized.some((tag) => tag === "hotdeal" || tag === "hotdeals")) {
    badges.push("hot")
  }

  if (
    normalized.some((tag) => tag === "bestseller" || tag === "bestsellers")
  ) {
    badges.push("rank")
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
}: ProductCardProps) {
  const [showQuickShop, setShowQuickShop] = useState(false)

  const pricing = getProductPricing(product)
  const imageUrl = product.thumbnail || product.images?.[0]?.url
  const firstVariant = product.variants?.[0]
  const canAddToCart = Boolean(firstVariant)
  const brandName = product.collection?.title || "Sixthgear"

  const resolvedCountryCode =
    countryCode || region?.countries?.[0]?.iso_2 || "ph"

  const isInStock = (() => {
    if (!firstVariant) {
      return false
    }

    if (inventoryMap && firstVariant.id in inventoryMap) {
      return inventoryMap[firstVariant.id] > 0
    }

    if (firstVariant.allow_backorder === true) {
      return true
    }

    if (firstVariant.manage_inventory === false) {
      return true
    }

    if (
      firstVariant.inventory_quantity !== null &&
      firstVariant.inventory_quantity !== undefined
    ) {
      return firstVariant.inventory_quantity > 0
    }

    return false
  })()

  const openQuickShop = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setShowQuickShop(true)
  }

  // Fallback to checking the product's tags directly if no specific section badge mode was provided
  const resolvedBadges = badges.length > 0 ? badges : getBadgesFromTags(product.tags?.map(t => t.value) || [])

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

  const getBadgeElement = (mode: BadgeMode, keyItem: string) => {
    switch (mode) {
      case "new":
        return <span key={keyItem} className="bg-[#111] text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 leading-none rounded-sm block">New</span>
      case "hot":
        return null
      case "rank":
        return <span key={keyItem} className="bg-[#111] text-[#fff] text-[11px] font-bold uppercase tracking-wider px-2 py-1 leading-none rounded-sm block">Best Seller</span>
      default:
        return null
    }
  }

  return (
    <article className="group h-full flex flex-col bg-white transition-colors duration-200">
      {/* Top Image Container — square aspect ratio for compact footprint */}
      <div className="relative w-full aspect-square bg-[#f5f5f5] overflow-hidden rounded-sm group-hover:bg-[#f2f2f2] transition-colors">
        
        {/* Badges Overlay (Stackable vertically, padded from edge) */}
        <div className="absolute left-3 top-3 z-30 flex flex-col gap-1 items-start">
          {pricing.isOnSale && (
            <span className="bg-[#e62020] text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 leading-none rounded-sm block">
              Sale
            </span>
          )}
          {resolvedBadges.map((badgeMode) => getBadgeElement(badgeMode, badgeMode))}
        </div>

        {/* Sleek Wishlist Naked Icon */}
        <div className="absolute right-3 top-3 z-20 text-[#a0a0a0] transition-colors hover:text-[#111]" title="Add to wishlist">
          <WishlistButton
            productData={{
              handle: product.handle,
              id: product.id,
              title: product.title || "",
              imageUrl: imageUrl || null,
              imageAlt: product.title || null,
              price: pricing.minCalculated ?? 0,
              compareAtPrice: pricing.minOriginal,
              currencyCode: pricing.currencyCode.toUpperCase(),
              availableForSale: isInStock,
              vendor: brandName,
              variantId: firstVariant?.id || product.id,
            }}
            className="w-10 h-10 flex items-center justify-center bg-transparent border-none p-0 shadow-none hover:bg-transparent [&_svg]:!w-6 [&_svg]:!h-6"
          />
        </div>

        {/* Subtle bottom-left UI standard icons */}
        <div className="absolute left-3 bottom-3 z-20 flex gap-1.5 items-end text-[#d0d0d0]">
          {resolvedBadges.includes("hot") && (
            <div title="Hot Deal">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" strokeWidth={2} />
            </div>
          )}
          <Truck className="w-4 h-4 mb-0.5" strokeWidth={2} />
        </div>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="absolute inset-0 w-full h-full block"
        >
          {/* Main Product Image */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title || "Product"}
              fill
              className="object-contain p-5 sm:p-6 transition-transform duration-400 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
          ) : (
             <div className="flex h-full w-full items-center justify-center text-[#d0d0d0]">
               <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
             </div>
          )}
          
          {/* Sold Out Overlay Layer */}
          {!isInStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <span className="bg-white border border-[#e0e0e0] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#5f5b53]">
                Sold Out
              </span>
            </div>
          )}
        </LocalizedClientLink>
      </div>

      {/* Compact Bottom Information Block */}
      <div className="flex flex-col flex-1 pt-2 px-1 pb-1 bg-white relative">
        <div className="flex flex-col gap-0.5">
          {/* BRAND FIRST, small, muted, uppercase */}
          <LocalizedClientLink href={`/products/${product.handle}`} className="block">
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#888] line-clamp-1">
               {brandName}
             </p>
          </LocalizedClientLink>

          {/* PRODUCT NAME SECOND, bold, black, visually dominant */}
          <LocalizedClientLink href={`/products/${product.handle}`} className="block">
             <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[#111] leading-tight line-clamp-2">
               {product.title}
             </h3>
          </LocalizedClientLink>
          
          {/* VARIANT AVAILABILITY THIRD */}
          {availabilityText && (
            <p className="text-[11px] text-[#767676] font-medium italic">
              {availabilityText}
            </p>
          )}
        </div>

        {/* Pricing & Cart Action Row */}
        <div className="mt-auto pt-1 flex w-full items-center justify-between gap-2">
          <div className="flex flex-col flex-1">
            {pricing.hasPrice ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {pricing.isOnSale && pricing.formattedOriginal ? (
                  <>
                    <span className="text-[12px] sm:text-[13px] text-[#767676]">
                      From
                    </span>
                    <span className="text-[13px] sm:text-[14px] font-extrabold text-[#e62020]">
                      {pricing.formattedCalculated}
                    </span>
                    <span className="text-[11px] text-[#767676] line-through decoration-[#767676] decoration-1 font-medium">
                      {pricing.formattedOriginal}
                    </span>
                    {pricing.discountPct && (
                      <span className="text-[10px] font-bold text-[#e62020]">
                        -{pricing.discountPct}%
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[13px] sm:text-[14px] font-extrabold text-[#111]">
                    {pricing.formattedCalculated}
                  </span>
                )}
              </div>
            ) : (
                <span className="text-[12px] text-[#a0a0a0] font-medium">Price unavailable</span>
            )}
          </div>

          {/* Quick Shop Trigger Icon */}
          <button
            type="button"
            onClick={openQuickShop}
            disabled={!canAddToCart || !isInStock}
            aria-label="Quick shop"
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all duration-200 rounded-sm ${
              isInStock && canAddToCart
                ? "text-[#111] hover:bg-[#f0f0f0]"
                : "text-[#dcdcdc] cursor-not-allowed"
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" fill="none" />
              <span className="absolute -bottom-1 -right-1 bg-white text-[#111] rounded-full">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* QuickShop Modal */}
      <QuickShopModal
        product={product}
        countryCode={resolvedCountryCode}
        isOpen={showQuickShop}
        onClose={() => setShowQuickShop(false)}
      />
    </article>
  )
}
