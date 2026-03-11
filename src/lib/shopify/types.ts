export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifySeo {
  title: string | null;
  description: string | null;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image?: ShopifyImage;
}

export interface ShopifyMetafield {
  key: string;
  namespace: string;
  value: string;
  type?: string;
}

export interface ShopifyProductCard {
  id: string;
  title: string;
  handle: string;
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
  } | null;
  availableForSale: boolean;
  tags: string[];
  vendor: string;
  options?: ShopifyProductOption[];
  variants?: {
    edges: {
      node: {
        id: string;
      };
    }[];
  };
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  vendor: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
  } | null;
  options: ShopifyProductOption[];
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  seo: ShopifySeo;
  metafields?: ShopifyMetafield[] | null;
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  endCursor: string | null;
  startCursor?: string | null;
}

export interface ShopifyFilterValue {
  id: string;
  label: string;
  count: number;
  input: string;
}

export interface ShopifyFilter {
  id: string;
  label: string;
  type: string;
  values: ShopifyFilterValue[];
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  seo?: ShopifySeo;
  products?: {
    edges: {
      cursor: string;
      node: ShopifyProductCard;
    }[];
    pageInfo: ShopifyPageInfo;
    filters?: ShopifyFilter[];
  };
}

export interface ShopifyPage {
  id: string;
  title: string;
  handle: string;
}

export interface ShopifySearchResult {
  products: ShopifyProductCard[];
  pageInfo: ShopifyPageInfo;
  totalCount: number;
}

export interface ShopifyPredictiveSearchResult {
  products: {
    id: string;
    title: string;
    handle: string;
    featuredImage: ShopifyImage | null;
    priceRange: {
      minVariantPrice: ShopifyMoney;
    };
    availableForSale: boolean;
  }[];
  collections: {
    id: string;
    title: string;
    handle: string;
    image: ShopifyImage | null;
  }[];
  pages: ShopifyPage[];
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoney;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
}

export interface ShopifyMailingAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  provinceCode: string | null;
  country: string | null;
  countryCodeV2: string;
  zip: string | null;
  phone: string | null;
  name: string;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  statusUrl: string;
  currentTotalPrice: ShopifyMoney;
  shippingAddress: {
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
  } | null;
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: {
          id: string;
          title: string;
          price: ShopifyMoney;
          image: ShopifyImage | null;
          product: {
            handle: string;
            title: string;
          };
        } | null;
      };
    }[];
  };
}

export interface ShopifyCustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface ShopifyCustomerUserError {
  code: string;
  field: string[] | null;
  message: string;
}

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
  createdAt: string;
  defaultAddress: ShopifyMailingAddress | null;
  addresses: { edges: { node: ShopifyMailingAddress }[] };
  orders: { edges: { node: ShopifyOrder }[] };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney;
    totalDutyAmount: ShopifyMoney | null;
  };
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
  discountCodes: {
    applicable: boolean;
    code: string;
  }[];
  buyerIdentity: {
    email: string | null;
    phone: string | null;
    customer: ShopifyCustomer | null;
    countryCode: string | null;
  };
}

// ─── Clean filter state managed by our app ────────────────────────────────────

export type ActivePriceRange = { min: number; max: number };

export type ProductCollectionSortKeys =
  | "MANUAL"
  | "BEST_SELLING"
  | "TITLE"
  | "PRICE"
  | "CREATED"
  | "COLLECTION_DEFAULT"
  | "RELEVANCE";

export type FilterState = {
  vendors: string[];
  productTypes: string[];
  tags: string[];
  variantOptions: { name: string; value: string }[];
  priceRange: ActivePriceRange | null;
  available: boolean;
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
};

export type SortOption = {
  label: string;
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
};

export const SORT_OPTIONS: SortOption[] = [
  { label: "Featured",           sortKey: "COLLECTION_DEFAULT", reverse: false },
  { label: "Best Selling",       sortKey: "BEST_SELLING",       reverse: false },
  { label: "Newest Arrivals",    sortKey: "CREATED",            reverse: true  },
  { label: "Price: Low to High", sortKey: "PRICE",              reverse: false },
  { label: "Price: High to Low", sortKey: "PRICE",              reverse: true  },
  { label: "A – Z",              sortKey: "TITLE",              reverse: false },
  { label: "Z – A",              sortKey: "TITLE",              reverse: true  },
];

// ─── ProductFilter input type (mirrors Shopify's ProductFilter input) ─────────

export type ProductFilter = {
  available?: boolean;
  price?: { min?: number; max?: number };
  productVendor?: string;
  productType?: string;
  tag?: string;
  variantOption?: { name: string; value: string };
};

// ─── Judge.me Review Types ───────────────────────────

export type JudgeMeReviewer = {
  id: number
  email: string
  name: string
  phone: string | null
  accepts_marketing: boolean
  unsubscribed_at: string | null
  tags: string[]
}

export type JudgeMeReview = {
  id: number
  title: string
  body: string
  rating: number
  reviewer: JudgeMeReviewer
  source: string
  featured: boolean
  published: boolean
  hidden: boolean
  verified: string
  created_at: string
  updated_at: string
  product_handle: string
  product_title: string
  picture_urls: string[]
  curated: string
  sentiment: string
  moderated: boolean
  ip_address: string
  has_published_pictures: boolean
  has_published_videos: boolean
}

export type JudgeMeReviewsResponse = {
  reviews: JudgeMeReview[]
  current_page: number
  total_pages: number
  per_page: number
  total_count: number
}

export type JudgeMeRatingSummary = {
  average: number
  count: number
  distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

