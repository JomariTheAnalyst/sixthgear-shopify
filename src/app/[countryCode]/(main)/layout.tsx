import { Metadata } from "next"
import { Suspense } from "react"

import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getMarketingForPath } from "@lib/data/marketing"
import { mapShopifyCartToStoreCart } from "@lib/util/map-shopify-cart"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import CartDrawerWrapper from "@modules/cart/components/cart-drawer-wrapper"
import CartCleanup from "@modules/cart/components/cart-cleanup"
import { MarketingProvider } from "@modules/marketing"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import { getMarketingData } from "@lib/cms/client"
import { SelectedItemsProvider } from "@lib/context/selected-cart-items-context"
import { CartLimitModalProvider } from "@lib/context/cart-limit-modal-context"
import JsonLd from "@modules/common/components/json-ld"
import LenisProvider from "@modules/common/components/lenis-provider"
import Preloader from "@modules/common/components/preloader"
import RouteProgress from "@modules/common/components/route-progress"
import {
  generateLocalBusinessSchema,
  getOrganizationStructuredData,
  getSeoMetadataBase,
} from "@lib/seo"
import "lenis/dist/lenis.css"

export const metadata: Metadata = {
  metadataBase: getSeoMetadataBase(),
}

export default async function PageLayout(props: {
  children: React.ReactNode
  overlay: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const customer = await retrieveCustomer()
  const shopifyCart = await retrieveCart()
  const cart = mapShopifyCartToStoreCart(shopifyCart)
  const organizationStructuredData = getOrganizationStructuredData()
  const localBusinessStructuredData = generateLocalBusinessSchema()

  // Fetch marketing content for the layout (strip only at this level)
  const marketing = await getMarketingForPath("/")
  const sanityMarketing = await getMarketingData()

  return (
    <LenisProvider>
      <Preloader />
      <Suspense fallback={null}>
        <RouteProgress />
      </Suspense>
      <CartLimitModalProvider>
        <SelectedItemsProvider>
          <CartDrawerWrapper cart={cart}>
          <JsonLd
            id="organization-structured-data"
            data={organizationStructuredData}
          />
          <JsonLd
            id="local-business-structured-data"
            data={localBusinessStructuredData}
          />
          {/* Cart cleanup component - removes shipping methods when leaving checkout */}
          <CartCleanup cartId={cart?.id} />

          <MarketingProvider marketing={marketing}>
            <div className="sticky top-0 z-[60] bg-white">
              <AnnouncementBar data={sanityMarketing.announcementBar} />
              <Nav />
            </div>

            {props.children}
            {props.overlay}
            <Footer />

          </MarketingProvider>
          </CartDrawerWrapper>
        </SelectedItemsProvider>
      </CartLimitModalProvider>
    </LenisProvider>
  )
}
