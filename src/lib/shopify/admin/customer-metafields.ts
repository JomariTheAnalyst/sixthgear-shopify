import { shopifyAdminGraphql } from "../admin-client"

// ─── Queries & Mutations ──────────────────────────────────────────────────────

const GET_CUSTOMER_WISHLIST = `
  query getCustomerWishlist($id: ID!) {
    customer(id: $id) {
      metafield(namespace: "custom", key: "wishlist") {
        id
        value
      }
    }
  }
`

const SET_CUSTOMER_METAFIELD = `
  mutation setCustomerMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Reads the wishlist metafield for a specific customer.
 * Returns the raw JSON string value or null if it doesn't exist.
 */
export async function adminGetCustomerWishlist(customerId: string): Promise<string | null> {
  const { data, errors } = await shopifyAdminGraphql<any>(GET_CUSTOMER_WISHLIST, {
    id: customerId,
  })

  if (errors?.length) {
    console.error("[adminGetCustomerWishlist] Failed to read:", errors)
    return null
  }

  return data?.customer?.metafield?.value || null
}

/**
 * Writes the wishlist metafield for a specific customer.
 * Value should be a JSON string of product GIDs.
 */
export async function adminSetCustomerWishlist(customerId: string, jsonValue: string): Promise<boolean> {
  const { data, errors } = await shopifyAdminGraphql<any>(SET_CUSTOMER_METAFIELD, {
    metafields: [
      {
        ownerId: customerId,
        namespace: "custom",
        key: "wishlist",
        type: "json",
        value: jsonValue,
      },
    ],
  })

  if (errors?.length) {
    console.error("[adminSetCustomerWishlist] Failed to write:", errors)
    return false
  }

  if (data?.metafieldsSet?.userErrors?.length > 0) {
    console.error("[adminSetCustomerWishlist] User errors:", data.metafieldsSet.userErrors)
    return false
  }

  return true
}
