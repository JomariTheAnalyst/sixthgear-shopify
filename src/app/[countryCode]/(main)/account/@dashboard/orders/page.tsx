import { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import OrdersTemplate from "@modules/account/templates/orders-template"
import OrdersSkeleton from "@modules/account/components/orders-skeleton"

export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and manage your past orders.",
}

export default async function OrdersPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  // Already sorted newest-first by the GQL query: orders(sortKey: PROCESSED_AT, reverse: true)
  const orders = customer.orders?.edges?.map(e => e.node) ?? []

  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersTemplate orders={orders} customer={customer} />
    </Suspense>
  )
}
