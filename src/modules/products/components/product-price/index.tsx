import { cn } from "@lib/util/cn"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-slate-200 animate-pulse rounded" />
  }

  const isOnSale = selectedPrice.price_type === "sale"

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      {/* Current/Sale Price */}
      <span
        className={cn(
          "text-3xl font-bold text-slate-900",
          isOnSale && "text-slate-900"
        )}
        data-testid="product-price"
        data-value={selectedPrice.calculated_price_number}
      >
        {!variant && "From "}
        {selectedPrice.calculated_price}
      </span>

      {/* Original Price (strikethrough) */}
      {isOnSale && selectedPrice.original_price && (
        <span
          className="text-lg text-slate-500 line-through"
          data-testid="original-product-price"
          data-value={selectedPrice.original_price_number}
        >
          {selectedPrice.original_price}
        </span>
      )}

      {/* Save badge */}
      {isOnSale && selectedPrice.percentage_diff && (
        <span className="px-2 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded">
          Save {selectedPrice.percentage_diff}%
        </span>
      )}
    </div>
  )
}
