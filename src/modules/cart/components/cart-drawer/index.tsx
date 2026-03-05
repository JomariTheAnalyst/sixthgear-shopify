"use client"

import { useEffect, useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"
import { convertToLocale } from "@lib/util/money"
import { mapShopifyCartToStoreCart } from "@lib/util/map-shopify-cart"
import {
  updateLineItem,
  forceNewCart,
  getCheckoutUrl,
} from "@lib/data/cart"
import {
  getStockStatus,
  getStockLabel,
  isItemOutOfStock,
} from "@lib/util/cart-helpers"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DeleteButton from "@modules/common/components/delete-button"
import Thumbnail from "@modules/products/components/thumbnail"
import { useRouter, useParams } from "next/navigation"
import { useCartStore } from "@lib/cart"
import { Loader2, Check, X, ShoppingBag, Minus, Plus } from "lucide-react"

type CartDrawerProps = {
  cart: HttpTypes.StoreCart | null
}

type CheckoutState = "idle" | "loading" | "success" | "error"

export default function CartDrawer({ cart }: CartDrawerProps) {
  const { isCartOpen, closeCart } = useCartDrawer()
  const {
    isSelected,
    toggleItem,
    selectAll,
    deselectAll,
    selectedItems,
    hasSelectedItems,
    selectedCount,
  } = useSelectedItems()
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle")
  const [clearingCart, setClearingCart] = useState(false)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params.countryCode as string) || "ph"

  const shopifyCart = useCartStore((s) => s.cart)
  const setShopifyCart = useCartStore((s) => s.setCart)

  const activeCart = useMemo(
    () =>
      ((mapShopifyCartToStoreCart(shopifyCart) as HttpTypes.StoreCart | null) ??
        cart),
    [shopifyCart, cart]
  )

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }
    if (isCartOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isCartOpen, closeCart])

  // Clean up stale selected items when cart changes
  useEffect(() => {
    if (activeCart?.items) {
      const currentItemIds = new Set(activeCart.items.map((item) => item.id))
      const staleIds = Array.from(selectedItems).filter(
        (id) => !currentItemIds.has(id)
      )
      if (staleIds.length > 0) {
        const validIds = Array.from(selectedItems).filter((id) =>
          currentItemIds.has(id)
        )
        if (validIds.length !== selectedItems.size) {
          if (validIds.length === 0) {
            deselectAll()
          } else {
            selectAll(validIds)
          }
        }
      }
    }
  }, [activeCart?.items, selectedItems, deselectAll, selectAll])

  const totalItems =
    activeCart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = activeCart?.subtotal ?? 0

  const selectedTotal = useMemo(() => {
    if (!activeCart?.items) return 0
    const filtered = activeCart.items.filter((item) =>
      selectedItems.has(item.id)
    )
    return filtered.reduce((sum, item) => {
      return sum + (item.subtotal || item.total || 0)
    }, 0)
  }, [activeCart?.items, selectedItems])

  const actualSelectedCount =
    activeCart?.items?.filter((item) => selectedItems.has(item.id)).length || 0

  const inStockItems =
    activeCart?.items?.filter((item) => !isItemOutOfStock(item)) || []
  const inStockItemIds = inStockItems.map((item) => item.id)
  const allSelected =
    inStockItemIds.length > 0 &&
    inStockItemIds.every((id) => selectedItems.has(id))

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll()
    } else {
      selectAll(inStockItemIds)
    }
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingItem(itemId)
    try {
      const updatedCart = await updateLineItem({
        lineId: itemId,
        quantity: newQuantity,
      })
      if (updatedCart) {
        setShopifyCart(updatedCart as any)
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setUpdatingItem(null)
    }
  }

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault()
    setCheckoutState("loading")
    try {
      const url = await getCheckoutUrl()
      setCheckoutState("success")
      setTimeout(() => {
        window.location.href = url
      }, 1500)
    } catch (error) {
      console.error("[checkout] Failed to get checkout URL:", error)
      setCheckoutState("error")
      setTimeout(() => {
        setCheckoutState("idle")
      }, 2000)
    }
  }

  const handleClearCart = async () => {
    if (
      !confirm(
        "Are you sure you want to clear your cart? This will create a fresh cart and remove all items."
      )
    )
      return

    setClearingCart(true)
    try {
      await forceNewCart(countryCode)
      window.location.reload()
    } catch (error) {
      console.error("Failed to clear cart:", error)
      alert("Failed to clear cart. Please try again.")
    } finally {
      setClearingCart(false)
    }
  }

  const handleContinueShopping = () => {
    closeCart()
    router.push(`/${countryCode}/store`)
  }

  // Parse variant options from subtitle or variant title
  const getVariantPills = (item: HttpTypes.StoreCartLineItem) => {
    const optionsFromVariant = item.variant?.options
    if (optionsFromVariant && optionsFromVariant.length > 0) {
      return optionsFromVariant.map((opt) => ({
        label: opt.option?.title || "",
        value: opt.value || "",
      }))
    }
    // Fallback: split the variant title by " / "
    const title = item.variant?.title || item.subtitle || ""
    if (!title || title === "Default Title") return []
    return title.split(" / ").map((part, i) => ({
      label: "",
      value: part.trim(),
    }))
  }

  const checkoutBtnClass = (() => {
    switch (checkoutState) {
      case "loading":
        return "bg-[#0a0a0a] text-white"
      case "success":
        return "bg-green-600 text-white"
      case "error":
        return "bg-red-600 text-white"
      default:
        return "bg-[#0a0a0a] hover:bg-gray-800 text-white"
    }
  })()

  const hasItems =
    activeCart && activeCart.items && activeCart.items.length > 0

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[460px] bg-white z-[101] transform transition-transform duration-300 ease-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900">
              Your Cart
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {hasItems && (
              <>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-500 hover:text-gray-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    disabled={inStockItems.length === 0}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  {allSelected ? "Deselect" : "Select All"}
                </label>
                <button
                  onClick={handleClearCart}
                  disabled={clearingCart}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Clear cart"
                >
                  {clearingCart ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Clear"
                  )}
                </button>
                <div className="w-px h-4 bg-gray-200" />
              </>
            )}
            <button
              onClick={closeCart}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Items ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {hasItems ? (
            <div className="flex flex-col gap-4">
              {activeCart.items
                .sort((a, b) =>
                  (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                )
                .map((item) => {
                  const isOnSale =
                    item.compare_at_unit_price &&
                    item.compare_at_unit_price > (item.unit_price ?? 0)
                  const isUpdating = updatingItem === item.id
                  const stockStatus = getStockStatus(item)
                  const outOfStock = isItemOutOfStock(item)
                  const inventoryQty =
                    item.variant?.inventory_quantity || 0
                  const pills = getVariantPills(item)
                  const unitPrice = item.unit_price ?? 0
                  const lineTotal = unitPrice * item.quantity

                  return (
                    <div
                      key={item.id}
                      className={`relative bg-white border border-gray-200 rounded-2xl p-4 transition-all ${
                        outOfStock ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Checkbox */}
                        <div className="flex items-start pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected(item.id)}
                            onChange={() =>
                              toggleItem(item.id, outOfStock)
                            }
                            disabled={outOfStock}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </div>

                        {/* Image */}
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-20 h-20 bg-gray-50 rounded-xl shrink-0 overflow-hidden"
                          onClick={closeCart}
                        >
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </LocalizedClientLink>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <LocalizedClientLink
                              href={`/products/${item.product_handle}`}
                              className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 leading-snug"
                              onClick={closeCart}
                            >
                              {item.title}
                            </LocalizedClientLink>
                            <DeleteButton
                              id={item.id}
                              className="!text-gray-300 hover:!text-red-500 shrink-0"
                            />
                          </div>

                          {/* Variant pills */}
                          {pills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {pills.map((pill, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-md"
                                >
                                  {pill.label && (
                                    <span className="text-gray-400 mr-1">
                                      {pill.label}:
                                    </span>
                                  )}
                                  {pill.value}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Stock badges */}
                          {stockStatus === "out_of_stock" && (
                            <span className="inline-flex mt-2 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wide rounded">
                              {getStockLabel(stockStatus)}
                            </span>
                          )}
                          {stockStatus === "low_stock" && (
                            <span className="inline-flex mt-2 px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wide rounded">
                              {getStockLabel(stockStatus, inventoryQty)}
                            </span>
                          )}

                          {/* Quantity + Price row */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 || isUpdating
                                }
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                                {isUpdating ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={isUpdating}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">
                                {convertToLocale({
                                  amount: unitPrice,
                                  currency_code:
                                    activeCart.currency_code,
                                })}{" "}
                                each
                              </p>
                              <p
                                className={`text-base font-bold ${
                                  isOnSale
                                    ? "text-red-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {convertToLocale({
                                  amount: lineTotal,
                                  currency_code:
                                    activeCart.currency_code,
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            /* Empty Cart */
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[240px]">
                Looks like you haven&apos;t added anything yet. Let&apos;s
                find something for you.
              </p>
              <LocalizedClientLink
                href="/store"
                onClick={closeCart}
                className="px-8 py-3 bg-[#0a0a0a] text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </LocalizedClientLink>
            </div>
          )}
        </div>

        {/* ── Footer (Summary + Buttons) ── */}
        {hasItems && (
          <div className="border-t border-gray-100 bg-white px-6 py-5 shrink-0 space-y-4">
            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {convertToLocale({
                    amount: selectedTotal,
                    currency_code: activeCart.currency_code,
                  })}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="text-base font-bold text-gray-900">
                  Total
                </span>
                <span className="text-base font-bold text-gray-900">
                  {convertToLocale({
                    amount: selectedTotal,
                    currency_code: activeCart.currency_code,
                  })}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Shipping fee is calculated at checkout.
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={
                checkoutState === "loading" ||
                checkoutState === "success" ||
                !hasSelectedItems
              }
              className={`w-full h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:cursor-not-allowed ${checkoutBtnClass} ${
                !hasSelectedItems && checkoutState === "idle"
                  ? "!bg-gray-200 !text-gray-400"
                  : ""
              }`}
            >
              {checkoutState === "loading" && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              )}
              {checkoutState === "success" && (
                <>
                  <Check className="w-4 h-4" />
                  Redirecting...
                </>
              )}
              {checkoutState === "error" && (
                <>
                  <X className="w-4 h-4" />
                  Failed — Try Again
                </>
              )}
              {checkoutState === "idle" &&
                (hasSelectedItems ? "Checkout" : "Select items to checkout")}
            </button>

            {/* Continue Shopping */}
            <button
              onClick={handleContinueShopping}
              className="w-full h-11 rounded-full border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
