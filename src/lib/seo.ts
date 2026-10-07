import { businessInfo } from "@lib/business"
import { companyData } from "@lib/company-data"
import type { ServiceCategory } from "@lib/services-data"
import type {
  ShopifyCollectionFaqItem,
  ShopifyProduct,
  ShopifyProductCard,
} from "@lib/shopify/types"
import { getBaseURL } from "@lib/util/env"
import type { Metadata } from "next"

const BRAND_NAME = businessInfo.brandName
const BRAND_LEGAL_NAME = businessInfo.legalName
const BRAND_DESCRIPTION = businessInfo.description
const DEFAULT_OPEN_GRAPH_IMAGE_PATH = "/opengraph-image.jpg"
const SCHEMA_SAME_AS_PROFILES = [...businessInfo.socialProfiles]

const SITE_HOME_URL = `${getBaseURL()}/`
const ORGANIZATION_ID = `${getBaseURL()}/#organization`
const LOCAL_BUSINESS_ID = `${getBaseURL()}/#localbusiness`
const WEBSITE_ID = `${getBaseURL()}/#website`

// Query keys that change what a listing shows (search, filters, sort). Pages
// carrying them are noindex; any other key (tracking, variant, pagination
// cursor) keeps the page indexable and canonical to the clean URL.
const FILTER_QUERY_KEYS = new Set([
  "query",
  "q",
  "collection",
  "vendor",
  "type",
  "tag",
  "option",
  "minprice",
  "maxprice",
  "available",
  "showsoldout",
  "onsale",
  "sort",
  "reverse",
  "category",
])

// Shopify vendor values that are the store's own name rather than the brand.
const isStoreVendor = (vendor?: string | null) =>
  vendor?.toLowerCase().replace(/[^a-z]/g, "") === "sixthgearmoto"

// Percent-encodes non-ASCII (e.g. ™ in a product handle) exactly once.
const encodePath = (path: string) => {
  try {
    return encodeURI(decodeURI(path))
  } catch {
    return encodeURI(path)
  }
}

const normalizeRelativePath = (path = "") => {
  if (!path || path === "/") {
    return "/"
  }

  return encodePath(path.startsWith("/") ? path : `/${path}`)
}

/** Route params arrive percent-encoded for non-ASCII handles; Shopify expects the raw handle. */
export const decodeRouteParam = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const getSeoMetadataBase = () => new URL(getBaseURL())

export const getCanonicalPath = (path = "") => normalizeRelativePath(path)

/**
 * @deprecated Use getCanonicalPath. Kept so branches written before the /ph
 * prefix was removed (e.g. feat/bir-seal-badge) still build; returns the
 * unprefixed path.
 */
export const getLocalizedCanonicalPath = (_countryCode: string, path = "") =>
  getCanonicalPath(path)

export const getAbsoluteSiteUrl = (path = "") =>
  `${getBaseURL()}${normalizeRelativePath(path)}`

export const getSiteName = () => BRAND_NAME

/**
 * Page title for the "%s | SixthGear Moto" template. Titles that already name
 * the brand (CMS or Shopify SEO titles) are used as-is so it is never doubled.
 */
export const getPageTitle = (title: string): Metadata["title"] =>
  /six\s*th\s*gear\s*moto/i.test(title) ? { absolute: title } : title

export const getAbsoluteMetadataUrl = (pathOrUrl: string) => {
  const trimmedValue = pathOrUrl.trim()

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue
  }

  const normalizedPath = trimmedValue.startsWith("/")
    ? trimmedValue
    : `/${trimmedValue}`

  return `${getBaseURL()}${normalizedPath}`
}

export const getDefaultOpenGraphImageUrl = () =>
  getAbsoluteMetadataUrl(DEFAULT_OPEN_GRAPH_IMAGE_PATH)

export const getMetadataImageUrl = (imageUrl?: string | null) => {
  const trimmedImageUrl = imageUrl?.trim()

  return trimmedImageUrl ? getAbsoluteMetadataUrl(trimmedImageUrl) : null
}

/**
 * Complete Open Graph block for a page. Next replaces (not merges) the parent
 * openGraph object, so every page needs url, siteName, type and an image.
 */
export const getOpenGraph = ({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string
  description?: string
  path: string
  image?: string | null
  type?: "website" | "article"
}): Metadata["openGraph"] => ({
  type,
  title,
  ...(description ? { description } : {}),
  url: getAbsoluteSiteUrl(path),
  siteName: BRAND_NAME,
  locale: "en_PH",
  images: [getMetadataImageUrl(image) || getDefaultOpenGraphImageUrl()],
})

export const getDefaultTwitterMetadata = (): Metadata["twitter"] => ({
  card: "summary",
  title: BRAND_NAME,
  description: BRAND_DESCRIPTION,
})

type SearchParamsValue = string | string[] | undefined
type SearchParamsInput = Record<string, SearchParamsValue>

