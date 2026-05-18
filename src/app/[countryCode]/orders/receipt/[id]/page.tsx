import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getReceiptOrderById } from "@lib/shopify/queries/orders"

export const metadata: Metadata = {
  title: "Order Receipt",
}

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

function formatCurrency(amount: string, currencyCode: string) {
  const parsed = parseFloat(amount || "0")
  if (Number.isNaN(parsed)) return `${currencyCode} 0.00`

  return `${currencyCode === "PHP" ? "PHP" : currencyCode} ${parsed.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function getReceiptStatus(fulfillmentStatus?: string | null) {
  const normalized = fulfillmentStatus?.toUpperCase?.() ?? "UNFULFILLED"
  const activeStatuses = new Set(["UNFULFILLED", "OPEN", "IN_PROGRESS", "PARTIALLY_FULFILLED", "FULFILLED"])
  return {
    label:
      normalized === "IN_PROGRESS" || normalized === "PARTIALLY_FULFILLED"
        ? "Processing"
        : normalized === "FULFILLED"
          ? "Shipped"
          : normalized === "RESTOCKED"
            ? "Returned"
            : normalized === "DELIVERED"
              ? "Delivered"
              : "Not Fulfilled",
    isActive: activeStatuses.has(normalized),
  }
}

function ReceiptEdge({ flipped = false }: { flipped?: boolean }) {
  const teeth = Array.from({ length: 21 }, (_, index) => {
    const left = index * 20
    return `${left},20 ${left + 10},0 ${left + 20},20`
  }).join(" ")

  return (
    <svg
      viewBox="0 0 420 20"
      xmlns="http://www.w3.org/2000/svg"
      className={`block h-5 w-full ${flipped ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <polygon points={teeth} fill="white" />
    </svg>
  )
}

export default async function OrderReceiptPage(props: Props) {
  const params = await props.params
  const orderId = decodeURIComponent(params.id)
  const order = await getReceiptOrderById(orderId).catch(() => null)

  if (!order) {
    notFound()
  }

  const status = getReceiptStatus(order.fulfillmentStatus)
  const lineItems = order.lineItems.edges.map((edge) => edge.node)
  const orderDate = new Date(order.processedAt).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  return (
    <main className="min-h-screen bg-[#f4f2ee] px-4 py-10 [font-family:var(--font-poppins)]">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="overflow-hidden [filter:drop-shadow(0_24px_80px_rgba(15,23,42,0.16))]">
          <ReceiptEdge />

          <div className="bg-white px-7 py-8">
            <div className="text-center">
              <Image
                src="/images/logo/sixthgear-removebg-preview.png"
                alt="SixthGearMoto"
                width={220}
                height={42}
                className="mx-auto h-auto w-[220px]"
                priority
              />
            </div>

            <hr className="my-5 border-gray-200" />

            <div className="text-center">
              <p className="text-[13px] font-medium uppercase tracking-[0.28em] text-gray-500">
                Receipt
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-black">Order #{order.orderNumber}</h1>
              <p className="mt-2 text-sm text-gray-500">{orderDate}</p>
            </div>

            <hr className="my-5 border-gray-200" />

            <div className="space-y-4">
              {lineItems.map((item, index) => {
                const amount = item.variant?.price?.amount ?? "0"
                const currencyCode = item.variant?.price?.currencyCode ?? order.currentTotalPrice.currencyCode
                const variantTitle =
                  item.variant?.title && item.variant.title !== "Default Title"
                    ? item.variant.title
                    : null

                return (
                  <div key={`${item.title}-${index}`} className="flex items-start gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.variant?.image?.url ? (
                        <Image
                          src={item.variant.image.url}
                          alt={item.variant.image.altText || item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                          Item
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium leading-5 text-black">{item.title}</p>
                          {variantTitle ? (
                            <p className="mt-1 text-xs text-gray-500">{variantTitle}</p>
                          ) : null}
                        </div>
                        <p className="shrink-0 text-sm font-medium text-black">
                          {formatCurrency((parseFloat(amount) * item.quantity).toString(), currencyCode)}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.quantity} x {formatCurrency(amount, currencyCode)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <hr className="my-5 border-gray-200" />

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.currentSubtotalPrice.amount, order.currentSubtotalPrice.currencyCode)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatCurrency(order.currentTotalShippingPrice.amount, order.currentTotalShippingPrice.currencyCode)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(order.currentTotalTax.amount, order.currentTotalTax.currencyCode)}</span>
              </div>
              <div className="border-t border-dashed border-gray-300 pt-3 text-[15px] font-semibold text-black">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}</span>
                </div>
              </div>
            </div>

            <hr className="my-5 border-gray-200" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Status</span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                  status.isActive ? "bg-[#f97316] text-white" : "bg-black text-white"
                }`}
              >
                {status.label}
              </span>
            </div>

            <hr className="my-5 border-gray-200" />

            <div className="space-y-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                Sixthgear Moto Supply and cafe + lounge
              </p>
              <div className="space-y-1 text-xs leading-5 text-gray-500">
                <p>3610 Bautista St, Makati City, Metro Manila</p>
                <p>0995 093 0157</p>
                <p>support@sixthgearmoto.com</p>
              </div>
            </div>
          </div>

          <ReceiptEdge flipped />
        </div>
      </div>
    </main>
  )
}
