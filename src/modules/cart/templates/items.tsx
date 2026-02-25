import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"


import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"
import { isItemOutOfStock } from "@lib/util/cart-helpers"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const { selectAll, deselectAll, selectedItems } = useSelectedItems()

  // Get only in-stock items for selection
  const inStockItems = items?.filter((item) => !isItemOutOfStock(item)) || []
  const inStockItemIds = inStockItems.map((item) => item.id)

  // Check if all in-stock items are selected
  const allSelected =
    inStockItemIds.length > 0 &&
    inStockItemIds.every((id) => selectedItems.has(id))

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll()
    } else {
      selectAll(inStockItemIds)
    }
  }

  return (
    <div>
      <div className="pb-3 flex items-center justify-between">
        <h2 className="text-[2rem] leading-[2.75rem] font-semibold">Cart</h2>
        {items && items.length > 0 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              disabled={inStockItems.length === 0}
              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
            />
            <span className="text-sm text-ui-fg-subtle">
              {allSelected ? "Deselect All" : "Select All"}
            </span>
          </div>
        )}
      </div>
      <table className="w-full text-sm">
        <thead className="border-t-0">
          <tr className="text-gray-500 font-medium">
            <th className="!pl-0 w-12"></th>
            <th className="!pl-0 text-left">Item</th>
            <th></th>
            <th className="text-left">Quantity</th>
            <th className="hidden small:table-cell text-left">
              Price
            </th>
            <th className="!pr-0 text-right">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items
            ? items
                .sort((a: any, b: any) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item: any) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </tbody>
      </table>
    </div>
  )
}

export default ItemsTemplate
