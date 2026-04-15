import { shopifyGraphql } from "../client";
import { ShopifyCustomer } from "../types";

const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!, $cursor: String) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      createdAt
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        provinceCode
        country
        countryCodeV2
        zip
        phone
        name
      }
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            provinceCode
            country
            countryCodeV2
            zip
            phone
            name
          }
        }
      }
      orders(first: 10, after: $cursor, sortKey: PROCESSED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            canceledAt
            cancelReason
            successfulFulfillments {
              trackingInfo {
                number
                url
              }
            }
            currentTotalPrice {
              amount
              currencyCode
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
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
                      handle
                      title
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

export async function getCustomer(
  customerAccessToken: string,
  cursor?: string
): Promise<ShopifyCustomer | null> {
  const { data, errors } = await shopifyGraphql<any>(
    GET_CUSTOMER_QUERY,
    { customerAccessToken, cursor: cursor ?? null },
    true
  );

  if (errors?.length) {
    const isExpired = errors.some(
      (e: any) =>
        e.extensions?.code === "UNAUTHORIZED" ||
        e.message?.toLowerCase().includes("unauthorized") ||
        e.message?.toLowerCase().includes("invalid") ||
        e.message?.toLowerCase().includes("expired")
    );
    if (isExpired) {
      return null;
    }
  }

  return data?.customer ?? null;
}
