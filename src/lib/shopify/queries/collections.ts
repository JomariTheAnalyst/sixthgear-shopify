import { shopifyGraphql } from "../client";
import { ShopifyCollection } from "../types";

const COLLECTION_FRAGMENT = `
  fragment CollectionDetails on Collection {
    id
    handle
    title
    description
    image {
      url
      altText
      width
      height
    }
  }
`;

export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const query = `
    query getCollection($handle: String!) {
      collection(handle: $handle) {
        ...CollectionDetails
        products(first: 50) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              id
              handle
              title
              description
              descriptionHtml
              availableForSale
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ${COLLECTION_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<{ collection: ShopifyCollection }>(query, { handle });
  return data?.collection || null;
}

export async function getCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            ...CollectionDetails
          }
        }
      }
    }
    ${COLLECTION_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<any>(query, { first });
  return data?.collections?.edges?.map((e: any) => e.node) || [];
}
