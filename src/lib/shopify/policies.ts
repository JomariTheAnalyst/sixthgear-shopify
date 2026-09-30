import { cacheKey, getCached } from "@lib/cache/redis"
import { shopifyGraphql } from "./client"

/**
 * /privacy switch. Off: the page keeps its built-in text. Turn it on (true)
 * once the new Privacy Policy is pasted into Shopify admin > Settings >
 * Policies; the page then shows Shopify's version (and falls back to the
 * built-in text if Shopify's is empty).
 */
export const USE_SHOPIFY_PRIVACY_POLICY = false

export type ShopPolicy = {
  title: string
  body: string
  url: string | null
}

export type ShopPolicies = {
  privacyPolicy: ShopPolicy | null
  termsOfService: ShopPolicy | null
}

const SHOP_POLICIES_QUERY = `
  query shopPolicies {
    shop {
      privacyPolicy { title body url }
      termsOfService { title body url }
    }
  }
`

const POLICIES_CACHE_TTL = 60 * 60 // 1 hour

function toPolicy(value: any): ShopPolicy | null {
  const body = typeof value?.body === "string" ? value.body.trim() : ""
  if (!body) return null

  return {
    title: typeof value.title === "string" ? value.title : "",
    body,
    url: typeof value.url === "string" ? value.url : null,
  }
}

/** Store policies from the Storefront API. Empty policies come back as null. */
export async function getShopPolicies(): Promise<ShopPolicies> {
  try {
    return await getCached(
      cacheKey("shop-policies", "v1"),
      async () => {
        const { data, errors } = await shopifyGraphql<{ shop: any }>(
          SHOP_POLICIES_QUERY
        )

        if (errors?.length || !data?.shop) {
          throw new Error("[policies] Unable to load Shopify store policies")
        }

        return {
          privacyPolicy: toPolicy(data.shop.privacyPolicy),
          termsOfService: toPolicy(data.shop.termsOfService),
        }
      },
      POLICIES_CACHE_TTL
    )
  } catch (error) {
    console.error(error)
    return { privacyPolicy: null, termsOfService: null }
  }
}
