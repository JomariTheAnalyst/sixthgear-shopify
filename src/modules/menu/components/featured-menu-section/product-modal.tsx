"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Minus, Plus, ShoppingBag, X } from "lucide-react"
import { toast } from "sonner"

import { useCartStore } from "@lib/cart"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { addToCart } from "@lib/data/cart"
import { formatPrice } from "@lib/shopify"
import type { FeaturedMenuProduct, FeaturedMenuVariant } from "./types"

type ProductModalProps = {
  product: FeaturedMenuProduct | null
  countryCode: string
  onClose: () => void
}

const isDefaultOption = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === "default" || normalized === "default title"
}

const isSale = (variant?: FeaturedMenuVariant | null) => {
  if (!variant?.price || !variant.compareAtPrice) return false
  return Number(variant.compareAtPrice.amount) > Number(variant.price.amount)
}

const ProductModal = ({ product, countryCode, onClose }: ProductModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const setCart = useCartStore((state) => state.setCart)
  const setCartId = useCartStore((state) => state.setCartId)
  const { openCart } = useCartDrawer()

  const visibleOptions = useMemo(() => {
    return (product?.options ?? []).filter((option) => {
      if (!option.values || option.values.length === 0) return false
      if (option.values.length === 1 && isDefaultOption(option.values[0])) return false
      return true
    })
  }, [product])

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null
    if (visibleOptions.length === 0) return product.variants[0]

    return (
      product.variants.find((variant) =>
        visibleOptions.every((option) =>
          variant.selectedOptions.some(
            (selected) =>
              selected.name === option.name &&
              selected.value === selectedOptions[option.name]
          )
        )
      ) ?? product.variants[0]
    )
  }, [product, selectedOptions, visibleOptions])

  const activeImage =
    selectedVariant?.image?.url || product?.image || "/images/firstgear-coffee/firstgearcoffee-whitebg.png"
  const variantOnSale = isSale(selectedVariant)
  const currentPrice = selectedVariant?.price ? formatPrice(selectedVariant.price) : product?.price
  const compareAtPrice =
    variantOnSale && selectedVariant?.compareAtPrice
      ? formatPrice(selectedVariant.compareAtPrice)
      : product?.compareAtPrice

  const canAddToCart = Boolean(selectedVariant?.id && selectedVariant.availableForSale !== false)

  useEffect(() => {
    if (!product) return

    const initialOptions: Record<string, string> = {}
    visibleOptions.forEach((option) => {
      initialOptions[option.name] = option.values[0]
    })
    setSelectedOptions(initialOptions)
    setQuantity(1)
  }, [product, visibleOptions])

  useEffect(() => {
    if (!product) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [product])

  if (!product) return null

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || isAdding) return

    setIsAdding(true)

    try {
      const updatedCart = await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      setCart(updatedCart as any)
      setCartId(updatedCart.id)
      toast.success("Added to cart", {
        description: `${quantity}x ${product.name}`,
      })
      onClose()
      openCart()
    } catch (error) {
      console.error(error)
      toast.error("Failed to add to cart", {
        description: "Please try again.",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[300] bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-[301] flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div
          className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-[760px] sm:rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                First Gear Coffee
              </p>
              <h3 className="mt-1 text-xl font-black uppercase tracking-[-0.04em] text-black sm:text-2xl">
                {product.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Close product options"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-[0.9fr_1fr] sm:p-6">
            <div className="flex min-h-[260px] items-center justify-center rounded-xl bg-[#f5f1e8] p-5 sm:min-h-[360px]">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full max-h-[330px] w-full object-contain"
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <p className="text-sm leading-6 text-black/70">{product.description}</p>

              <div className="mt-5 flex flex-wrap items-baseline gap-2">
                {compareAtPrice && (
                  <span className="text-base font-semibold text-black/45 line-through">
                    {compareAtPrice}
                  </span>
                )}
                <span
                  className={`text-2xl font-black tracking-[-0.05em] ${
                    compareAtPrice ? "text-[#e62020]" : "text-black"
                  }`}
                >
                  {currentPrice}
                </span>
              </div>

              {visibleOptions.length > 0 && (
                <div className="mt-6 space-y-5">
                  {visibleOptions.map((option) => (
                    <div key={option.id}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-black/50">
                        {option.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const selected = selectedOptions[option.name] === value

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [option.name]: value,
                                }))
                              }
                              className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                                selected
                                  ? "border-black bg-black text-white"
                                  : "border-black/15 bg-white text-black hover:border-black"
                              }`}
                            >
                              {value}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-black/50">
                  Quantity
                </p>
                <div className="inline-flex overflow-hidden rounded-lg border border-black/15">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-black hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-11 w-12 items-center justify-center border-x border-black/15 text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-black hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddToCart || isAdding}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#f16d34] disabled:cursor-not-allowed disabled:bg-black/15 disabled:text-black/35"
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingBag className="h-4 w-4" />
                )}
                {canAddToCart ? "Add to cart" : "Unavailable"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductModal
