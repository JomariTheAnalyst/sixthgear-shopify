"use client"

import Image from "next/image"
import { useMemo } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { MoreVertical, Package } from "lucide-react"
import { ShopifyOrder } from "@lib/shopify/types"
import OrderQrModal from "@modules/account/components/order-qr-modal"

function fmtPrice(amount: string, currency?: string) {
  const sym = currency === "PHP" ? "PHP " : (currency ? `${currency} ` : "")
  return `${sym}${parseFloat(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return {
    time: d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: false }),
    short: d.toLocaleDateString("en-PH", { day: "numeric", month: "short", year: "numeric" }),
  }
}

type StatusConfig = { label: string; color: string }

function getPrimaryTracking(order: ShopifyOrder) {
  const fulfillment = order.successfulFulfillments?.[0]
  const tracking = fulfillment?.trackingInfo?.find(
    (entry) => entry.number || entry.url
  )

  return { fulfillment, tracking }
}

function getStatusConfig(order: ShopifyOrder): StatusConfig {
  const fulfillmentStatus = order.fulfillmentStatus?.toUpperCase?.() ?? null
  const { tracking } = getPrimaryTracking(order)

  if (order.canceledAt) return { label: "Cancelled", color: "text-red-600" }
  if (fulfillmentStatus === "RESTOCKED") return { label: "Returned", color: "text-purple-600" }
  if (fulfillmentStatus === "IN_PROGRESS" || fulfillmentStatus === "PARTIALLY_FULFILLED") {
    return { label: "Processing", color: "text-blue-600" }
  }
  if (fulfillmentStatus === "FULFILLED") {
    return tracking
      ? { label: "Delivered", color: "text-green-600" }
      : { label: "Shipped", color: "text-orange-500" }
  }
  if (fulfillmentStatus === "UNFULFILLED" || fulfillmentStatus === "OPEN" || fulfillmentStatus === null) {
    return { label: "Not Fulfilled", color: "text-yellow-700" }
  }
  return { label: "Not Fulfilled", color: "text-yellow-700" }
}

function DetailRow({ label, value, valueClass = "text-gray-700" }: {
  label: string
  value: React.ReactNode
  valueClass?: string
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-sm text-gray-500 min-w-[120px] flex-shrink-0">{label}</span>
      <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  )
}

type OrderCardProps = {
  order: ShopifyOrder
  customerName?: string
  customerEmail?: string
  onClick?: (order: ShopifyOrder) => void
}

export default function OrderCard({ order, customerName, customerEmail }: OrderCardProps) {
  const lineItems = order.lineItems.edges.map((e) => e.node)
  const itemCount = lineItems.reduce((s, i) => s + (i.quantity ?? 0), 0)
  const status = getStatusConfig(order)
  const dt = order.processedAt ? fmtDateTime(order.processedAt) : null
  const receiptUrl = useMemo(() => {
    const encodedOrderId = encodeURIComponent(order.id)
    const path = `/orders/receipt/${encodedOrderId}`

    if (typeof window === "undefined") {
      return path
    }

    return `${window.location.origin}${path}`
  }, [order.id])

  const PAID_STATUSES = ["PAID", "AUTHORIZED"]
  const UNPAID_STATUSES = ["PENDING", "PARTIALLY_PAID"]
  const REFUNDED_STATUSES = ["REFUNDED", "PARTIALLY_REFUNDED", "VOIDED"]
  const fs = order.financialStatus?.toUpperCase() ?? ""
  const paymentLabel = PAID_STATUSES.includes(fs)
    ? "Paid"
    : REFUNDED_STATUSES.includes(fs)
      ? fs === "VOIDED" ? "Voided" : "Refunded"
      : UNPAID_STATUSES.includes(fs)
        ? "Unpaid"
        : order.financialStatus ?? "-"
  const paymentColor = PAID_STATUSES.includes(fs)
    ? "text-green-600"
    : REFUNDED_STATUSES.includes(fs)
      ? "text-red-600"
      : "text-orange-500"
  const recipientName = order.shippingAddress
    ? [order.shippingAddress.firstName, order.shippingAddress.lastName].filter(Boolean).join(" ")
    : ""
  const deliveryAddress = order.shippingAddress
    ? [
        order.shippingAddress.address1,
        order.shippingAddress.address2,
        [order.shippingAddress.city, order.shippingAddress.province, order.shippingAddress.zip]
          .filter(Boolean)
          .join(", "),
        order.shippingAddress.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "-"

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid="order-card">
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">Order #{order.orderNumber ?? "-"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {itemCount} {itemCount === 1 ? "Product" : "Products"}
              {customerName ? ` - By ${customerName}` : ""}
              {dt ? ` - ${dt.time}, ${dt.short}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="More options"
              title="More options (coming soon)"
              disabled
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-gray-100 space-y-2">
        <DetailRow label="Status:" value={status.label} valueClass={status.color} />
        <DetailRow label="Payment:" value={paymentLabel} valueClass={paymentColor} />
        {recipientName ? <DetailRow label="Recipient:" value={recipientName} /> : null}
        <DetailRow
          label="Delivery address:"
          value={deliveryAddress}
        />
        {customerEmail ? <DetailRow label="Customer email:" value={customerEmail} /> : null}
        <DetailRow
          label="Total:"
          value={fmtPrice(order.currentTotalPrice?.amount ?? "0", order.currentTotalPrice?.currencyCode)}
          valueClass="text-gray-900 font-semibold"
        />
      </div>

      {lineItems.length > 0 ? (
        <div className="px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lineItems.map((item, idx) => {
              const imageUrl = item.variant?.image?.url ?? null
              const imageAlt = item.variant?.image?.altText ?? item.title
              const price = item.variant?.price ?? null
              const variantTitle = item.variant?.title && item.variant.title !== "Default Title"
                ? item.variant.title
                : null

              return (
                <div key={`${item.title}-${idx}`} className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{item.title ?? "-"}</p>
                    {price ? (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Quantity: {item.quantity}x = {fmtPrice(price.amount, price.currencyCode)}
                      </p>
                    ) : null}
                    {variantTitle ? (
                      <p className="text-xs text-gray-400 mt-0.5">{variantTitle}</p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="border-t border-gray-100 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <OrderQrModal
            orderId={order.id}
            orderNumber={order.orderNumber}
            orderStatus={status.label}
            receiptUrl={receiptUrl}
          />
          <LocalizedClientLink
            href={`/account/orders/details/${encodeURIComponent(order.id)}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 [font-family:var(--font-poppins)]"
          >
            View order details
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export type { OrderCardProps }
