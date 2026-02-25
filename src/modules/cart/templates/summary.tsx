"use client"

import Divider from "@modules/common/components/divider"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"
import { useMemo, useState } from "react"
import { convertToLocale } from "@lib/util/money"
import { useCartStore } from "@lib/cart"

type SummaryProps = {
  cart: any
}

const Summary = ({ cart }: SummaryProps) => {
  const { selectedItems, hasSelectedItems } = useSelectedItems()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  // Get Shopify cart from Zustand store for checkout URL
  const shopifyCart = useCartStore((s) => s.cart)

  // Calculate selected items total
  const selectedTotal = useMemo(() => {
    if (!cart?.items) return 0

    return cart.items
      .filter((item: any) => selectedItems.has(item.id))
      .reduce((sum: number, item: any) => {
        const itemPrice =
          item.original_total ?? item.total ?? item.subtotal ?? 0
        return sum + itemPrice
      }, 0)
  }, [cart?.items, selectedItems])

  // Calculate actual selected count from cart items
  const actualSelectedCount = useMemo(() => {
    if (!cart?.items) return 0
    return cart.items.filter((item: any) => selectedItems.has(item.id)).length
  }, [cart?.items, selectedItems])

  // Calculate total in cart
  const cartTotal = cart?.subtotal || 0

  // Get discount, shipping, and tax from cart
  const discountTotal = cart?.discount_total || 0
  const shippingTotal = cart?.shipping_total || 0
  const taxTotal = cart?.tax_total || 0

  // Calculate final total
  const finalTotal = selectedTotal - discountTotal + shippingTotal + taxTotal

  const formatPrice = (amount: number) => {
    return convertToLocale({
      amount,
      currency_code: cart?.currency_code || "PHP",
    })
  }

  const handleCheckout = () => {
    setCheckoutError(null)

    const url = shopifyCart?.checkoutUrl
    if (!url) {
      setCheckoutError("Unable to start checkout. Please try again.")
      return
    }

    setIsRedirecting(true)
    window.location.href = url
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-2xl font-bold leading-[2.75rem]">Summary</h2>
      <Divider />

      {/* Dual Summary: Selected vs Total */}
      <div className="flex flex-col gap-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            Selected Items ({actualSelectedCount})
          </span>
          <span className="font-semibold text-gray-900">
            {formatPrice(selectedTotal)}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <span className="text-gray-500">
            Total in Cart ({cart?.items?.length || 0})
          </span>
          <span className="text-gray-400">{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {/* Order Total Section */}
      <div>
        <div className="flex flex-col gap-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <span>Subtotal (excl. shipping and taxes)</span>
            <span data-testid="cart-subtotal">
              {formatPrice(selectedTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span data-testid="cart-shipping">
              {formatPrice(shippingTotal)}
            </span>
          </div>
          {discountTotal > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="text-green-600" data-testid="cart-discount">
                - {formatPrice(discountTotal)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="flex gap-x-1 items-center">Taxes</span>
            <span data-testid="cart-taxes">{formatPrice(taxTotal)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 my-4" />
        <div className="flex items-center justify-between text-gray-900 mb-2 text-base font-medium">
          <span>Total</span>
          <span className="text-xl font-bold" data-testid="cart-total">
            {formatPrice(finalTotal)}
          </span>
        </div>
        <div className="h-px w-full border-b border-gray-200 mt-4" />
      </div>

      {/* Checkout Error */}
      {checkoutError && (
        <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded">
          {checkoutError}
        </div>
      )}

      {/* Checkout Button — Shopify Hosted Checkout */}
      {hasSelectedItems ? (
        <button
          onClick={handleCheckout}
          disabled={isRedirecting}
          className="w-full h-12 bg-gray-900 text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          data-testid="checkout-button"
        >
          {isRedirecting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Redirecting to checkout…
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </button>
      ) : (
        <button
          className="w-full h-12 bg-gray-300 text-gray-500 font-bold uppercase tracking-wider cursor-not-allowed"
          disabled
          data-testid="checkout-button-disabled"
        >
          Select items to checkout
        </button>
      )}
    </div>
  )
}

export default Summary
