"use client"

import { addToCart } from "@lib/data/cart"
import { useCartStore } from "@lib/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import StoreInfoDrawer from "../store-info-drawer"
import { useRouter } from "next/navigation"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { useCartLimitModal } from "@lib/context/cart-limit-modal-context"
import { useLenis } from "@modules/common/components/lenis-provider"
import {
  isColorOption,
  isSizeOption,
  optionHasVariantImages,
} from "@lib/util/variant-helpers"
import { resolveSizeChart } from "@lib/size-chart"
import ColorSwatch from "./color-swatch"
import SizeSelector from "./size-selector"
import GenericOptionSelector from "./generic-option-selector"
import VisualOptionSelector from "./visual-option-selector"
import WishlistButton from "@modules/wishlist/components/wishlist-button"
import { toast } from "sonner"
import {
  ShoppingCart,
  Minus,
  Plus,
  Check,
  AlertTriangle,
  X as XIcon,
  Heart,
  Share2,
  MessageCircle,
  Truck,
  RotateCcw,
  Shield,
  ChevronDown,
  Store,
} from "lucide-react"

const ACTIVATE_SIZE_GUIDE_EVENT = "product:activate-size-guide-tab"
const PICKUP_PROOF_ITEMS = [
 
]

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  inventoryMap?: Record<string, number>
}

const optionsAsKeymap = (variantOptions: any) => {
  if (!variantOptions) return {}
  if (Array.isArray(variantOptions)) {
    return variantOptions.reduce(
      (acc: Record<string, string>, varopt: any) => {
        acc[varopt.option_id] = varopt.value
        return acc
      },
      {}
    )
  }
  return variantOptions
}

