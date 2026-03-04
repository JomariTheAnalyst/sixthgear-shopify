import { IMAGE_FRAGMENT, MONEY_FRAGMENT, PRODUCT_CARD_FRAGMENT, SEO_FRAGMENT } from "../fragments";

export const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      vendor
      productType
      tags
      featuredImage {
        ...ImageFragment
      }
      images(first: 20) {
        edges {
          node {
            ...ImageFragment
          }
        }
      }
      priceRange {
        minVariantPrice {
          ...MoneyFragment
        }
        maxVariantPrice {
          ...MoneyFragment
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          ...MoneyFragment
        }
      }
      options {
        id
        name
        values
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
              ...MoneyFragment
            }
            compareAtPrice {
              ...MoneyFragment
            }
            image {
              ...ImageFragment
            }
          }
        }
      }
      seo {
        ...SeoFragment
      }
      metafields(identifiers: [
        {namespace: "custom", key: "care_instructions"},
        {namespace: "custom", key: "size_guide"},
        {namespace: "custom", key: "material"},
        {namespace: "reviews", key: "rating"},
        {namespace: "reviews", key: "rating_count"}
      ]) {
        key
        value
        namespace
        type
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${SEO_FRAGMENT}
`;

export const getProductsQuery = `
  query getProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query, sortKey: RELEVANCE) {
      edges {
        node {
          ...ProductCardFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;

export const getProductRecommendationsQuery = `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId, intent: RELATED) {
      ...ProductCardFragment
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;