/** True when the URL is a search, filter or sort view of a listing. */
export function hasFilterSearchParams(searchParams?: SearchParamsInput | null) {
  if (!searchParams) {
    return false
  }

  return Object.entries(searchParams).some(
    ([key, value]) =>
      value !== undefined && FILTER_QUERY_KEYS.has(key.trim().toLowerCase())
  )
}

export const getNoindexFollowRobots = (): Metadata["robots"] => ({
  index: false,
  follow: true,
})

export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: BRAND_NAME,
  legalName: BRAND_LEGAL_NAME,
  alternateName: [...businessInfo.alternateNames],
  url: SITE_HOME_URL,
  logo: {
    "@type": "ImageObject",
    url: getAbsoluteMetadataUrl(businessInfo.logoPath),
  },
  description: BRAND_DESCRIPTION,
  ...(businessInfo.email ? { email: businessInfo.email } : {}),
  ...(businessInfo.telephone ? { telephone: businessInfo.telephone } : {}),
  ...(SCHEMA_SAME_AS_PROFILES.length > 0
    ? { sameAs: SCHEMA_SAME_AS_PROFILES }
    : {}),
})

const buildPlaceList = (areas: readonly string[]) =>
  areas.map((area) => ({
    "@type": "Place",
    name: area,
  }))

const getPostalAddress = () => {
  const { address } = businessInfo

  if (
    !address.streetAddress ||
    !address.addressLocality ||
    !address.addressRegion ||
    !address.addressCountry
  ) {
    return null
  }

  return {
    "@type": "PostalAddress",
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    addressRegion: address.addressRegion,
    addressCountry: address.addressCountry,
  }
}

const getOpeningHours = () =>
  businessInfo.openingHoursSpecification.map((hours) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.dayOfWeek,
    opens: hours.opens,
    closes: hours.closes,
  }))

/**
 * Parts store + motorcycle workshop, with the café as a department.
 * AutoPartsStore is a Store and an AutomotiveBusiness; MotorcycleRepair is the
 * specific workshop type (schema.org pending section; AutoRepair is the
 * fallback if a validator rejects it).
 */
export const generateLocalBusinessSchema = () => {
  const address = getPostalAddress()
  const openingHours = getOpeningHours()
  const sameAs = [
    ...SCHEMA_SAME_AS_PROFILES,
    ...(businessInfo.googleBusinessProfileUrl
      ? [businessInfo.googleBusinessProfileUrl]
      : []),
  ]

  return {
    "@context": "https://schema.org",
    "@type": ["AutoPartsStore", "MotorcycleRepair"],
    "@id": LOCAL_BUSINESS_ID,
    name: businessInfo.name,
    alternateName: [BRAND_NAME, businessInfo.shortName],
    legalName: BRAND_LEGAL_NAME,
    url: SITE_HOME_URL,
    parentOrganization: { "@id": ORGANIZATION_ID },
    logo: {
      "@type": "ImageObject",
      url: getAbsoluteMetadataUrl(businessInfo.logoPath),
    },
    image: getAbsoluteMetadataUrl(businessInfo.imagePath),
    description: BRAND_DESCRIPTION,
    areaServed: buildPlaceList(businessInfo.serviceArea),
    ...(businessInfo.email ? { email: businessInfo.email } : {}),
    ...(businessInfo.telephone ? { telephone: businessInfo.telephone } : {}),
    ...(address ? { address } : {}),
    ...(businessInfo.coordinates
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: businessInfo.coordinates.lat,
            longitude: businessInfo.coordinates.lng,
          },
        }
      : {}),
    ...(openingHours.length > 0
      ? { openingHoursSpecification: openingHours }
      : {}),
    ...(businessInfo.googleMapsUrl ? { hasMap: businessInfo.googleMapsUrl } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(businessInfo.paymentAccepted
      ? { paymentAccepted: businessInfo.paymentAccepted }
      : {}),
    department: {
      "@type": "CafeOrCoffeeShop",
      "@id": `${getBaseURL()}/#cafe`,
      name: "First Gear Coffee",
      url: getAbsoluteSiteUrl("/first-gear"),
      ...(businessInfo.telephone ? { telephone: businessInfo.telephone } : {}),
      ...(address ? { address } : {}),
      ...(openingHours.length > 0
        ? { openingHoursSpecification: openingHours }
        : {}),
    },
  }
}

/** Homepage only: tells Google the site name. */
export const getWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: BRAND_NAME,
  alternateName: [...businessInfo.alternateNames],
  url: SITE_HOME_URL,
  inLanguage: "en-PH",
  publisher: {
    "@id": ORGANIZATION_ID,
  },
})

type BreadcrumbItem = {
  name: string
  path: string
}

export const getBreadcrumbStructuredData = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: getAbsoluteSiteUrl(item.path),
  })),
})

/** Brand for SEO: the Shopify vendor, unless the vendor is the store itself. */
export const getProductBrand = (product: Pick<ShopifyProduct, "vendor">) => {
  const vendor = product.vendor?.trim()

  return vendor && !isStoreVendor(vendor) ? vendor : null
}

