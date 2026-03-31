"use client"

import { useEffect } from "react"
import { Heart, X } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "@modules/home/components/product-sections/product-card"
import { useWishlistStore, WishlistItem } from "@lib/wishlist-store"
import WishlistSkeleton from "@modules/wishlist/components/wishlist-skeleton"

/** Converts a WishlistItem → Medusa-like shape that ProductCard expects */
function wishlistItemToProductCard(item: WishlistItem): any {
  return {
    id: item.id,
    title: item.title,
    handle: item.handle,
    thumbnail: item.imageUrl,
    images: item.imageUrl ? [{ url: item.imageUrl }] : [],
    collection: { title: item.vendor },
    variants: [
      {
        id: item.variantId,
        allow_backorder: false,
        manage_inventory: true,
        inventory_quantity: item.availableForSale ? 10 : 0,
        calculated_price: {
          calculated_amount: item.price,
          original_amount: item.compareAtPrice,
          currency_code: item.currencyCode,
        },
      },
    ],
  }
}

export default function WishlistTemplate() {
  const items = useWishlistStore((state) => state.items)
  const hydrated = useWishlistStore((state) => state.hydrated)
  const hydrate = useWishlistStore((state) => state.hydrate)
  const remove = useWishlistStore((state) => state.remove)

  useEffect(() => {
    if (!hydrated) hydrate()
  }, [hydrate, hydrated])

  /* ── Loading skeleton (pre-hydration) ── */
  if (!hydrated) {
    return <WishlistSkeleton />
  }

  /* ── Empty state ── */
  if (!items.length) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-32">
        <div className="mx-auto max-w-lg text-center bg-gray-50/50 rounded-3xl py-16 px-6 border border-gray-100 shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
            <Heart className="h-10 w-10 text-gray-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Your wishlist is empty
          </h1>
          <p className="mt-3 text-base text-gray-500 max-w-sm mx-auto">
            Save items you love and find them here anytime. Let&apos;s find something special for you.
          </p>
          <LocalizedClientLink
            href="/store"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-orange-500 px-8 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
          >
            Browse Products
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  /* ── Products grid — reuses PLP ProductCard, no API fetch ── */
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
      <div className="mb-8 flex items-end justify-between border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {items.length} saved product{items.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-gray-200">
        {items.map((item) => {
          const mapped = wishlistItemToProductCard(item)

          return (
            <div key={item.handle} className="relative group/wishcard bg-white h-full border-r border-b border-gray-200">
              {/* Remove button — visible on hover (desktop), always visible (mobile) */}
              <button
                type="button"
                onClick={() => remove(item.handle)}
                aria-label={`Remove ${item.title} from wishlist`}
                className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white border border-gray-200 shadow-sm transition-colors md:opacity-0 md:group-hover/wishcard:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              <ProductCard product={mapped} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
