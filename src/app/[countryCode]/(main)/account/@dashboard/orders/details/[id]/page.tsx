import { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import OrderQrModal from "@modules/account/components/order-qr-modal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

type MappedStatus = {
  label: "Not Fulfilled" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned"
  color: string
  message: string
}

function getPrimaryTracking(order: NonNullable<Awaited<ReturnType<typeof retrieveCustomer>>>["orders"]["edges"][number]["node"]) {
  const fulfillment = order.successfulFulfillments?.[0]
  const tracking = fulfillment?.trackingInfo?.find(
    (entry) => entry.number || entry.url
  )

  return { fulfillment, tracking }
}

function getMappedStatus(order: NonNullable<Awaited<ReturnType<typeof retrieveCustomer>>>["orders"]["edges"][number]["node"]): MappedStatus {
  const fulfillmentStatus = order.fulfillmentStatus?.toUpperCase?.() ?? null
  const { tracking } = getPrimaryTracking(order)

  if (order.canceledAt) {
    return {
      label: "Cancelled",
      color: "bg-red-50 text-red-700",
      message: "This order was cancelled before shipment.",
    }
  }

  if (fulfillmentStatus === "RESTOCKED") {
    return {
      label: "Returned",
      color: "bg-purple-50 text-purple-700",
      message: "This order has been returned and restocked.",
    }
  }

  if (fulfillmentStatus === "IN_PROGRESS" || fulfillmentStatus === "PARTIALLY_FULFILLED") {
    return {
      label: "Processing",
      color: "bg-blue-50 text-blue-700",
      message: "Your order is being processed.",
    }
  }

  if (fulfillmentStatus === "DELIVERED") {
    return {
      label: "Delivered",
      color: "bg-green-50 text-green-700",
      message: "Your order has been delivered.",
    }
  }

  if (fulfillmentStatus === "FULFILLED") {
    return tracking
      ? {
          label: "Delivered",
          color: "bg-green-50 text-green-700",
          message: "Your order has been delivered.",
        }
      : {
          label: "Shipped",
          color: "bg-orange-50 text-orange-700",
          message: "Your order has shipped.",
        }
  }

  return {
    label: "Not Fulfilled",
    color: "bg-yellow-50 text-yellow-700",
    message: "Your order is being prepared.",
  }
}

function formatCurrency(amount: string) {
  return `PHP ${parseFloat(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
  })}`
}

function getReadableCancelReason(cancelReason?: string | null) {
  const reasonMap: Record<string, string> = {
    CUSTOMER: "Customer requested cancellation",
    DECLINED: "Payment was declined",
    FRAUD: "Order flagged for fraud review",
    INVENTORY: "Item became unavailable",
    OTHER: "Cancelled by the store",
    STAFF: "Cancelled by the store",
  }

  if (!cancelReason) return null
  return reasonMap[cancelReason.toUpperCase()] ?? cancelReason
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
  const status = getMappedStatus(order)
  const { fulfillment, tracking } = getPrimaryTracking(order)
  const cancellationReason = getReadableCancelReason(order.cancelReason)
  const shouldShowTrackingCard = !order.canceledAt && Boolean(fulfillment)
  const headersList = await headers()
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? ""
  const protocol =
    headersList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https")
  const receiptUrl = host
    ? `${protocol}://${host}/orders/receipt/${encodeURIComponent(order.id)}`
    : `/orders/receipt/${encodeURIComponent(order.id)}`

  return (
    <>
      <div className="space-y-6" data-testid="order-detail-wrapper">
        <div className="print-hide">
          <LocalizedClientLink
            href="/account/orders"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </LocalizedClientLink>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.processedAt).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
              <div className="print-hide">
                <OrderQrModal
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  orderStatus={status.label}
                  receiptUrl={receiptUrl}
                />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">{status.message}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Payment status</span>
            <span className="text-sm font-medium text-gray-900">{order.financialStatus || "Unknown"}</span>
          </div>

          {status.label === "Cancelled" && order.canceledAt ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Cancellation date</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(order.canceledAt).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {cancellationReason ? (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">Cancel reason</span>
                  <span className="text-sm font-medium text-gray-900 text-right">{cancellationReason}</span>
                </div>
              ) : null}
            </>
          ) : null}

        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Items ({lineItems.length})</h2>
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
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  {item.variant?.title && item.variant.title !== "Default Title" ? (
                    <p className="text-xs text-gray-500 mt-0.5">{item.variant.title}</p>
                  ) : null}
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  {item.variant ? (
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency((parseFloat(item.variant.price.amount) * item.quantity).toString())}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(order.currentTotalPrice.amount)}</span>
          </div>
        </div>

        {shouldShowTrackingCard ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Tracking</h2>
            {tracking?.number ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">Tracking number</span>
                  <span className="text-sm font-medium text-gray-900 text-right break-all">{tracking.number}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row print-hide">
              {tracking?.url ? (
                <a
                  href={tracking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  Track Shipment
                </a>
              ) : null}
              {order.statusUrl ? (
                <a
                  href={order.statusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                >
                  View Order Status
                </a>
              ) : null}
            </div>
          </div>
        ) : order.statusUrl && !order.canceledAt ? (
          <div className="flex justify-end print-hide">
            <a
              href={order.statusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              View Order Status
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ) : null}
      </div>
    </>
  )
}