/** Shopify SEO description → description → generated fallback. */
export const getProductDescription = (
  product: Pick<
    ShopifyProduct,
    "title" | "vendor" | "productType" | "description"
  > & { seo?: { description?: string | null } | null }
) => {
  const description =
    product.seo?.description?.trim() || product.description?.trim()

  if (description) {
    return description
  }

  const brand = getProductBrand(product)
  const category = product.productType?.trim()

  return [
    product.title.trim(),
    brand && !product.title.toLowerCase().includes(brand.toLowerCase())
      ? ` by ${brand}`
      : "",
    category ? ` (${category})` : "",
    ", available at SixthGear Moto, Makati.",
  ].join("")
}

export const getProductStructuredData = (
  product: ShopifyProduct,
  selectedVariantId?: string
) => {
  const productUrl = getAbsoluteSiteUrl(`/products/${product.handle}`)
  const images = product.images?.edges
    ?.map((edge) => edge.node.url)
    .filter((url): url is string => Boolean(url)) ?? []
  const { minVariantPrice, maxVariantPrice } = product.priceRange
  const variants = product.variants?.edges?.map((edge) => edge.node) ?? []
  const selectedVariant = selectedVariantId
    ? variants.find((variant) => variant.id === selectedVariantId)
    : undefined
  const sku =
    selectedVariant?.sku?.trim() ||
    variants.find((variant) => variant.availableForSale && variant.sku?.trim())
      ?.sku?.trim() ||
    variants.find((variant) => variant.sku?.trim())?.sku?.trim()
  const brand = getProductBrand(product)
  const availability = product.availableForSale
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock"
  const seller = { "@id": ORGANIZATION_ID }
  const hasPriceRange =
    maxVariantPrice &&
    Number(maxVariantPrice.amount) > Number(minVariantPrice.amount)

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: getProductDescription(product),
    image: images,
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(sku ? { sku } : {}),
    url: productUrl,
    offers: hasPriceRange
      ? {
          "@type": "AggregateOffer",
          priceCurrency: minVariantPrice.currencyCode,
          lowPrice: minVariantPrice.amount,
          highPrice: maxVariantPrice.amount,
          offerCount: variants.length,
          availability,
          url: productUrl,
          seller,
        }
      : {
          "@type": "Offer",
          priceCurrency: minVariantPrice.currencyCode,
          price: minVariantPrice.amount,
          availability,
          itemCondition: "https://schema.org/NewCondition",
          url: productUrl,
          seller,
        },
  }
}

export const getCollectionItemListStructuredData = (
  collectionPath: string,
  products: ShopifyProductCard[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: products.length,
  url: getAbsoluteSiteUrl(collectionPath),
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: getAbsoluteSiteUrl(`/products/${product.handle}`),
    name: product.title,
  })),
})

export const getFaqStructuredData = (items: ShopifyCollectionFaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
})

export const getArticleStructuredData = (article: {
  slug: string
  title: string
  description?: string | null
  image?: string | null
  publishedAt?: string | null
  authorName?: string | null
}) => {
  const articleUrl = getAbsoluteSiteUrl(`/rider-stories/${article.slug}`)
  const image = getMetadataImageUrl(article.image)

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    ...(article.description ? { description: article.description } : {}),
    ...(image ? { image: [image] } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    // "Team Sixthgear"-style bylines are the business, not a person.
    author:
      article.authorName && !/team|six\s*th\s*gear/i.test(article.authorName)
        ? { "@type": "Person", name: article.authorName }
        : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    inLanguage: "en-PH",
  }
}

export const generateServiceSchema = (service: ServiceCategory) => {
  const serviceUrl = getAbsoluteSiteUrl(`/services/${service.slug}`)
  const serviceImage = getMetadataImageUrl(service.heroImage || service.image)
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    url: serviceUrl,
    provider: {
      "@id": LOCAL_BUSINESS_ID,
    },
    areaServed: buildPlaceList(businessInfo.serviceArea),
  }

  if (serviceImage) {
    schema.image = serviceImage
  }

  if (businessInfo.telephone) {
    schema.availableChannel = {
      "@type": "ServiceChannel",
      serviceUrl: getAbsoluteSiteUrl("/contact"),
      servicePhone: {
        "@type": "ContactPoint",
        telephone: businessInfo.telephone,
        contactType: "customer service",
      },
    }
  }

  if (service.items.length > 0) {
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: `${service.title} includes`,
      itemListElement: service.items.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item,
        },
      })),
    }
  }

  return schema
}

export const getServiceStructuredData = generateServiceSchema

export const brandSeo = {
  brandName: BRAND_NAME,
  legalName: BRAND_LEGAL_NAME,
  description: BRAND_DESCRIPTION,
  businessDescription: companyData.aboutUs.description || BRAND_DESCRIPTION,
}
