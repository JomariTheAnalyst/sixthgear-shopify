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

  const isOnSale = selectedPrice.original_price_number && selectedPrice.original_price_number > selectedPrice.calculated_price_number

  return (
    <div className="flex flex-col gap-1 my-4">
      {/* Current/Sale Price */}
      {isOnSale ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">
              Now
            </span>
            <span
              className={cn("text-[32px] font-bold leading-tight text-red-600")}
              data-testid="product-price"
              data-value={selectedPrice.calculated_price_number}
            >
              {selectedPrice.calculated_price}
            </span>
          </div>

          {selectedPrice.original_price && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">
                Before
              </span>
              <span
                className="text-base text-gray-500 line-through"
                data-testid="original-product-price"
                data-value={selectedPrice.original_price_number}
              >
                {selectedPrice.original_price}
              </span>
              {selectedPrice.percentage_diff && (
                <span className="text-sm font-bold text-red-600 border border-red-200 bg-red-50 px-2 py-0.5 rounded-md">
                  -{selectedPrice.percentage_diff}%
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <span
          className="text-[32px] font-bold leading-tight text-slate-900"
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      )}
    </div>
  )
}
