import { IMAGE_FRAGMENT, MONEY_FRAGMENT, PRODUCT_CARD_FRAGMENT } from "../fragments";

export const predictiveSearchQuery = `
  query predictiveSearch($query: String!) {
    predictiveSearch(query: $query, limit: 5, limitScope: EACH, types: [PRODUCT, COLLECTION, PAGE]) {
      products {
        id
        title
        handle
        featuredImage {
          ...ImageFragment
        }
        priceRange {
          minVariantPrice {
            ...MoneyFragment
          }
        }
        availableForSale
      }
      collections {
        id
        title
        handle
        image {
          ...ImageFragment
        }
      }
      pages {
        id
        title
        handle
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

export const searchProductsQuery = `
  query searchProducts($query: String!, $first: Int!, $after: String, $sortKey: SearchSortKeys) {
    search(query: $query, first: $first, after: $after, types: [PRODUCT], sortKey: $sortKey) {
      edges {
        node {
          ... on Product {
            ...ProductCardFragment
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;
