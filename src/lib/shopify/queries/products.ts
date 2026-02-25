import { shopifyGraphql } from "../client";
import { ShopifyProduct } from "../types";

const PRODUCT_FRAGMENT = `
  fragment ProductDetails on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    options {
      id
      name
      values
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
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
`;

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductDetails
        metafield(namespace: "custom", key: "details") {
          value
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `;
  
  const { data } = await shopifyGraphql<{ product: ShopifyProduct }>(query, { handle });
  return data?.product || null;
}

export async function getProducts(
  first: number = 20, 
  after?: string, 
  searchQuery?: string
): Promise<{ products: ShopifyProduct[]; pageInfo: { hasNextPage: boolean; endCursor?: string } }> {
  const query = `
    query getProducts($first: Int!, $after: String, $searchQuery: String) {
      products(first: $first, after: $after, query: $searchQuery) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...ProductDetails
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<any>(query, { first, after, searchQuery: searchQuery || "" });
  
  if (!data?.products) {
    return { products: [], pageInfo: { hasNextPage: false } };
  }
  
  return {
    products: data.products.edges.map((e: any) => e.node),
    pageInfo: data.products.pageInfo,
  };
}

export async function getProductRecommendations(productId: string): Promise<ShopifyProduct[]> {
  const query = `
    query getProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        ...ProductDetails
      }
    }
    ${PRODUCT_FRAGMENT}
  `;

  const { data } = await shopifyGraphql<{ productRecommendations: ShopifyProduct[] }>(query, { productId });
  return data?.productRecommendations || [];
}
