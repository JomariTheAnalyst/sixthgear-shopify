"use client"

import { useCartStore } from "@lib/cart"
import { useEffect, useState } from "react"

/**
 * Checkout page - Shopify Hosted Checkout
 *
 * Reads the cart from Zustand and redirects to Shopify's
 * hosted checkout via cart.checkoutUrl.
 */
export default function CheckoutClient() {
  const { cart } = useCartStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cart) {
      setError("Your cart is empty. Please add items before checking out.")
      return
    }

    const url = cart.checkoutUrl
    if (!url) {
      setError("Unable to start checkout. Please try again.")
      return
    }

    window.location.href = url
  }, [cart])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{error}</h1>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-gray-900 text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Back to Store
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-10 w-10 text-gray-600 mx-auto" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-gray-600 font-medium">Redirecting to secure checkout...</p>
      </div>
    </div>
  )
}
