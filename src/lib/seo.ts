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

const DEFAULT_COUNTRY_CODE = "ph"
const BRAND_NAME = businessInfo.brandName
const BRAND_LEGAL_NAME = businessInfo.legalName
const BRAND_DESCRIPTION = businessInfo.description
const SITE_NAME = "SixthGearMoto"
const DEFAULT_OPEN_GRAPH_IMAGE_PATH = "/opengraph-image.jpg"
const SCHEMA_SAME_AS_PROFILES = businessInfo.socialProfilesOfficialForSchema
  ? [...businessInfo.socialProfiles]
  : []
const PAGINATION_QUERY_KEYS = new Set(["after", "before", "page"])

const getLocalizedSiteUrl = (countryCode = DEFAULT_COUNTRY_CODE) =>
  `${getBaseURL()}/${countryCode}`

const normalizeRelativePath = (path = "") => {
  if (!path || path === "/") {
    return ""
  }

  return path.startsWith("/") ? path : `/${path}`
}

export const getSeoMetadataBase = () => new URL(getBaseURL())

export const getLocalizedCanonicalPath = (
  countryCode = DEFAULT_COUNTRY_CODE,
  path = ""
) => `/${countryCode}${normalizeRelativePath(path)}`

export const getAbsoluteSiteUrl = (
  countryCode = DEFAULT_COUNTRY_CODE,
  path = ""
) => `${getBaseURL()}${getLocalizedCanonicalPath(countryCode, path)}`

export const getSiteName = () => SITE_NAME

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

export const getDefaultTwitterMetadata = (): Metadata["twitter"] => ({
  card: "summary",
  title: BRAND_NAME,
  description: BRAND_DESCRIPTION,
})

type SearchParamsValue = string | string[] | undefined
type SearchParamsInput = Record<string, SearchParamsValue>

export function hasNonCanonicalSearchParams(
  searchParams?: SearchParamsInput | null,
  options: { allowPaginationParams?: boolean } = {}
) {
  if (!searchParams) {
    return false
  }

  return Object.entries(searchParams).some(([key, value]) => {
    if (value === undefined) {
      return false
    }

    const normalizedKey = key.trim().toLowerCase()

    if (options.allowPaginationParams && PAGINATION_QUERY_KEYS.has(normalizedKey)) {
      return false
    }

    return true
  })
}

export const getNoindexFollowRobots = (): Metadata["robots"] => ({
  index: false,
  follow: true,
})

export const getOrganizationStructuredData = (
  countryCode = DEFAULT_COUNTRY_CODE
) => {
  const siteUrl = getLocalizedSiteUrl(countryCode)
  const logoUrl = getAbsoluteMetadataUrl(businessInfo.logoPath)

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: BRAND_NAME,
    legalName: BRAND_LEGAL_NAME,
    alternateName: businessInfo.shortName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
    description: BRAND_DESCRIPTION,
    ...(businessInfo.email ? { email: businessInfo.email } : {}),
    ...(businessInfo.telephone ? { telephone: businessInfo.telephone } : {}),
    ...(SCHEMA_SAME_AS_PROFILES.length > 0
      ? { sameAs: SCHEMA_SAME_AS_PROFILES }
      : {}),
  }
}

const buildPlaceList = (areas: readonly string[]) =>
  areas.map((area) => ({
    "@type": "Place",
    name: area,
  }))

