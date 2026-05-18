import { IMAGE_FRAGMENT, MONEY_FRAGMENT, PRODUCT_CARD_FRAGMENT, SEO_FRAGMENT } from "../fragments";

// Fetch all available filter options for the collection sidebar.
// Uses first: 0 to fetch zero products — only filter metadata needed.
export const getCollectionFiltersQuery = `
  query GetCollectionFilters($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 0) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  }
`;

// Fetch filtered + sorted products for collection page.
// Reuses existing fragments. Omits quantityAvailable (token lacks inventory permission).
export const getCollectionWithFiltersQuery = `
  query GetCollectionWithFilters(
    $handle: String!
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        ...ImageFragment
      }
      products(
        first: $first
        after: $after
        last: $last
        before: $before
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values { id label count input }
        }
        edges {
          cursor
          node {
            id
            title
            handle
            availableForSale
            vendor
            productType
            tags
            featuredImage {
              ...ImageFragment
            }
            priceRange {
              minVariantPrice { ...MoneyFragment }
              maxVariantPrice { ...MoneyFragment }
            }
            compareAtPriceRange {
              minVariantPrice { ...MoneyFragment }
            }
            images(first: 10) {
              edges {
                node {
                  ...ImageFragment
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  availableForSale
                  price { ...MoneyFragment }
                  compareAtPrice { ...MoneyFragment }
                  selectedOptions { name value }
                  image { ...ImageFragment }
                }
              }
            }
            options { id name values }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

// Keep existing queries for backward compatibility
export const getCollectionQuery = `
  query getCollection($handle: String!, $first: Int, $after: String, $last: Int, $before: String, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        ...ImageFragment
      }
      seo {
        ...SeoFragment
      }
      products(first: $first, after: $after, last: $last, before: $before, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductCardFragment
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  ${SEO_FRAGMENT}
`;

export const getCollectionsQuery = `
  query getCollections($first: Int!) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          isCollectionFeatured: metafield(namespace: "custom", key: "is_collection_featured") {
            key
            namespace
            value
            type
          }
          image {
            ...ImageFragment
          }
          description
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;
