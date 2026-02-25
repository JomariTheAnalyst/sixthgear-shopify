import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { clientEnv, shopifyConfig } from "../env";

const publicAccessToken = clientEnv.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const publicDomain = clientEnv.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

// Private client getter (Server exactly only)
function getServerClient() {
  if (!("domain" in shopifyConfig) || !("token" in shopifyConfig) || !("apiVersion" in shopifyConfig)) {
    throw new Error("[shopify] Server Shopify config is not available in browser context.");
  }

  return createStorefrontApiClient({
    storeDomain: shopifyConfig.domain!,
    apiVersion: shopifyConfig.apiVersion!,
    privateAccessToken: shopifyConfig.token!,
  });
}

// Public client getter (Client only)
function getClientClient() {
  if (!publicDomain) {
    throw new Error(
      "[shopify] Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN for client-side Shopify requests."
    );
  }

  return createStorefrontApiClient({
    storeDomain: publicDomain,
    apiVersion: "2025-01",
    publicAccessToken,
  });
}

export async function shopifyGraphql<T>(
  query: string,
  variables: Record<string, any> = {},
  isServer: boolean = true
): Promise<{ data: T | null; errors?: any[] }> {
  try {
    const client = isServer ? getServerClient() : getClientClient();
    const { data, errors } = await client.request<T>(query, { variables });
    
    // errors returned by Shopify client SDK aren't standard arrays internally
    const errs = errors ? (errors as any).graphQLErrors || errors : [];

    if (errs && errs.length > 0) {
      console.error("Shopify GraphQL Errors:", errs);
    }
    
    return { data: data || null, errors: errs };
  } catch (error) {
    console.error("Shopify Network/Client Error:", error);
    return { data: null, errors: [error] };
  }
}