export const generateLocalBusinessSchema = (
  countryCode = DEFAULT_COUNTRY_CODE
) => {
  const siteUrl = getLocalizedSiteUrl(countryCode)
  const logoUrl = getAbsoluteMetadataUrl(businessInfo.logoPath)
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutoRepair"],
    "@id": `${siteUrl}/#localbusiness`,
    name: businessInfo.name,
    alternateName: [BRAND_NAME, businessInfo.shortName],
    legalName: BRAND_LEGAL_NAME,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
    image: getAbsoluteMetadataUrl(businessInfo.imagePath),
    description: BRAND_DESCRIPTION,
    areaServed: buildPlaceList(businessInfo.serviceArea),
  }

  if (businessInfo.email) {
    schema.email = businessInfo.email
  }

  if (businessInfo.telephone) {
    schema.telephone = businessInfo.telephone
  }

  if (
    businessInfo.address.streetAddress &&
    businessInfo.address.addressLocality &&
    businessInfo.address.addressRegion &&
    businessInfo.address.addressCountry
  ) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.streetAddress,
      addressLocality: businessInfo.address.addressLocality,
      addressRegion: businessInfo.address.addressRegion,
      addressCountry: businessInfo.address.addressCountry,
    }
  }

  if (businessInfo.coordinates) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: businessInfo.coordinates.lat,
      longitude: businessInfo.coordinates.lng,
    }
  }

  if (businessInfo.openingHoursSpecification.length > 0) {
    schema.openingHoursSpecification = businessInfo.openingHoursSpecification.map(
      (hours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.dayOfWeek,
        opens: hours.opens,
        closes: hours.closes,
      })
    )
  }

  if (SCHEMA_SAME_AS_PROFILES.length > 0) {
    schema.sameAs = SCHEMA_SAME_AS_PROFILES
  }

  if (businessInfo.googleMapsUrl) {
    schema.hasMap = businessInfo.googleMapsUrl
  }

  if (businessInfo.googleBusinessProfileUrl) {
    schema.sameAs = [
      ...SCHEMA_SAME_AS_PROFILES,
      businessInfo.googleBusinessProfileUrl,
    ]
  }

  if (businessInfo.paymentAccepted) {
    schema.paymentAccepted = businessInfo.paymentAccepted
  }

  return schema
}

export const getLocalBusinessStructuredData = generateLocalBusinessSchema

export const getWebsiteStructuredData = (countryCode = DEFAULT_COUNTRY_CODE) => {
  const siteUrl = getLocalizedSiteUrl(countryCode)

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: BRAND_NAME,
    alternateName: BRAND_LEGAL_NAME,
    description: BRAND_DESCRIPTION,
    inLanguage: "en-PH",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/store?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

type BreadcrumbItem = {
  name: string
  path: string
}

export const getBreadcrumbStructuredData = (
  countryCode = DEFAULT_COUNTRY_CODE,
  items: BreadcrumbItem[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: getAbsoluteSiteUrl(countryCode, item.path),
  })),
})

export const getProductStructuredData = (
  product: ShopifyProduct,
  countryCode = DEFAULT_COUNTRY_CODE,
  selectedVariantId?: string
) => {
  const productUrl = getAbsoluteSiteUrl(countryCode, `/products/${product.handle}`)
  const images = product.images?.edges
    ?.map((edge) => edge.node.url)
    .filter((url): url is string => Boolean(url)) ?? []
  const minVariantPrice = product.priceRange.minVariantPrice
  const variants = product.variants?.edges?.map((edge) => edge.node) ?? []
  const selectedVariant = selectedVariantId
    ? variants.find((variant) => variant.id === selectedVariantId)
    : undefined
  const sku =
    selectedVariant?.sku?.trim() ||
    variants.find((variant) => variant.availableForSale && variant.sku?.trim())
      ?.sku?.trim() ||
    variants.find((variant) => variant.sku?.trim())?.sku?.trim()

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images,
    brand: {
      "@type": "Brand",
      name: product.vendor,
    },
    url: productUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: minVariantPrice.currencyCode,
      price: minVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
      },
    },
  }

  if (sku) {
    structuredData.sku = sku
  }

  return structuredData
}

export const getCollectionItemListStructuredData = (
  countryCode = DEFAULT_COUNTRY_CODE,
  collectionPath: string,
  products: ShopifyProductCard[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: products.length,
  url: getAbsoluteSiteUrl(countryCode, collectionPath),
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: getAbsoluteSiteUrl(countryCode, `/products/${product.handle}`),
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

export const generateServiceSchema = (
  service: ServiceCategory,
  countryCode = DEFAULT_COUNTRY_CODE
) => {
  const serviceUrl = getAbsoluteSiteUrl(countryCode, `/services/${service.slug}`)
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
      "@id": `${getLocalizedSiteUrl(countryCode)}/#localbusiness`,
    },
    areaServed: buildPlaceList(businessInfo.serviceArea),
  }

  if (serviceImage) {
    schema.image = serviceImage
  }

  if (businessInfo.telephone) {
    schema.availableChannel = {
      "@type": "ServiceChannel",
      serviceUrl: getAbsoluteSiteUrl(countryCode, "/contact"),
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
