import { shopifyGraphql } from "../client"
import { ShopifyReceiptOrder } from "../types"

const GET_RECEIPT_ORDER_QUERY = `
  query getReceiptOrder($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        orderNumber
        processedAt
        fulfillmentStatus
        currentSubtotalPrice {
          amount
          currencyCode
        }
        currentTotalShippingPrice {
          amount
          currencyCode
        }
        currentTotalTax {
          amount
          currencyCode
        }
        currentTotalPrice {
          amount
          currencyCode
        }
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              variant {
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                product {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function getReceiptOrderById(
  id: string
): Promise<ShopifyReceiptOrder | null> {
  const { data, errors } = await shopifyGraphql<{ node: ShopifyReceiptOrder | null }>(
    GET_RECEIPT_ORDER_QUERY,
    { id },
    true
  )

  if (errors?.length) {
  }

  return data?.node ?? null
}
