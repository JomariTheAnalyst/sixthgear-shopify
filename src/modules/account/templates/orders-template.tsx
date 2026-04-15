"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { ListFilter, ShoppingBag, X } from "lucide-react"
import { getCustomerOrders } from "@lib/data/customer"
import { ShopifyOrder, ShopifyCustomer } from "@lib/shopify/types"
import OrderCard from "@modules/account/components/order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type FilterTab =
  | "All"
  | "Unfulfilled"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Returned"

const TABS: FilterTab[] = [
  "All",
  "Unfulfilled",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
]

function getPrimaryTracking(order: ShopifyOrder) {
  const fulfillment = order.successfulFulfillments?.[0]
  const tracking = fulfillment?.trackingInfo?.find(
    (entry) => entry.number || entry.url
  )

  return { fulfillment, tracking }
}

function getMappedOrderStatus(order: ShopifyOrder): Exclude<FilterTab, "All"> {
  if (order.canceledAt) {
    return "Cancelled"
  }

  const fulfillmentStatus = order.fulfillmentStatus?.toUpperCase?.() ?? null
  const { tracking } = getPrimaryTracking(order)

  if (fulfillmentStatus === "RESTOCKED") {
    return "Returned"
  }

  if (fulfillmentStatus === "IN_PROGRESS" || fulfillmentStatus === "PARTIALLY_FULFILLED") {
    return "Processing"
  }

  if (fulfillmentStatus === "DELIVERED") {
    return "Delivered"
  }

  if (fulfillmentStatus === "FULFILLED") {
    return tracking ? "Delivered" : "Shipped"
  }

  if (fulfillmentStatus === "UNFULFILLED" || fulfillmentStatus === "OPEN" || fulfillmentStatus === null) {
    return "Unfulfilled"
  }

  return "Unfulfilled"
}

function filterOrders(orders: ShopifyOrder[], tab: FilterTab): ShopifyOrder[] {
  if (tab === "All") return orders
  return orders.filter((order) => getMappedOrderStatus(order) === tab)
}

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type OrdersTemplateProps = {
  orders: ShopifyOrder[]
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
  customer?: ShopifyCustomer | null
}

export default function OrdersTemplate({
  orders,
  pageInfo: initialPageInfo,
  customer,
}: OrdersTemplateProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isFilterMounted, setIsFilterMounted] = useState(false)
  const [accumulatedOrders, setAccumulatedOrders] = useState<ShopifyOrder[]>(orders)
  const [pageInfo, setPageInfo] = useState(initialPageInfo)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (isFilterOpen) {
      setIsFilterMounted(true)
      return
    }

    if (!isFilterMounted) return

    const timeoutId = window.setTimeout(() => {
      setIsFilterMounted(false)
    }, 240)

    return () => window.clearTimeout(timeoutId)
  }, [isFilterMounted, isFilterOpen])

  const filteredOrders = useMemo(
    () => filterOrders(accumulatedOrders, activeTab),
    [accumulatedOrders, activeTab]
  )

  const customerName =
    customer?.firstName || customer?.lastName
      ? [customer.firstName, customer.lastName].filter(Boolean).join(" ")
      : undefined

  const customerEmail = customer?.email ?? undefined

  // Zero orders at all
  const handleLoadMore = () => {
    if (!pageInfo.endCursor || isPending) return

    startTransition(async () => {
      setLoadMoreError(null)

      try {
        const nextPage = await getCustomerOrders(pageInfo.endCursor ?? undefined)

        setAccumulatedOrders((current) => {
          const seen = new Set(current.map((order) => order.id))
          const appended = nextPage.orders.filter((order) => !seen.has(order.id))
          return [...current, ...appended]
        })
        setPageInfo(nextPage.pageInfo)
      } catch (error) {
        console.error(error)
        setLoadMoreError("Unable to load more orders right now.")
      }
    })
  }

  if (accumulatedOrders.length === 0) {
    return (
      <div className="space-y-6" data-testid="orders-page-wrapper">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
          <span className="text-sm text-gray-500">0 orders</span>
        </div>

        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-gray-900 font-medium mt-4">No orders yet</p>
          <p className="text-sm text-gray-500 mt-1">
            You haven&apos;t placed any orders yet.
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-block mt-6 px-5 py-2.5 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5" data-testid="orders-page-wrapper">
      {/* â”€â”€ Page header â”€â”€ */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
        <span className="text-sm text-gray-500">
          {accumulatedOrders.length} {accumulatedOrders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* â”€â”€ Filter tabs â”€â”€ */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex h-11 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
            <ListFilter className="h-4 w-4" />
          </span>
          <span>Filter</span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
            {activeTab}
          </span>
        </button>
      </div>

      <div className="hidden gap-2 overflow-x-auto pb-1 -mx-px px-px sm:flex">
        {TABS.map(tab => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors border",
                isActive
                  ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300",
              ].join(" ")}
              data-testid={`tab-${tab.toLowerCase()}`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {isFilterMounted ? (
        <div className="sm:hidden">
          <div
            className={[
              "fixed inset-0 z-[80] bg-slate-950/30 transition-opacity duration-200 ease-out",
              isFilterOpen ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onClick={() => setIsFilterOpen(false)}
          />
          <div
            className={[
              "fixed inset-x-0 bottom-0 z-[81] rounded-t-[28px] bg-white px-5 pb-7 pt-5 shadow-[0_-16px_48px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isFilterOpen ? "translate-y-0" : "translate-y-full",
            ].join(" ")}
          >
            <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-gray-200" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Order Status
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">Filter orders</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-2">
              {TABS.map((tab) => {
                const isActive = activeTab === tab

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab)
                      setIsFilterOpen(false)
                    }}
                    className={[
                      "flex min-h-[52px] items-center justify-between rounded-2xl border px-4 text-left text-sm font-medium transition-colors",
                      isActive
                        ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                        : "border-gray-200 bg-white text-gray-700",
                    ].join(" ")}
                  >
                    <span>{tab}</span>
                    {isActive ? (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                        Active
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* â”€â”€ Order list â”€â”€ */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              customerName={customerName}
              customerEmail={customerEmail}
            />
          ))}

          {pageInfo.hasNextPage && (
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isPending || !pageInfo.endCursor}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Loading..." : "Load more"}
              </button>
              {loadMoreError ? (
                <p className="text-sm text-red-600">{loadMoreError}</p>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-gray-900 font-medium mt-3 text-sm">
            No {activeTab.toLowerCase()} orders
          </p>
          <p className="text-xs text-gray-500 mt-1">
            You don&apos;t have any {activeTab.toLowerCase()} orders right now.
          </p>
          <button
            onClick={() => setActiveTab("All")}
            className="mt-4 text-sm text-[#f97316] hover:text-orange-600 font-medium transition-colors"
          >
            View all orders â†’
          </button>
        </div>
      )}
    </div>
  )
}
