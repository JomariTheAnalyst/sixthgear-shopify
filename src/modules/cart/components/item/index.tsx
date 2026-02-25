"use client"


import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"
import {
  getStockStatus,
  getStockLabel,
  isItemOutOfStock,
} from "@lib/util/cart-helpers"
import { cn } from "@lib/util/cn"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isSelected, toggleItem } = useSelectedItems()

  const stockStatus = getStockStatus(item)
  const outOfStock = isItemOutOfStock(item)
  const inventoryQty = item.variant?.inventory_quantity || 0

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = item.variant?.inventory_quantity || 10
  const maxQuantity = item.variant?.manage_inventory ? maxQtyFromInventory : 10

  const handleCheckboxChange = () => {
    toggleItem(item.id, outOfStock)
  }

  return (
    <tr
      className={cn("w-full", {
        "opacity-60": outOfStock,
      })}
      data-testid="product-row"
    >
      {/* Checkbox Column */}
      {type === "full" && (
        <td className="!pl-0 p-4 w-12">
          <input
            type="checkbox"
            checked={isSelected(item.id)}
            onChange={handleCheckboxChange}
            disabled={outOfStock}
            className="cursor-pointer w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
        </td>
      )}

      <td
        className={cn("p-4 w-24", {
          "!pl-0": type === "preview",
        })}
      >
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={cn("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </td>

      <td className="text-left">
        <span
          className="txt-medium-plus text-gray-900 font-medium"
          data-testid="product-title"
        >
          {item.product_title}
        </span>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />

        {/* Stock Status Badges */}
        {stockStatus === "out_of_stock" && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 mt-2">
            {getStockLabel(stockStatus)}
          </span>
        )}
        {stockStatus === "low_stock" && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 mt-2">
            {getStockLabel(stockStatus, inventoryQty)}
          </span>
        )}
      </td>

      {type === "full" && (
        <td>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              disabled={outOfStock}
              data-testid="product-select-button"
            >
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </td>
      )}

      {type === "full" && (
        <td className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </td>
      )}

      <td className="!pr-0">
        <span
          className={cn("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <span className="text-gray-500">{item.quantity}x </span>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </td>
    </tr>
  )
}

export default Item
