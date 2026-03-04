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
    variants(first: 1) {
      edges {
        node {
          id
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
