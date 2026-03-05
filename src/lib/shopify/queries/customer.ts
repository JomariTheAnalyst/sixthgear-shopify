import { shopifyGraphql } from "../client";
import { ShopifyCustomer } from "../types";

const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
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
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
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
  customerAccessToken: string
): Promise<ShopifyCustomer | null> {
  const { data, errors } = await shopifyGraphql<any>(
    GET_CUSTOMER_QUERY,
    { customerAccessToken },
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
    console.error("[getCustomer] GraphQL errors:", errors);
  }

  return data?.customer ?? null;
}
