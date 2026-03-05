"use client"

import { useState, useMemo } from "react"
import { ShoppingBag } from "lucide-react"
import { ShopifyOrder, ShopifyCustomer } from "@lib/shopify/types"
import OrderCard from "@modules/account/components/order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = "All" | "Unfulfilled" | "Shipped" | "Delivered" | "Cancelled" | "Returned"

const TABS: FilterTab[] = ["All", "Unfulfilled", "Shipped", "Delivered", "Cancelled", "Returned"]

function filterOrders(orders: ShopifyOrder[], tab: FilterTab): ShopifyOrder[] {
  switch (tab) {
    case "Unfulfilled":
      return orders.filter(o =>
        o.fulfillmentStatus === "UNFULFILLED" ||
        o.fulfillmentStatus === "PARTIALLY_FULFILLED" ||
        o.fulfillmentStatus === "IN_PROGRESS"
      )
    case "Shipped":
      return orders.filter(o =>
        o.fulfillmentStatus === "SHIPPED" ||
        o.fulfillmentStatus === "IN_TRANSIT" ||
        o.fulfillmentStatus === "OUT_FOR_DELIVERY" ||
        o.fulfillmentStatus === "FULFILLED"
      )
    case "Delivered":
      return orders.filter(o => o.fulfillmentStatus === "DELIVERED")
    case "Cancelled":
      return orders.filter(o =>
        o.financialStatus === "VOIDED" ||
        o.fulfillmentStatus === "RESTOCKED"
      )
    case "Returned":
      return orders.filter(o =>
        o.financialStatus === "REFUNDED" ||
        o.fulfillmentStatus === "RETURNED"
      )
    default:
      return orders
  }
}

function tabCount(orders: ShopifyOrder[], tab: FilterTab): number {
  if (tab === "All") return orders.length
  return filterOrders(orders, tab).length
}

// ─── Component ────────────────────────────────────────────────────────────────

type OrdersTemplateProps = {
  orders: ShopifyOrder[]
  customer?: ShopifyCustomer | null
}

export default function OrdersTemplate({ orders, customer }: OrdersTemplateProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("All")

  const filteredOrders = useMemo(
    () => filterOrders(orders, activeTab),
    [orders, activeTab]
  )

  const customerName =
    customer?.firstName || customer?.lastName
      ? [customer.firstName, customer.lastName].filter(Boolean).join(" ")
      : undefined

  const customerEmail = customer?.email ?? undefined

  // Zero orders at all
  if (orders.length === 0) {
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
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
        <span className="text-sm text-gray-500">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-px px-px">
        {TABS.map(tab => {
          const count = tabCount(orders, tab)
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
              {tab !== "All" && count > 0 && (
                <span
                  className={[
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Order list ── */}
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
            View all orders →
          </button>
        </div>
      )}
    </div>
  )
}
