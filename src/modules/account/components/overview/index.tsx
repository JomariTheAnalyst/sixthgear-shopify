"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShopifyCustomer, ShopifyOrder } from "@lib/shopify/types"

type OverviewProps = {
  customer: ShopifyCustomer
}

const Overview = ({ customer }: OverviewProps) => {
  const orders = customer.orders?.edges?.map((e) => e.node) || []
  const addressCount = customer.addresses?.edges?.length || 0
  const orderCount = orders.length
  const profileCompletion = getProfileCompletion(customer)

  return (
    <div data-testid="overview-page-wrapper" className="space-y-8">
      {/* Welcome Section w/ Minimal Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
         <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Hello, {customer.firstName || "there"}
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
                Here&apos;s a look at your account activity.
            </p>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Orders</p>
                <p className="text-xl font-semibold text-gray-900">{orderCount}</p>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
            <div className="text-right">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Addresses</p>
                <p className="text-xl font-semibold text-gray-900">{addressCount}</p>
            </div>
         </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          {orders.length > 0 && (
            <LocalizedClientLink
              href="/account/orders"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              View all
            </LocalizedClientLink>
          )}
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200/60 shadow-sm overflow-hidden" data-testid="orders-wrapper">
          {orders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <LocalizedClientLink
                  key={order.id}
                  href={`/account/orders/${encodeURIComponent(order.id)}`}
                  className="block hover:bg-gray-50/50 transition-colors group"
                  data-testid="order-wrapper"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="flex flex-col">
                             <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">#{order.orderNumber}</span>
                             <span className="text-xs text-gray-500">
                                {new Date(order.processedAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                             </span>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                            <OrderStatusBadge status={order.fulfillmentStatus} />
                            <span className="text-sm font-medium text-gray-900 w-24 text-right">
                                ₱{parseFloat(order.currentTotalPrice.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </span>
                             <svg
                                className="w-4 h-4 text-gray-300 group-hover:text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                                />
                            </svg>
                      </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          ) : (
            <div
              className="px-6 py-16 text-center"
              data-testid="no-orders-message"
            >
              <h3 className="text-gray-900 font-medium mb-1">No orders yet</h3>
              <p className="text-gray-500 text-sm mb-6">
                You haven&apos;t placed any orders yet.
              </p>
              <LocalizedClientLink
                href="/"
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-sm"
              >
                Start Shopping
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Completion */}
       {profileCompletion < 100 && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex items-center justify-between">
              <div>
                  <h4 className="text-sm font-medium text-gray-900">Complete your profile</h4>
                  <p className="text-xs text-gray-500 mt-1">Add your phone number and address to speed up checkout.</p>
              </div>
              <LocalizedClientLink href="/account/profile" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                  Complete Details &rarr;
              </LocalizedClientLink>
          </div>
       )}
    </div>
  )
}

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    { bg: string; text: string; dot: string; label: string }
  > = {
    UNFULFILLED: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
    PARTIALLY_FULFILLED: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Processing" },
    FULFILLED: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Shipped" },
    IN_PROGRESS: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "In Progress" },
  }

  const config = statusConfig[status] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-500",
    label: status
      ? status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
      : "Unknown",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

const getProfileCompletion = (customer: ShopifyCustomer) => {
  let count = 0

  if (customer.email) count++
  if (customer.firstName && customer.lastName) count++
  if (customer.phone) count++
  if (customer.defaultAddress) count++

  return (count / 4) * 100
}

export default Overview
