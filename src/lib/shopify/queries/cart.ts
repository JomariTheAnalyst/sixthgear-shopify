import { shopifyGraphql } from "../client";
import { ShopifyCart } from "../types";

const CART_FRAGMENT = `
  fragment CartDetails on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    buyerIdentity {
      email
      phone
      countryCode
      customer {
        id
        firstName
        lastName
        email
        phone
      }
    }
    discountCodes {
      applicable
      code
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartDetails
      }
    }
    ${CART_FRAGMENT}
  `;

  const isServer = typeof window === "undefined";
  const { data, errors } = await shopifyGraphql<any>(query, { cartId }, isServer);

  if (errors?.length) {
    const isNotFound = errors.some((e: any) =>
      e.message?.toLowerCase().includes("not found") ||
      e.message?.toLowerCase().includes("invalid") ||
      e.message?.toLowerCase().includes("does not exist")
    );
    if (isNotFound) {
      return null; // Caller will create a new cart
    }
    console.error("[cart query] Errors:", errors);
  }

  return data?.cart || null;
}
