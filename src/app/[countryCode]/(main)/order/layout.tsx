import type { Metadata } from "next"

import { getNoindexFollowRobots } from "@lib/seo"

// Order confirmation and transfer pages are private to the customer.
export const metadata: Metadata = {
  robots: getNoindexFollowRobots(),
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children
}
