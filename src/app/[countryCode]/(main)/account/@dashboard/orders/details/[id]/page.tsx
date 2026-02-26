import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const customer = await retrieveCustomer().catch(() => null)
  const order = customer?.orders?.edges
    ?.map((e) => e.node)
    .find((o) => o.id === decodeURIComponent(params.id))

  return {
    title: order ? `Order #${order.orderNumber}` : "Order Details",
    description: "View your order details",
  }
}

export default async function OrderDetailPage(props: Props) {
  const params = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  const orderId = decodeURIComponent(params.id)
  const order = customer.orders?.edges
    ?.map((e) => e.node)
    .find((o) => o.id === orderId)

  if (!order) {
    notFound()
  }

  const lineItems = order.lineItems?.edges?.map((e) => e.node) || []

  return (
    <div className="space-y-6" data-testid="order-detail-wrapper">
      {/* Back Link */}
      <LocalizedClientLink
        href="/account/orders"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Orders
      </LocalizedClientLink>

      {/* Order Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on{" "}
              {new Date(order.processedAt).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge label="Payment" status={order.financialStatus} />
            <StatusBadge
              label="Fulfillment"
              status={order.fulfillmentStatus}
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Items ({lineItems.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {lineItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 px-6 py-4">
              {item.variant?.image ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.variant.image.url}
                    alt={item.variant.image.altText || item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
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
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </p>
                {item.variant && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.variant.title !== "Default Title"
                      ? item.variant.title
                      : ""}
                  </p>
                )}
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                {item.variant && (
                  <p className="text-sm font-medium text-gray-900">
                    ₱
                    {(
                      parseFloat(item.variant.price.amount) * item.quantity
                    ).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">
            ₱
            {parseFloat(order.currentTotalPrice.amount).toLocaleString(
              "en-PH",
              { minimumFractionDigits: 2 }
            )}
          </span>
        </div>
      </div>

      {/* Track Order */}
      {order.statusUrl && (
        <div className="flex justify-end">
          <a
            href={order.statusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Track Order
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}

function StatusBadge({
  label,
  status,
}: {
  label: string
  status: string
}) {
  const colors: Record<string, string> = {
    PAID: "bg-green-50 text-green-700",
    FULFILLED: "bg-green-50 text-green-700",
    UNFULFILLED: "bg-yellow-50 text-yellow-700",
    PENDING: "bg-yellow-50 text-yellow-700",
    PARTIALLY_FULFILLED: "bg-blue-50 text-blue-700",
    REFUNDED: "bg-gray-50 text-gray-700",
  }

  const colorClass = colors[status] || "bg-gray-50 text-gray-700"
  const displayStatus = status
    ? status
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "Unknown"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {label}: {displayStatus}
    </span>
  )
}
