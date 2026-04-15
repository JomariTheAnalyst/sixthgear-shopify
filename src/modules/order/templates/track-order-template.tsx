"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function TrackOrderTemplate() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F16D34]">
              Order Tracking
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Track your order through your confirmation email or account
            </h1>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              We no longer support manual guest order lookup on this page. For the
              most accurate tracking updates, check your order confirmation email
              for your Shopify tracking link.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-sm font-semibold text-gray-900">
                Check your confirmation email
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your order confirmation email includes the tracking link for your
                purchase once fulfillment information is available.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-sm font-semibold text-gray-900">
                Signed-in customers
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Sign in to your account to review order history and open the live
                Shopify tracking page from your order details.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LocalizedClientLink
              href="/account/orders"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Sign in to view your orders
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
            >
              Need help with an order?
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
