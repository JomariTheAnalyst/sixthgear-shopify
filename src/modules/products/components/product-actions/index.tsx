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
import { useRouter } from "next/navigation"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { useCartLimitModal } from "@lib/context/cart-limit-modal-context"
import { isColorOption, isSizeOption } from "@lib/util/variant-helpers"
import ColorSwatch from "./color-swatch"
import SizeSelector from "./size-selector"
import GenericOptionSelector from "./generic-option-selector"
import WishlistButton from "@modules/wishlist/components/wishlist-button"
import {
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  Shield,
  Award,
  Truck,
  RotateCcw,
  Lock,
  CreditCard,
  ChevronDown,
  Check,
  AlertTriangle,
  X as XIcon,
} from "lucide-react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  inventoryMap?: Record<string, number>
}

const optionsAsKeymap = (
  variantOptions: any
) => {
  if (!variantOptions) return {}
  if (Array.isArray(variantOptions)) {
    return variantOptions.reduce((acc: Record<string, string>, varopt: any) => {
      acc[varopt.option_id] = varopt.value
      return acc
    }, {})
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

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
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

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // check if the selected options produce a valid variant
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

  // check if the selected variant is in stock
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

  // Zustand store sync
  const setCart = useCartStore((s) => s.setCart)
  const setCartId = useCartStore((s) => s.setCartId)

  // add the selected variant to the cart
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
      }
      openCart()
    } catch (error: any) {
      if (error.message?.startsWith("CART_LIMIT_EXCEEDED:")) {
        const [, currentCount, limit] = error.message.split(":")
        showCartLimitModal(parseInt(currentCount), parseInt(limit))
      } else {
        console.error("Failed to add to cart:", error)
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return null
    // Add to cart then immediately open cart for checkout
    await handleAddToCart()
  }

  // Quantity handlers
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

  // Inventory status computation
  const inventoryStatus = useMemo(() => {
    if (!selectedVariant) return { status: "unavailable" as const, message: "Select options" }
    if (!inStock) return { status: "out-of-stock" as const, message: "Out of stock" }

    let qty = selectedVariant.inventory_quantity
    if (inventoryMap && selectedVariant.id in inventoryMap) {
      qty = inventoryMap[selectedVariant.id]
    }

    if (qty !== null && qty !== undefined && qty <= 5) {
      return { status: "low-stock" as const, message: `Only ${qty} left` }
    }
    return { status: "in-stock" as const, message: "In stock" }
  }, [selectedVariant, inStock, inventoryMap])

  // Render the appropriate selector based on option type
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

    if (isColorOption(option)) {
      return <ColorSwatch key={option.id} {...commonProps} />
    }

    if (isSizeOption(option)) {
      return <SizeSelector key={option.id} {...commonProps} />
    }

    return <GenericOptionSelector key={option.id} {...commonProps} />
  }

  const inventoryStatusConfig = {
    "in-stock": {
      icon: Check,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      iconColor: "text-green-600",
    },
    "low-stock": {
      icon: AlertTriangle,
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      iconColor: "text-amber-600",
    },
    "out-of-stock": {
      icon: XIcon,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconColor: "text-red-600",
    },
    "unavailable": {
      icon: XIcon,
      bgColor: "bg-slate-100",
      textColor: "text-slate-600",
      iconColor: "text-slate-500",
    },
  }

  const StatusIcon = inventoryStatusConfig[inventoryStatus.status].icon

  return (
    <>
      <div className="flex flex-col gap-y-6" ref={actionsRef}>
        {/* Price */}
        <ProductPrice product={product} variant={selectedVariant} />

        {/* Value Props */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Shield, label: "Authentic Parts", description: "100% Genuine" },
            { icon: Award, label: "Warranty", description: "Full coverage" },
            { icon: Truck, label: "Fast Delivery", description: "3-5 days" },
            { icon: RotateCcw, label: "Easy Returns", description: "Hassle-free" },
          ].map(({ icon: Icon, label, description }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5 text-slate-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-600">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Variant Options */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-5 pt-2">
            {(product.options || []).map((option) =>
              renderOptionSelector(option)
            )}
          </div>
        )}

        {/* Inventory Status Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${inventoryStatusConfig[inventoryStatus.status].bgColor}`}
        >
          <StatusIcon
            className={`w-4 h-4 ${inventoryStatusConfig[inventoryStatus.status].iconColor}`}
            aria-hidden="true"
          />
          <span
            className={`text-sm font-medium ${inventoryStatusConfig[inventoryStatus.status].textColor}`}
          >
            {inventoryStatus.message}
          </span>
        </div>

        {/* Quantity & Buttons */}
        <div className="space-y-4 pt-2">
          {/* Quantity Selector */}
          <div className="flex items-center">
            <label className="text-sm font-medium text-slate-900 mr-4">Quantity</label>
            <div className="flex items-center border-2 border-slate-300 rounded-lg">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1 || disabled || isAdding}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 rounded-l-md"
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
                className="w-14 h-10 text-center text-slate-900 font-medium border-x-2 border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 disabled:opacity-40"
                aria-label="Quantity"
              />
              <button
                onClick={increaseQuantity}
                disabled={disabled || isAdding}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 rounded-r-md"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              ref={addToCartRef}
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              data-testid="add-product-button"
            >
              {isAdding ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                  <span>{!inStock ? "Out of Stock" : "Add to Cart"}</span>
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isAddToCartDisabled}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              <Zap className="w-5 h-5" aria-hidden="true" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Wishlist Button */}
          {product.handle && (
            <WishlistButton
              productData={{
                handle: product.handle,
                id: product.id,
                title: product.title || "",
                imageUrl: product.thumbnail || product.images?.[0]?.url || null,
                imageAlt: product.title || null,
                price: product.variants?.[0]?.calculated_price?.calculated_amount ?? 0,
                compareAtPrice: product.variants?.[0]?.calculated_price?.original_amount ?? null,
                currencyCode: product.variants?.[0]?.calculated_price?.currency_code || "php",
                availableForSale: inStock,
                vendor: product.collection?.title || product.subtitle || "No Brand",
                variantId: product.variants?.[0]?.id || product.id,
              }}
              showLabel
              className="w-full border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            />
          )}
        </div>

        {/* Shipping Info */}
        <ShippingInfoBlock />

        {/* Trust Badges */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Secure Payment</span>
            <div className="flex items-center gap-1.5">
              {["Visa", "MC", "Amex", "PayPal", "Apple"].map((method) => (
                <div
                  key={method}
                  className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[11px] font-medium"
                  aria-label={method}
                >
                  {method}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2-year manufacturer warranty against defects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Secure Checkout</span>
            </div>
          </div>
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


/* ─── Inline Shipping Info ─── */
function ShippingInfoBlock() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-slate-900">Shipping</p>
            <p className="text-sm text-slate-600">3-5 business days delivery in Metro Manila</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-slate-900">Returns</p>
            <p className="text-sm text-slate-600">Easy returns within warranty period</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 border-t border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900"
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-medium text-slate-700">More details</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-slate-200 bg-white space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Shipping Details</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Standard: 3-5 business days</li>
              <li>• Provincial: 5-7 business days</li>
              <li>• Cash on Delivery available</li>
              <li>• Tracking provided for all orders</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Return Policy</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Returns accepted for defective items</li>
              <li>• Item must be unused and in original packaging</li>
              <li>• Contact us within 7 days of delivery</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
