import { Metadata } from "next"
import { draftMode } from "next/headers"

import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getMarketingForPath } from "@lib/data/marketing"
import { getBaseURL } from "@lib/util/env"
import { mapShopifyCartToStoreCart } from "@lib/util/map-shopify-cart"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import CartDrawerWrapper from "@modules/cart/components/cart-drawer-wrapper"
import CartCleanup from "@modules/cart/components/cart-cleanup"
import { MarketingProvider } from "@modules/marketing"
import PreviewBanner from "@modules/marketing/components/preview-banner"
import { SelectedItemsProvider } from "@lib/context/selected-cart-items-context"
import { CartLimitModalProvider } from "@lib/context/cart-limit-modal-context"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const shopifyCart = await retrieveCart()
  const cart = mapShopifyCartToStoreCart(shopifyCart)
  const draft = await draftMode()

  // Fetch marketing content for the layout (strip only at this level)
  const marketing = await getMarketingForPath("/")

  return (
    <CartLimitModalProvider>
      <SelectedItemsProvider>
        <CartDrawerWrapper cart={cart}>
          {/* Cart cleanup component - removes shipping methods when leaving checkout */}
          <CartCleanup cartId={cart?.id} />

          <MarketingProvider marketing={marketing}>
            <Nav />

            {props.children}
            <Footer />

            {/* Preview Mode Banner */}
            <PreviewBanner isPreview={draft.isEnabled} />
          </MarketingProvider>
        </CartDrawerWrapper>
      </SelectedItemsProvider>
    </CartLimitModalProvider>
  )
}
