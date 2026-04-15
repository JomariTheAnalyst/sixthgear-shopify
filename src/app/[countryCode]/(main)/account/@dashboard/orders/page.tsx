import { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCustomerOrders, getCustomerToken } from "@lib/data/customer"
import OrdersTemplate from "@modules/account/templates/orders-template"
import OrdersSkeleton from "@modules/account/components/orders-skeleton"

export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and manage your past orders.",
}

export default async function OrdersPage() {
  const customerToken = await getCustomerToken()
  if (!customerToken) {
    notFound()
  }

  const initialOrders = await getCustomerOrders().catch(() => ({
    orders: [],
    pageInfo: { hasNextPage: false, endCursor: null },
  }))

  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersTemplate
        orders={initialOrders.orders}
        pageInfo={initialOrders.pageInfo}
      />
    </Suspense>
  )
}
