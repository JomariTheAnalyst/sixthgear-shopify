import { Metadata } from "next"

import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  const orders = customer.orders?.edges?.map((e) => e.node) || []

  return (
    <div className="space-y-6" data-testid="orders-page-wrapper">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              View and track all your orders
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Order
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Fulfillment
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Total
                  </th>
                  <th className="px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(order.processedAt).toLocaleDateString(
                          "en-PH",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.financialStatus} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.fulfillmentStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        ₱
                        {parseFloat(
                          order.currentTotalPrice.amount
                        ).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <LocalizedClientLink
                        href={`/account/orders/${encodeURIComponent(order.id)}`}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View →
                      </LocalizedClientLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
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
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    PAID: { bg: "bg-green-50", text: "text-green-700" },
    PARTIALLY_PAID: { bg: "bg-yellow-50", text: "text-yellow-700" },
    PENDING: { bg: "bg-yellow-50", text: "text-yellow-700" },
    REFUNDED: { bg: "bg-gray-50", text: "text-gray-700" },
    PARTIALLY_REFUNDED: { bg: "bg-gray-50", text: "text-gray-700" },
    VOIDED: { bg: "bg-red-50", text: "text-red-700" },
    UNFULFILLED: { bg: "bg-yellow-50", text: "text-yellow-700" },
    FULFILLED: { bg: "bg-green-50", text: "text-green-700" },
    PARTIALLY_FULFILLED: { bg: "bg-blue-50", text: "text-blue-700" },
    IN_PROGRESS: { bg: "bg-blue-50", text: "text-blue-700" },
  }

  const config = colors[status] || { bg: "bg-gray-50", text: "text-gray-700" }
  const label = status
    ? status
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "Unknown"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {label}
    </span>
  )
}
