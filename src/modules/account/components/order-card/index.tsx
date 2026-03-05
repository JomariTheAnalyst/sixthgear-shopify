"use client"

import Image from "next/image"
import { Download, MoreVertical, Package } from "lucide-react"
import { ShopifyOrder } from "@lib/shopify/types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(amount: string, currency?: string) {
  const sym = currency === "PHP" ? "₱" : (currency ?? "")
  return `${sym}${parseFloat(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return {
    time: d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: false }),
    date: d.toLocaleDateString("en-PH", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
    short: d.toLocaleDateString("en-PH", { day: "numeric", month: "short", year: "numeric" }),
  }
}

type StatusConfig = { label: string; color: string }

function getStatusConfig(fulfillmentStatus: string, financialStatus: string): StatusConfig {
  // Map to a human-readable label with a color
  const f = fulfillmentStatus?.toUpperCase()
  const p = financialStatus?.toUpperCase()

  if (f === "DELIVERED") return { label: "Delivered", color: "text-green-600" }
  if (f === "SHIPPED" || f === "IN_TRANSIT" || f === "OUT_FOR_DELIVERY" || f === "FULFILLED")
    return { label: "On the way", color: "text-orange-500" }
  if (f === "UNFULFILLED" || f === "PARTIALLY_FULFILLED" || f === "IN_PROGRESS")
    return { label: "Processing", color: "text-blue-600" }
  if (f === "RETURNED" || f === "RESTOCKED") return { label: "Returned", color: "text-purple-600" }
  if (p === "REFUNDED") return { label: "Refunded", color: "text-red-600" }
  if (p === "VOIDED") return { label: "Cancelled", color: "text-red-600" }
  if (p === "PAID") return { label: "Paid", color: "text-green-600" }
  if (p === "PENDING") return { label: "Pending payment", color: "text-orange-500" }
  return { label: fulfillmentStatus ?? "—", color: "text-gray-500" }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

type OrderCardProps = {
  order: ShopifyOrder
  customerName?: string
  customerEmail?: string
  /** Legacy: kept for order-overview compat, ignored here */
  onClick?: (order: ShopifyOrder) => void
}

export default function OrderCard({ order, customerName, customerEmail }: OrderCardProps) {
  const lineItems = order.lineItems.edges.map(e => e.node)
  const itemCount = lineItems.reduce((s, i) => s + (i.quantity ?? 0), 0)
  const status = getStatusConfig(order.fulfillmentStatus, order.financialStatus)
  const dt = order.processedAt ? fmtDateTime(order.processedAt) : null

  // Payment label derived from financialStatus (available on ShopifyOrder)
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
    : order.financialStatus ?? "—"
  const paymentColor = PAID_STATUSES.includes(fs)
    ? "text-green-600"
    : REFUNDED_STATUSES.includes(fs)
    ? "text-red-600"
    : "text-orange-500"

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      data-testid="order-card"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          {/* Left: title + meta */}
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">
              Order #{order.orderNumber ?? "—"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {itemCount} {itemCount === 1 ? "Product" : "Products"}
              {customerName ? ` · By ${customerName}` : ""}
              {dt ? ` · ${dt.time}, ${dt.short}` : ""}
            </p>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Download Invoice — no functionality yet */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
              aria-label="Download invoice"
              title="Download invoice (coming soon)"
              disabled
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download invoice</span>
            </button>

            {/* 3-dot menu — no functionality yet */}
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

      {/* ── Order Details ───────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-gray-100 space-y-2">
        <DetailRow
          label="Status:"
          value={status.label}
          valueClass={status.color}
        />
        {/* Payment status — derived from financialStatus which IS available on ShopifyOrder */}
        <DetailRow
          label="Payment:"
          value={paymentLabel}
          valueClass={paymentColor}
        />
        {/* Shipping address — now fetched from Shopify via shippingAddress on ShopifyOrder */}
        <DetailRow
          label="Delivered to:"
          value={
            order.shippingAddress
              ? [
                  [order.shippingAddress.firstName, order.shippingAddress.lastName]
                    .filter(Boolean).join(" "),
                  order.shippingAddress.address1,
                  order.shippingAddress.address2,
                  [order.shippingAddress.city, order.shippingAddress.province, order.shippingAddress.zip]
                    .filter(Boolean).join(", "),
                  order.shippingAddress.country,
                ]
                .filter(Boolean)
                .join(", ")
              : "—"
          }
        />
        {customerEmail && (
          <DetailRow label="Customer email:" value={customerEmail} />
        )}
        <DetailRow
          label="Total:"
          value={fmtPrice(
            order.currentTotalPrice?.amount ?? "0",
            order.currentTotalPrice?.currencyCode
          )}
          valueClass="text-gray-900 font-semibold"
        />
      </div>

      {/* ── Line Items Grid ─────────────────────────────────────────────────── */}
      {lineItems.length > 0 && (
        <div className="px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lineItems.map((item, idx) => {
              const imageUrl = item.variant?.image?.url ?? null
              const imageAlt = item.variant?.image?.altText ?? item.title
              const price = item.variant?.price ?? null
              const variantTitle =
                item.variant?.title && item.variant.title !== "Default Title"
                  ? item.variant.title
                  : null

              return (
                <div
                  key={`${item.title}-${idx}`}
                  className="flex items-start gap-3"
                >
                  {/* Thumbnail */}
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

                  {/* Info */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
                      {item.title ?? "—"}
                    </p>
                    {price && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Quantity: {item.quantity}x = {fmtPrice(price.amount, price.currencyCode)}
                      </p>
                    )}
                    {/* Variant title acts as the combined "Color / Size" info */}
                    {variantTitle && (
                      <p className="text-xs text-gray-400 mt-0.5">{variantTitle}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Re-export for backward compat (order-overview still uses this)
export type { OrderCardProps }
