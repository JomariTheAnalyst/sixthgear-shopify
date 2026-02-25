import { VariantPrice } from "types/global"
import { cn } from "@lib/util/cn"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <span
          className="line-through text-gray-400"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={cn("text-gray-400", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </>
  )
}
