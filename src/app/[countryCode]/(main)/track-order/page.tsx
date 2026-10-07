import { Metadata } from "next"
import { getNoindexFollowRobots } from "@lib/seo"
import TrackOrderTemplate from "@modules/order/templates/track-order-template"

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your SixthGear Moto order status and delivery information.",
  robots: getNoindexFollowRobots(),
}

export default function TrackOrderPage() {
  return <TrackOrderTemplate />
}