export default function ProductActions({
  product,
  disabled,
  inventoryMap,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lenis = useLenis()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string
  const showsVariantOptions = (product.variants?.length ?? 0) > 1
  const sizeChart = useMemo(
    () => resolveSizeChart((product as any).shopifyMetafields),
    [product]
  )
  const hasSizeGuide = sizeChart.type !== "none"
  const hasRenderedSizeOption = useMemo(
    () => showsVariantOptions && (product.options || []).some((option) => isSizeOption(option)),
    [product.options, showsVariantOptions]
  )

  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const handleSizeGuideClick = () => {
    const detailsTab = document.getElementById("details-tab")

    if (detailsTab) {
      if (lenis) {
        lenis.scrollTo(detailsTab, { offset: -120 })
      } else {
        detailsTab.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    window.dispatchEvent(new CustomEvent(ACTIVATE_SIZE_GUIDE_EVENT))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // Dispatch global event so the Image Gallery sibling can update
  useEffect(() => {
    if (selectedVariant && (selectedVariant.image as any)?.url) {
      window.dispatchEvent(
        new CustomEvent("variantImageSelected", {
          detail: { imageUrl: (selectedVariant.image as any).url },
        })
      )
    }
  }, [selectedVariant])

  const inStock = useMemo(() => {
    if (!selectedVariant) {
      if (inventoryMap && Object.keys(inventoryMap).length > 0) {
        return Object.values(inventoryMap).some((qty) => qty > 0)
      }

      return (
        product.variants?.some((v) => {
          if (v.allow_backorder) return true
          if (!v.manage_inventory) return true
          if (
            v.inventory_quantity !== null &&
            v.inventory_quantity !== undefined
          ) {
            return v.inventory_quantity > 0
          }
          return false
        }) ?? false
      )
    }

    if (inventoryMap && selectedVariant.id in inventoryMap) {
      const quantity = inventoryMap[selectedVariant.id]
      return quantity > 0
    }

    if (selectedVariant.allow_backorder) {
      return true
    }

    if (!selectedVariant.manage_inventory) {
      return true
    }

    if (
      selectedVariant.inventory_quantity !== null &&
      selectedVariant.inventory_quantity !== undefined
    ) {
      return selectedVariant.inventory_quantity > 0
    }

    return false
  }, [selectedVariant, inventoryMap, product.variants])

  const actionsRef = useRef<HTMLDivElement>(null)
  const addToCartRef = useRef<HTMLButtonElement>(null)
  const inView = useIntersection(actionsRef, "0px")
  const { openCart } = useCartDrawer()
  const { showCartLimitModal } = useCartLimitModal()

  const setCart = useCartStore((s) => s.setCart)
  const setCartId = useCartStore((s) => s.setCartId)

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      const updatedCart = await addToCart({
        variantId: selectedVariant.id,
        quantity: quantity,
        countryCode,
      })
      if (updatedCart) {
        setCart(updatedCart as any)
        setCartId(updatedCart.id)
        toast.success("Added to cart", {
          description: `${quantity}x ${product.title} has been added to your cart.`
        })
      }
      openCart()
    } catch (error: any) {
      if (error.message?.startsWith("CART_LIMIT_EXCEEDED:")) {
        const [, currentCount, limit] = error.message.split(":")
        showCartLimitModal(parseInt(currentCount), parseInt(limit))
      } else {
        console.error(error)
        toast.error("Failed to add to cart", {
          description: "Please try again later."
        })
      }
    } finally {
      setIsAdding(false)
    }
  }



  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    const maxQty =
      inventoryMap && selectedVariant?.id
        ? inventoryMap[selectedVariant.id] || 99
        : selectedVariant?.inventory_quantity || 99
    if (quantity < maxQty) setQuantity(quantity + 1)
  }

  const isAddToCartDisabled =
    !inStock ||
    !selectedVariant ||
    !!disabled ||
    isAdding ||
    !isValidVariant

  const inventoryStatus = useMemo(() => {
    if (!selectedVariant)
      return { status: "unavailable" as const, message: "Select options" }
    if (!inStock)
      return { status: "out-of-stock" as const, message: "Out of stock" }

    let qty = selectedVariant.inventory_quantity
    if (inventoryMap && selectedVariant.id in inventoryMap) {
      qty = inventoryMap[selectedVariant.id]
    }

    if (qty !== null && qty !== undefined && qty <= 5) {
      return { status: "low-stock" as const, message: `Only ${qty} left` }
    }
    return { status: "in-stock" as const, message: "In stock" }
  }, [selectedVariant, inStock, inventoryMap])

  const renderOptionSelector = (option: HttpTypes.StoreProductOption) => {
    const commonProps = {
      option,
      variants: product.variants ?? undefined,
      current: options[option.id],
      updateOption: setOptionValue,
      currentSelections: options,
      disabled: disabled || isAdding,
      inventoryMap,
    }

    if (isSizeOption(option)) {
      return (
        <SizeSelector
          key={option.id}
          {...commonProps}
          onSizeGuideClick={handleSizeGuideClick}
        />
      )
    }

    if (optionHasVariantImages(option, product.variants ?? undefined)) {
      return <VisualOptionSelector key={option.id} {...commonProps} />
    }

    if (isColorOption(option)) {
      return <ColorSwatch key={option.id} {...commonProps} />
    }

    return <GenericOptionSelector key={option.id} {...commonProps} />
  }

  const statusColors = {
    "in-stock": "text-green-600",
    "low-stock": "text-amber-600",
    "out-of-stock": "text-red-600",
    unavailable: "text-gray-400",
  }

  const statusIcons = {
    "in-stock": Check,
    "low-stock": AlertTriangle,
    "out-of-stock": XIcon,
    unavailable: XIcon,
  }

  const StatusIcon = statusIcons[inventoryStatus.status]

  return (
    <>
      <StoreInfoDrawer
        open={isStoreInfoOpen}
        onClose={() => setIsStoreInfoOpen(false)}
      />

      <div className="flex flex-col gap-y-5" ref={actionsRef}>
        {/* Price */}
        <ProductPrice product={product} variant={selectedVariant} />

        {/* Variant Options */}
        {showsVariantOptions && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) =>
              renderOptionSelector(option)
            )}
          </div>
        )}

        {hasSizeGuide && !hasRenderedSizeOption && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSizeGuideClick}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Size Guide
            </button>
          </div>
        )}

        {/* Inventory Status */}
        <div className="flex items-center gap-1.5">
          <StatusIcon
            className={`w-4 h-4 ${statusColors[inventoryStatus.status]}`}
            aria-hidden="true"
          />
          <span
            className={`text-sm font-medium ${statusColors[inventoryStatus.status]}`}
          >
            {inventoryStatus.message}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm">
              <Store className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 space-y-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  In-store pickup available
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Pickup is available at our store. Choose pickup at checkout.
                </p>
              </div>
              <div className="space-y-1.5">
                {PICKUP_PROOF_ITEMS.length > 0 && (
                  <ul className="space-y-1.5">
                    {PICKUP_PROOF_ITEMS.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm leading-6 text-gray-700"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F16D34]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => setIsStoreInfoOpen(true)}
                  className="inline-flex items-center gap-2 pt-1 text-sm font-medium text-gray-700 transition-colors hover:text-gray-950"
                >
                  <span>View store information</span>
                  <ChevronDown
                    className="h-4 w-4 -rotate-90"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity + Actions side-by-side */}
        <div className="flex items-center gap-3 w-full">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 overflow-hidden h-12">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || disabled || isAdding}
              className="w-10 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none h-full"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                setQuantity(Math.max(1, val))
              }}
              min={1}
              disabled={disabled || isAdding}
              className="w-12 h-full text-center text-black font-medium border-x border-gray-300 focus:outline-none disabled:opacity-40 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent"
              aria-label="Quantity"
            />
            <button
              onClick={increaseQuantity}
              disabled={disabled || isAdding}
              className="w-10 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none h-full"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            ref={addToCartRef}
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled}
            className="flex-1 flex items-center justify-center gap-2 px-6 h-12 bg-[#F16D34] text-white font-semibold hover:bg-[#d65f2c] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none"
            data-testid="add-product-button"
          >
            {isAdding ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <span className="text-[15px]">{!inStock ? "Out of Stock" : "Add to cart"}</span>
            )}
          </button>
        </div>

        {/* Utility Action Row â€” Chat, Wishlist, Share */}
        <div className="flex items-center justify-center gap-6 border-t border-gray-200 pt-5 mt-6 pb-2">
          <a
            href="/ph/account/support"
            className="flex items-center gap-2 text-sm text-gray-700 font-medium hover:opacity-70 transition-opacity"
          >
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <span>Chat</span>
          </a>

          <div className="w-px h-4 bg-gray-200" />

          {product.handle && (
            <WishlistButton
              productData={{
                handle: product.handle,
                id: product.id,
                title: product.title || "",
                imageUrl:
                  product.thumbnail ||
                  product.images?.[0]?.url ||
                  null,
                imageAlt: product.title || null,
                price:
                  product.variants?.[0]?.calculated_price
                    ?.calculated_amount ?? 0,
                compareAtPrice:
                  product.variants?.[0]?.calculated_price
                    ?.original_amount ?? null,
                currencyCode:
                  product.variants?.[0]?.calculated_price
                    ?.currency_code || "php",
                availableForSale: inStock,
                vendor:
                  product.collection?.title ||
                  product.subtitle ||
                  "No Brand",
                variantId:
                  product.variants?.[0]?.id || product.id,
              }}
              showLabel
              className="flex items-center gap-2 text-sm text-gray-700 font-medium hover:opacity-70 transition-opacity border-none bg-transparent hover:bg-transparent px-0"
            />
          )}

          <div className="w-px h-4 bg-gray-200" />

          <button
            className="flex items-center gap-2 text-sm text-gray-700 font-medium hover:opacity-70 transition-opacity"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.title || "",
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
              }
            }}
          >
            <Share2 className="w-4 h-4 text-gray-500" />
            <span>Share</span>
          </button>
        </div>

        {/* Mobile Sticky Add to Cart */}
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
