/**
 * QuickShopModal â€” lightweight product detail modal
 * Triggered from product card add-to-cart icon.
 * Supports variant selection, quantity control, and add-to-cart confirmation.
 */

"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { Loader2, Minus, Plus, X, ExternalLink, ShoppingBag, Check } from "lucide-react"
import { toast } from "sonner"

import { addToCart } from "@lib/data/cart"
import { useCartStore } from "@lib/cart"
import { getProductPricing, formatPrice } from "@lib/util/get-product-pricing"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WishlistButton from "@modules/wishlist/components/wishlist-button"

interface QuickShopModalProps {
  product: HttpTypes.StoreProduct
  countryCode: string
  isOpen: boolean
  onClose: () => void
}

export default function QuickShopModal({
  product,
  countryCode,
  isOpen,
  onClose,
}: QuickShopModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const setCart = useCartStore((state) => state.setCart)
  const setCartStoreId = useCartStore((state) => state.setCartId)

  const pricing = getProductPricing(product)
  const brandName = product.collection?.title || "Sixthgear"

  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const mainImageRef = useRef<HTMLDivElement>(null)

  const allImages = useMemo(() => {
    // Collect all valid URLs from product.images array
    const imgs = product.images?.map((img: any) => img.url).filter(Boolean) || []
    // Ensure product.thumbnail is included as the primary image if missing from the gallery
    if (product.thumbnail && !imgs.includes(product.thumbnail)) {
      imgs.unshift(product.thumbnail)
    }
    return imgs
  }, [product.images, product.thumbnail])

  // â”€â”€ Options and variants â”€â”€
  const productOptions = useMemo(() => {
    return product.options?.filter((opt) => {
      // Only show options with more than 1 value (skip "Default Title")
      if (!opt.values || opt.values.length <= 1) {
        const singleVal = opt.values?.[0]?.value?.toLowerCase()
        if (singleVal === "default title" || singleVal === "default") return false
      }
      return true
    }) || []
  }, [product.options])

  // Initialize selected options with first value of each option
  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, string> = {}
      productOptions.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
          initial[opt.title || opt.id] = opt.values[0].value
        }
      })
      setSelectedOptions(initial)
      setQuantity(1)
      setAdded(false)
      setActiveImage(allImages[0] || null)
      setIsZoomed(false)
    }
  }, [isOpen, productOptions, allImages])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // Find the variant that matches selected options
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null
    if (product.variants.length === 1) return product.variants[0]

    return product.variants.find((variant: any) => {
      if (!variant.options) return false
      return productOptions.every((opt) => {
        const optTitle = opt.title || opt.id
        const selectedValue = selectedOptions[optTitle]
        return variant.options.some(
          (vo: any) => (vo.option?.title || vo.name) === optTitle && vo.value === selectedValue
        )
      })
    }) || product.variants[0]
  }, [product.variants, selectedOptions, productOptions])

  // Variant-image syncing
  useEffect(() => {
    const variantImgUrl =
      (selectedVariant as any)?.image?.url ||
      (selectedVariant as any)?.thumbnail ||
      (selectedVariant as any)?.featuredImage?.url

    if (variantImgUrl) {
      setActiveImage(variantImgUrl)
    }
  }, [selectedVariant])

  // Variant-specific pricing
  const variantPricing = useMemo(() => {
    if (!selectedVariant?.calculated_price) return pricing
    const calc = selectedVariant.calculated_price
    const calculated = calc.calculated_amount
    const original = calc.original_amount
    const isOnSale = calculated !== null && original !== null && calculated < original
    const discountPct = isOnSale && original && calculated
      ? Math.round(((original - calculated) / original) * 100)
      : null

    return {
      ...pricing,
      minCalculated: calculated,
      minOriginal: original,
      isOnSale,
      discountPct,
      formattedCalculated: formatPrice(calculated, pricing.currencyCode),
      formattedOriginal: formatPrice(original, pricing.currencyCode),
    }
  }, [selectedVariant, pricing])

  const isInStock = useMemo(() => {
    if (!selectedVariant) return false
    if (selectedVariant.allow_backorder) return true
    if (selectedVariant.manage_inventory === false) return true
    if (selectedVariant.inventory_quantity !== null && selectedVariant.inventory_quantity !== undefined) {
      return selectedVariant.inventory_quantity > 0
    }
    return false
  }, [selectedVariant])

  const handleOptionChange = useCallback((optionTitle: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionTitle]: value }))
  }, [])

  const handleAddToCart = async () => {
    if (!selectedVariant || isAdding || !isInStock) return

    setIsAdding(true)
    try {
      const updatedCart = await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      if (updatedCart) {
        setCart(updatedCart as any)
        setCartStoreId(updatedCart.id)
        setAdded(true)
        toast.success("Added to Cart", {
          description: `${brandName} ${product.title}`,
        })
        setTimeout(() => {
          setAdded(false)
          onClose()
        }, 1200)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current || !isZoomed) return
    const rect = mainImageRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomPosition({ x, y })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-[301] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="relative w-full sm:max-w-lg lg:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 border border-gray-200 text-[#111] hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Mobile drag indicator */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Content */}
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 p-5 sm:p-6">
            {/* Image Gallery */}
            <div className="w-full sm:w-[45%] flex flex-col gap-3 flex-shrink-0 mb-4 sm:mb-0">
              {/* Main Image */}
              <div
                ref={mainImageRef}
                className={`relative w-full aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden hidden md:block ${
                  activeImage ? "cursor-zoom-in" : ""
                }`}
                onMouseEnter={() => activeImage && setIsZoomed(true)}
                onMouseLeave={() => activeImage && setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={product.title || "Product"}
                    fill
                    className={`object-contain p-4 transition-transform duration-200 ${
                      isZoomed ? "scale-150" : "scale-100"
                    }`}
                    style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : undefined}
                    sizes="(max-width: 640px) 100vw, 300px"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                )}
                {/* Sale Badge */}
                {variantPricing.isOnSale && (
                  <span className="absolute top-3 left-3 bg-[#e62020] text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm z-10">
                    Sale
                  </span>
                )}
                {/* Sold out overlay */}
                {!isInStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 pointer-events-none">
                    <span className="bg-white border border-gray-200 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      Sold Out
                    </span>
                  </div>
                )}
                {/* Wishlist Button */}
                <div className="absolute right-3 top-3 z-20 text-[#a0a0a0] transition-colors hover:text-[#111]" title="Add to wishlist">
                  <WishlistButton
                    productData={{
                      handle: product.handle,
                      id: product.id,
                      title: product.title || "",
                      imageUrl: activeImage || null,
                      imageAlt: product.title || null,
                      price: variantPricing.minCalculated ?? 0,
                      compareAtPrice: variantPricing.minOriginal,
                      currencyCode: product.variants?.[0]?.calculated_price?.currency_code || "PHP",
                      availableForSale: isInStock,
                      vendor: brandName,
                      variantId: selectedVariant?.id || product.id,
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-transparent border-none p-0 shadow-none hover:bg-transparent [&_svg]:!w-6 [&_svg]:!h-6"
                  />
                </div>
              </div>

              {/* Mobile Main Image (No Zoom) */}
              <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden block md:hidden">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={product.title || "Product"}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 640px) 100vw, 300px"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                )}
                {/* Sale Badge */}
                {variantPricing.isOnSale && (
                  <span className="absolute top-3 left-3 bg-[#e62020] text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm z-10">
                    Sale
                  </span>
                )}
                {/* Sold out overlay */}
                {!isInStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                    <span className="bg-white border border-gray-200 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      Sold Out
                    </span>
                  </div>
                )}
                {/* Wishlist Button */}
                <div className="absolute right-3 top-3 z-20 text-[#a0a0a0] transition-colors hover:text-[#111]" title="Add to wishlist">
                  <WishlistButton
                    productData={{
                      handle: product.handle,
                      id: product.id,
                      title: product.title || "",
                      imageUrl: activeImage || null,
                      imageAlt: product.title || null,
                      price: variantPricing.minCalculated ?? 0,
                      compareAtPrice: variantPricing.minOriginal,
                      currencyCode: product.variants?.[0]?.calculated_price?.currency_code || "PHP",
                      availableForSale: isInStock,
                      vendor: brandName,
                      variantId: selectedVariant?.id || product.id,
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-transparent border-none p-0 shadow-none hover:bg-transparent [&_svg]:!w-6 [&_svg]:!h-6"
                  />
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {allImages.map((imgUrl, index) => {
                    const isActive = activeImage === imgUrl
                    return (
                      <button
                        key={index}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                          isActive ? "border-[#111]" : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt="Thumbnail"
                          fill
                          className="object-cover bg-[#f5f5f5]"
                          sizes="64px"
                          unoptimized
                        />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Brand */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                {brandName}
              </p>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[#111] leading-tight mb-3">
                {product.title}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-2 flex-wrap mb-5">
                {variantPricing.hasPrice && (
                  <>
                    {variantPricing.isOnSale && variantPricing.formattedOriginal ? (
                      <>
                        <span className="text-xl font-extrabold text-[#e62020]">
                          {variantPricing.formattedCalculated}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {variantPricing.formattedOriginal}
                        </span>
                        {variantPricing.discountPct && (
                          <span className="text-xs font-bold text-[#e62020] bg-red-50 px-1.5 py-0.5 rounded">
                            -{variantPricing.discountPct}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xl font-extrabold text-[#111]">
                        {variantPricing.formattedCalculated}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Variant Options */}
              {productOptions.length > 0 && (
                <div className="space-y-4 mb-5">
                  {productOptions.map((option) => {
                    const optTitle = option.title || option.id
                    return (
                      <div key={option.id}>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                          {optTitle}: <span className="text-[#111]">{selectedOptions[optTitle]}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {option.values?.map((val) => {
                            const isSelected = selectedOptions[optTitle] === val.value
                            return (
                              <button
                                key={val.id}
                                onClick={() => handleOptionChange(optTitle, val.value)}
                                className={`min-w-[48px] px-3 py-2.5 text-sm font-medium border rounded-lg transition-all duration-150 ${
                                  isSelected
                                    ? "border-[#111] bg-[#111] text-white"
                                    : "border-gray-200 bg-white text-[#111] hover:border-gray-400"
                                }`}
                              >
                                {val.value}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Quantity
                </p>
                <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#111] hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-[#111] border-x border-gray-200 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#111] hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !isInStock || !selectedVariant}
                className={`w-full py-3.5 rounded-lg text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : isInStock && selectedVariant
                    ? "bg-[#111] text-white hover:bg-[#333] active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    Added to Cart
                  </>
                ) : !isInStock ? (
                  "Sold Out"
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                    Add to Cart
                  </>
                )}
              </button>

              {/* View Product Link */}
              <LocalizedClientLink
                href={`/products/${product.handle}`}
                className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#111] transition-colors"
              >
                View Full Details
                <ExternalLink className="w-3 h-3" />
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
