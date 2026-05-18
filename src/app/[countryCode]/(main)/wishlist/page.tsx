import { Metadata } from "next"
import WishlistTemplate from "@modules/wishlist/templates/wishlist-template"

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your saved products.",
}

export default function WishlistPage() {
  return <WishlistTemplate />
}

