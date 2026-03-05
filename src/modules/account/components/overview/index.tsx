"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShopifyCustomer } from "@lib/shopify/types"
import { Package, MapPin, Calendar, ChevronRight, User } from "lucide-react"

type OverviewProps = {
  customer: ShopifyCustomer
}

export default function Overview({ customer }: OverviewProps) {
  const addressCount = customer.addresses?.edges?.length ?? 0
  const orderCount   = customer.orders?.edges?.length    ?? 0

  const recentOrders = customer.orders?.edges?.slice(0, 3)?.map(e => e.node) ?? []

  const formattedDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—"

  return (
    <div data-testid="overview-page-wrapper" className="space-y-8">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Orders */}
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{orderCount}</p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>

        {/* Addresses */}
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{addressCount}</p>
          <p className="text-sm text-gray-500 mt-1">Saved Addresses</p>
        </div>

        {/* Member since */}
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{formattedDate}</p>
          <p className="text-sm text-gray-500 mt-1">Member Since</p>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
          <LocalizedClientLink
            href="/account/orders"
            className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
          >
            View all →
          </LocalizedClientLink>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
            <Package className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-gray-900 font-medium mt-3 text-sm">No orders yet</p>
            <p className="text-xs text-gray-500 mt-1">Your order history will appear here</p>
            <LocalizedClientLink
              href="/store"
              className="inline-block mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </LocalizedClientLink>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {recentOrders.map(order => {
              const status = order.fulfillmentStatus || order.financialStatus || ""

              return (
                <LocalizedClientLink
                  key={order.id}
                  href={`/account/orders/${encodeURIComponent(order.id)}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.processedAt).toLocaleDateString(
                        "en-PH", { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {status
                      ? status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
                      : "Unknown"
                    }
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

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LocalizedClientLink
            href="/account/profile"
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Edit Profile</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">Update your personal information</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/account/addresses"
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
              <MapPin className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Manage Addresses</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">Add or edit shipping addresses</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
          </LocalizedClientLink>
        </div>
      </div>

    </div>
  )
}
