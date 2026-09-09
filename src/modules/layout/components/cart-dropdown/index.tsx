"use client"

import { HttpTypes } from "@medusajs/types"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const { openCart } = useCartDrawer()
  const pathname = usePathname()
  
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const itemRef = useRef<number>(totalItems || 0)

  // Auto-open drawer when items are added (not on cart page)
  useEffect(() => {
    if (itemRef.current !== totalItems && totalItems > itemRef.current && !pathname.includes("/cart")) {
      openCart()
    }
    itemRef.current = totalItems
  }, [totalItems, pathname, openCart])

  return (
    <div className="h-full z-50 flex items-center">
      <button
        type="button"
        onClick={openCart}
        className="relative inline-flex h-10 w-10 items-center justify-center text-gray-900 transition-colors hover:text-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]"
        data-testid="nav-cart-link"
        aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} ${totalItems === 1 ? "item" : "items"}` : ""}`}
        title="Cart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>
    </div>
  )
}

export default CartDropdown
