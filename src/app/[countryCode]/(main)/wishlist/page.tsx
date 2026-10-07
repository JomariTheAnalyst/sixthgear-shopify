import { Metadata } from "next"
import { getNoindexFollowRobots } from "@lib/seo"
import WishlistTemplate from "@modules/wishlist/templates/wishlist-template"

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your saved products.",
  robots: getNoindexFollowRobots(),
}

export default function WishlistPage() {
  return <WishlistTemplate />
}

