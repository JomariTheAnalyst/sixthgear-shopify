import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import Nav from "@modules/layout/templates/nav"
import Footer from "@modules/layout/templates/footer"
import CartDrawerWrapper from "@modules/cart/components/cart-drawer-wrapper"
import { retrieveCart } from "@lib/data/cart"
import { mapShopifyCartToStoreCart } from "@lib/util/map-shopify-cart"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const shopifyCart = await retrieveCart().catch(() => null)
  const cart = mapShopifyCartToStoreCart(shopifyCart)

  return (
    <CartDrawerWrapper cart={cart}>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartDrawerWrapper>
  )
}
