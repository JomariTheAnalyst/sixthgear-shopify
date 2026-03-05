import { shopifyConfig } from "../env"

/**
 * Fetch client for the Shopify Admin GraphQL API.
 * Uses SHOPIFY_ADMIN_ACCESS_TOKEN.
 * MUST ONLY be called on the server.
 */
export async function shopifyAdminGraphql<T>(
  query: string,
  variables: Record<string, any> = {},
  cache: RequestCache = "no-store"
): Promise<{ data: T | null; errors?: any[] }> {
  if (typeof window !== "undefined") {
    throw new Error("shopifyAdminGraphql cannot be called from the client")
  }

  const domain = "domain" in shopifyConfig ? shopifyConfig.domain : undefined
  const adminToken = "adminToken" in shopifyConfig ? shopifyConfig.adminToken : undefined

  if (!domain || !adminToken) {
    console.warn("[shopifyAdminGraphql] Missing domain or admin token in env")
    return { data: null, errors: [{ message: "Missing admin credentials" }] }
  }

  // Explicitly requested API version for Admin API
  const endpoint = `https://${domain}/admin/api/2025-01/graphql.json`

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    })

    const result = await res.json()

    if (result.errors) {
      console.error("[shopifyAdminGraphql] GraphQL Errors:", result.errors)
      return { data: null, errors: result.errors }
    }

    if (result.data?.userErrors?.length > 0) {
      console.error("[shopifyAdminGraphql] User Errors:", result.data.userErrors)
      return { data: null, errors: result.data.userErrors }
    }

    return { data: result.data || null, errors: undefined }
  } catch (error) {
    console.error("[shopifyAdminGraphql] Fetch Error:", error)
    return { data: null, errors: [error] }
  }
}
