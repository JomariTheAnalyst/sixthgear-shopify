import { Metadata } from "next"
import { draftMode } from "next/headers"

import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getMarketingForPath } from "@lib/data/marketing"
import { mapShopifyCartToStoreCart } from "@lib/util/map-shopify-cart"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import CartDrawerWrapper from "@modules/cart/components/cart-drawer-wrapper"
import CartCleanup from "@modules/cart/components/cart-cleanup"
import { MarketingProvider } from "@modules/marketing"
import PreviewBanner from "@modules/marketing/components/preview-banner"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import { getMarketingData } from "@lib/cms/client"
import { SelectedItemsProvider } from "@lib/context/selected-cart-items-context"
import { CartLimitModalProvider } from "@lib/context/cart-limit-modal-context"
import JsonLd from "@modules/common/components/json-ld"
import {
  generateLocalBusinessSchema,
  getOrganizationStructuredData,
  getSeoMetadataBase,
  getWebsiteStructuredData,
} from "@lib/seo"

export const metadata: Metadata = {
  metadataBase: getSeoMetadataBase(),
}

export default async function PageLayout(props: {
  children: React.ReactNode
  overlay: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  const shopifyCart = await retrieveCart()
  const cart = mapShopifyCartToStoreCart(shopifyCart)
  const draft = await draftMode()
  const organizationStructuredData = getOrganizationStructuredData(countryCode)
  const localBusinessStructuredData = generateLocalBusinessSchema(countryCode)
  const websiteStructuredData = getWebsiteStructuredData(countryCode)

  // Fetch marketing content for the layout (strip only at this level)
  const marketing = await getMarketingForPath("/")
  const sanityMarketing = await getMarketingData()

  return (
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
          <JsonLd id="website-structured-data" data={websiteStructuredData} />
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

            {/* Preview Mode Banner */}
            <PreviewBanner isPreview={draft.isEnabled} />
          </MarketingProvider>
        </CartDrawerWrapper>
      </SelectedItemsProvider>
    </CartLimitModalProvider>
  )
}
