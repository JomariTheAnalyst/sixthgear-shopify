import { shopifyGraphql } from "../client";
import { ShopifyCart } from "../types";

const isServer = () => typeof window === "undefined";

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

export async function cartCreate(): Promise<ShopifyCart | null> {
  const query = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;
  
  const { data, errors } = await shopifyGraphql<any>(query, { input: {} }, isServer());
  if (data?.cartCreate?.userErrors?.length) {
    console.error("Cart Create Errors:", data.cartCreate.userErrors);
  }
  return data?.cartCreate?.cart || null;
}

export async function cartLinesAdd(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<ShopifyCart | null> {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<any>(query, { cartId, lines }, isServer());
  if (data?.cartLinesAdd?.userErrors?.length) {
    console.error("Cart Lines Add Errors:", data.cartLinesAdd.userErrors);
  }
  return data?.cartLinesAdd?.cart || null;
}

export async function cartLinesUpdate(cartId: string, lines: { id: string; quantity: number }[]): Promise<ShopifyCart | null> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<any>(query, { cartId, lines }, isServer());
  if (data?.cartLinesUpdate?.userErrors?.length) {
    console.error("Cart Lines Update Errors:", data.cartLinesUpdate.userErrors);
  }
  return data?.cartLinesUpdate?.cart || null;
}

export async function cartLinesRemove(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<any>(query, { cartId, lineIds }, isServer());
  if (data?.cartLinesRemove?.userErrors?.length) {
    console.error("Cart Lines Remove Errors:", data.cartLinesRemove.userErrors);
  }
  return data?.cartLinesRemove?.cart || null;
}

export async function cartDiscountCodesUpdate(cartId: string, discountCodes: string[]): Promise<ShopifyCart | null> {
  const query = `
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<any>(query, { cartId, discountCodes }, isServer());
  return data?.cartDiscountCodesUpdate?.cart || null;
}

export async function cartBuyerIdentityUpdate(cartId: string, buyerIdentity: { email?: string; phone?: string; customerAccessToken?: string; countryCode?: string }): Promise<ShopifyCart | null> {
  const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<any>(query, { cartId, buyerIdentity }, isServer());
  return data?.cartBuyerIdentityUpdate?.cart || null;
}
