"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShopifyCustomer } from "@lib/shopify/types"
import { Package, MapPin, Calendar, ChevronRight, User } from "lucide-react"

type OverviewProps = {
  customer: ShopifyCustomer
}

export default function Overview({ customer }: OverviewProps) {
  const addressCount = customer.addresses?.edges?.length ?? 0
  const orderCount = customer.orders?.edges?.length ?? 0

  const recentOrders = customer.orders?.edges
    ?.slice(0, 3)
    ?.map(e => e.node) ?? []

  const formattedDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—"

  return (
    <div data-testid="overview-page-wrapper" className="space-y-8">
      {/* SECTION A — Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1 — Total Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">
            {orderCount}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>

        {/* Card 2 — Saved Addresses */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">
            {addressCount}
          </p>
          <p className="text-sm text-gray-500 mt-1">Saved Addresses</p>
        </div>

        {/* Card 3 — Member Since */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">
            {formattedDate}
          </p>
          <p className="text-sm text-gray-500 mt-1">Member Since</p>
        </div>
      </div>

      {/* SECTION B — Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h2>
          <LocalizedClientLink href="/account/orders"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
            View all &rarr;
          </LocalizedClientLink>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 mt-4 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-900 font-medium mt-3">
              No orders yet
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Your order history will appear here
            </p>
            <LocalizedClientLink href="/store"
              className="inline-block mt-4 px-4 py-2 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Start Shopping
            </LocalizedClientLink>
          </div>
        ) : (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {recentOrders.map(order => {
              const status = order.fulfillmentStatus || order.financialStatus || ""
              let colorClasses = "bg-gray-100 text-gray-600 border-gray-200"

              if (status === "FULFILLED" || status === "PAID") {
                colorClasses = "bg-green-50 text-green-700 border-green-100"
              } else if (status === "UNFULFILLED" || status === "PENDING") {
                colorClasses = "bg-orange-50 text-orange-700 border-orange-100"
              } else if (status === "CANCELLED") {
                colorClasses = "bg-red-50 text-red-700 border-red-100"
              }

              return (
                <LocalizedClientLink
                  key={order.id}
                  href={`/account/orders/${encodeURIComponent(order.id)}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.processedAt).toLocaleDateString(
                        "en-PH", { year:"numeric", month:"short", day:"numeric" }
                      )}
                    </p>
                  </div>

                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colorClasses}`}>
                    {status ? status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") : "Unknown"}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      ₱{parseFloat(order.currentTotalPrice?.amount ?? "0").toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        )}
      </div>

      {/* SECTION C — Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <LocalizedClientLink href="/account/profile"
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-150 group">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
              <User className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                Edit Profile
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                Update your personal information
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </LocalizedClientLink>

          <LocalizedClientLink href="/account/addresses"
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-150 group">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                Manage Addresses
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                Add or edit shipping addresses
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
