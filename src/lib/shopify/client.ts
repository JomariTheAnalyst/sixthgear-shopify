import { createStorefrontApiClient } from "@shopify/storefront-api-client"
import { clientEnv, shopifyConfig } from "../env"

const publicAccessToken = clientEnv.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
const publicDomain = clientEnv.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

function withServerCacheOptions(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, {
    ...init,
    next: {
      tags: ["shopify"],
      revalidate: 300,
    },
  })
}

function withServerNoStoreOptions(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, {
    ...init,
    cache: "no-store",
  })
}

function getServerClient(isAuthenticatedRequest: boolean = false) {
  if (
    !("domain" in shopifyConfig) ||
    !("token" in shopifyConfig) ||
    !("apiVersion" in shopifyConfig)
  ) {
    throw new Error(
      "[shopify] Server Shopify config is not available in browser context."
    )
  }

  return createStorefrontApiClient({
    storeDomain: shopifyConfig.domain!,
    apiVersion: shopifyConfig.apiVersion!,
    privateAccessToken: shopifyConfig.token!,
    // SDK types in this version don't expose fetch override, but runtime supports it.
    fetchApi: isAuthenticatedRequest
      ? withServerNoStoreOptions
      : withServerCacheOptions,
  } as any)
}

function getClientClient() {
  if (!publicDomain) {
    throw new Error(
      "[shopify] Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN for client-side Shopify requests."
    )
  }

  const apiVersion =
    "apiVersion" in shopifyConfig && shopifyConfig.apiVersion
      ? shopifyConfig.apiVersion
      : "2025-10"

  return createStorefrontApiClient({
    storeDomain: publicDomain,
    apiVersion,
    publicAccessToken,
  })
}

export async function shopifyGraphql<T>(
  query: string,
  variables: Record<string, any> = {},
  isServer: boolean = true,
  options: { noStore?: boolean } = {}
): Promise<{ data: T | null; errors?: any[] }> {
  try {
    const isAuthenticatedRequest =
      variables != null &&
      Object.prototype.hasOwnProperty.call(variables, "customerAccessToken")

    const client = isServer
      ? getServerClient(isAuthenticatedRequest || options.noStore === true)
      : getClientClient()
    const { data, errors } = await client.request<T>(query, { variables })

    const errs = errors ? (errors as any).graphQLErrors || errors : []

    if (errs && errs.length > 0) {
    }

    return { data: data || null, errors: errs }
  } catch (error) {
    console.error(error)
    return { data: null, errors: [error] }
  }
}
