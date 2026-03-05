import { listRegions } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { StoreRegion, HttpTypes } from "@medusajs/types"
import { mapShopifyCartToStoreCart } from "@lib/util/map-shopify-cart"
import NavClient from "./nav-client"
import { getAllServices } from "@lib/strapi/services"

export default async function Nav() {
  const regions = await listRegions().catch(() => [] as StoreRegion[])
  const shopifyCart = await retrieveCart().catch(() => null)
  const cart = mapShopifyCartToStoreCart(shopifyCart)
  const customer = await retrieveCustomer().catch(() => null)
  const services = await getAllServices().catch(() => [])

  return (
    <NavClient
      regions={regions}
      cart={cart}
      servicesData={services}
      customer={customer}
      wishlistCount={0}
    />
  )
}
