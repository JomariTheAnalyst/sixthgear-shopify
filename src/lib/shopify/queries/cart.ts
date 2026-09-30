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
              image {
                url
                altText
                width
                height
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
                variants(first: 50) {
                  edges {
                    node {
                      id
                      image {
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
      }
    }
  }
`;

/**
 * Checkout URL with the visitor's cookie choice encoded in it (Storefront API
 * 2025-10+ `@inContext(visitorConsent:)`), so Shopify's checkout respects it
 * even though checkout runs on a different domain. Returns null on any error.
 */
export async function getCartCheckoutUrlWithConsent(
  cartId: string,
  visitorConsent: {
    analytics: boolean
    marketing: boolean
    preferences: boolean
    saleOfData: boolean
  }
): Promise<string | null> {
  const query = `
    query cartCheckoutUrlWithConsent($cartId: ID!, $visitorConsent: VisitorConsent)
    @inContext(visitorConsent: $visitorConsent) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }
  `;

  const { data, errors } = await shopifyGraphql<{
    cart: { checkoutUrl: string } | null
  }>(query, { cartId, visitorConsent }, true, { noStore: true });

  if (errors?.length) {
    return null;
  }

  return data?.cart?.checkoutUrl ?? null;
}

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
      e.extensions?.code === "UNAUTHORIZED" ||
      e.message?.toLowerCase().includes("not found") ||
      e.message?.toLowerCase().includes("invalid") ||
      e.message?.toLowerCase().includes("does not exist")
    );
    if (isNotFound) {
      return null; // Caller will create a new cart
    }
  }

  return data?.cart || null;
}
