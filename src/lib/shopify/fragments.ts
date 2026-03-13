export const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

export const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFragment on Product {
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
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
    }
    availableForSale
    tags
    vendor
    options {
      id
      name
      values
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
          price {
            ...MoneyFragment
          }
          compareAtPrice {
            ...MoneyFragment
          }
          selectedOptions {
            name
            value
          }
          image {
            ...ImageFragment
          }
        }
      }
    }
  }
`;

export const SEO_FRAGMENT = `
  fragment SeoFragment on SEO {
    title
    description
  }
`;
