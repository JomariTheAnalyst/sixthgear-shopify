"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { useRecentlyViewed, type LeanProduct } from "@lib/hooks/use-recently-viewed"
import type { ShopifyProductCard } from "@lib/shopify/types"

type FallbackProductCard = {
  handle: string
  title: string
  price: string
  image: string
}

const SKELETON_ITEMS = 6
interface YouMayLikeProps {
  onClose: () => void
}

const formatFallbackProduct = (product: ShopifyProductCard): FallbackProductCard => {
  const amount = product.variants?.edges?.[0]?.node?.price?.amount
  const currency = product.variants?.edges?.[0]?.node?.price?.currencyCode || "PHP"

  return {
    handle: product.handle,
    title: product.title,
    price: amount
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency,
        }).format(parseFloat(amount))
      : "",
    image: product.featuredImage?.url || "",
  }
}

const YouMayLike = ({ onClose }: YouMayLikeProps) => {
  const router = useRouter()
  const { recentlyViewed, isMounted } = useRecentlyViewed()
  const [fallbackProducts, setFallbackProducts] = useState<FallbackProductCard[]>([])
  const [isLoadingFallback, setIsLoadingFallback] = useState(false)
  const [didAttemptFetch, setDidAttemptFetch] = useState(false)

  useEffect(() => {
    if (!isMounted || recentlyViewed.length > 0 || didAttemptFetch) {
      return
    }

    let isSubscribed = true

    const fetchFallbackProducts = async () => {
      setIsLoadingFallback(true)

      try {
        const response = await fetch("/api/collections/best-sellers/products?limit=6")
        const products = (await response.json()) as ShopifyProductCard[]

        if (!isSubscribed) {
          return
        }

        setFallbackProducts(Array.isArray(products) ? products.slice(0, 6).map(formatFallbackProduct) : [])
      } catch {
        if (isSubscribed) {
          setFallbackProducts([])
        }
      } finally {
        if (isSubscribed) {
          setDidAttemptFetch(true)
          setIsLoadingFallback(false)
        }
      }
    }

    fetchFallbackProducts()

    return () => {
      isSubscribed = false
    }
  }, [didAttemptFetch, isMounted, recentlyViewed.length])

  const hasHistory = recentlyViewed.length > 0
  const sectionLabel = hasHistory ? "Recently Viewed" : "You May Like"
  const items = useMemo(
    () => (hasHistory ? recentlyViewed : fallbackProducts).slice(0, 6),
    [fallbackProducts, hasHistory, recentlyViewed]
  )

  if (!isMounted || (!hasHistory && isLoadingFallback)) {
    return (
      <div className="p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          {sectionLabel}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-100" />
              <div className="mt-1.5 h-3 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {sectionLabel}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => {
          const product = item as LeanProduct | FallbackProductCard

          return (
            <button
              key={product.handle}
              onClick={() => {
                router.push(`/products/${product.handle}`)
                onClose()
              }}
              className="group flex flex-col text-left"
            >
              <div className="relative mb-1.5 aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 33vw, 200px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    No image
                  </div>
                )}
              </div>
              <h4 className="w-full truncate text-xs font-medium text-gray-900 transition-colors group-hover:text-[#F16D34]">
                {product.title}
              </h4>
              <p className="text-xs text-gray-500">{product.price}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default YouMayLike
