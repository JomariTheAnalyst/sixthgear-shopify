"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useWishlistStore, WishlistItem } from "@lib/wishlist-store"

type WishlistButtonProps = {
  /** Product data needed to save into localStorage */
  productData: {
    handle: string
    id: string
    title: string
    imageUrl: string | null
    imageAlt: string | null
    price: number
    compareAtPrice: number | null
    currencyCode: string
    availableForSale: boolean
    vendor: string
    variantId: string
  }
  className?: string
  showLabel?: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export default function WishlistButton({
  productData,
  className = "",
  showLabel = false,
  activeLabel = "Saved to Wishlist",
  inactiveLabel = "Add to Wishlist",
}: WishlistButtonProps) {
  const hydrated = useWishlistStore((state) => state.hydrated)
  const hydrate = useWishlistStore((state) => state.hydrate)
  const toggle = useWishlistStore((state) => state.toggle)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const [isPopping, setIsPopping] = useState(false)

  useEffect(() => {
    if (!hydrated) hydrate()
  }, [hydrate, hydrated])

  const active = hydrated && isInWishlist(productData.handle)

  const label = useMemo(
    () => (active ? activeLabel : inactiveLabel),
    [active, activeLabel, inactiveLabel]
  )

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setIsPopping(true)

    const wishlistItem: WishlistItem = {
      ...productData,
      addedAt: Date.now(),
    }
    toggle(wishlistItem)

    if (active) {
      toast.success("Removed from Wishlist", {
        description: `${productData.vendor || "Sixthgear"} ${productData.title}`,
      })
    } else {
      toast.success("Added to Wishlist", {
        description: `${productData.vendor || "Sixthgear"} ${productData.title}`,
      })
    }

    window.setTimeout(() => setIsPopping(false), 180)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
        showLabel ? "gap-2 px-4 py-2.5 rounded-lg" : "p-1.5 hover:scale-105"
      } ${className}`}
    >
      <Heart
        className={`h-full w-full ${
          active ? "fill-[#FF6D1F] text-[#FF6D1F]" : "fill-[#a0a0a0] text-[#a0a0a0]"
        } ${isPopping ? "scale-125" : "scale-100"} transition-transform duration-200`}
      />
      {showLabel && (
        <span
          className={`text-sm font-medium transition-colors ${
            active ? "text-orange-500" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      )}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${
          showLabel ? "rounded-lg" : "rounded-full"
        } ${
          isPopping ? "ring-2 ring-orange-200" : ""
        }`}
      />
    </button>
  )
}
