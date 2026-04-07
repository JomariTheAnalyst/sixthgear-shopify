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
        # Shopify Standard Product Taxonomy (Category metafields)
        {namespace: "shopify", key: "color"},
        {namespace: "shopify", key: "accessory_size"},
        {namespace: "shopify", key: "material"},
        {namespace: "shopify", key: "age_group"},
        {namespace: "shopify", key: "target_gender"},
        # Also try common taxonomy aliases
        {namespace: "shopify", key: "handwear_material"},
        {namespace: "shopify", key: "size"},
        {namespace: "shopify", key: "gender"},
        # Custom namespace fields
        {namespace: "custom", key: "care_instructions"},
        {namespace: "custom", key: "what_is_in_the_box"},
        {namespace: "custom", key: "size_chart"},
        {namespace: "custom", key: "size_chart_image"},
        {namespace: "custom", key: "size_chart_data"},
        {namespace: "custom", key: "size_guide"},
        {namespace: "custom", key: "material"},
        {namespace: "custom", key: "weight"},
        {namespace: "custom", key: "dimensions"},
        {namespace: "custom", key: "height"},
        {namespace: "custom", key: "width"},
        {namespace: "custom", key: "length"},
        {namespace: "custom", key: "color"},
        {namespace: "custom", key: "gender"},
        {namespace: "custom", key: "age_group"},
        {namespace: "custom", key: "brand"},
        {namespace: "custom", key: "country_of_origin"},
        {namespace: "custom", key: "protection_level"},
        {namespace: "custom", key: "certification"},
        {namespace: "custom", key: "specifications"},
        {namespace: "custom", key: "shipping"},
        {namespace: "custom", key: "product_video_url"},
        # Reviews
        {namespace: "reviews", key: "rating"},
        {namespace: "reviews", key: "rating_count"}
      ]) {
        key
        value
        namespace
        type
        reference {
          ... on MediaImage {
            image {
              ...ImageFragment
            }
          }
          ... on GenericFile {
            url
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${SEO_FRAGMENT}
`;

export const getProductsQuery = `
  query getProducts($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
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

export const getProductsByIdsQuery = `
  query getProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        ...ProductCardFragment
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;
