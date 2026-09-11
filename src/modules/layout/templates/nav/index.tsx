import { listRegions } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { StoreRegion, HttpTypes } from "@medusajs/types"
import { mapShopifyCartToStoreCart } from "@lib/util/map-shopify-cart"
import NavClient from "./nav-client"
import { getAllServices } from "@lib/strapi/services"
import { getLatestBlogPosts } from "@lib/cms/client"

export default async function Nav() {
  const [regions, shopifyCart, customer, services, latestBlogPosts] =
    await Promise.all([
      listRegions().catch(() => [] as StoreRegion[]),
      retrieveCart().catch(() => null),
      retrieveCustomer().catch(() => null),
      getAllServices().catch(() => []),
      getLatestBlogPosts(),
    ])

  const cart = mapShopifyCartToStoreCart(shopifyCart)
  const clientStories = latestBlogPosts
    .filter((story) => story.title && story.slug)
    .slice(0, 2)

  return (
    <NavClient
      regions={regions}
      cart={cart}
      servicesData={services}
      clientStories={clientStories}
      customer={customer}
      wishlistCount={0}
    />
  )
}
