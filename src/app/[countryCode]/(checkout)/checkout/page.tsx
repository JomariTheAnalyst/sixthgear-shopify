import { Metadata } from "next"

import CheckoutClient from "./checkout-client"

export const metadata: Metadata = {
  title: "Checkout",
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
