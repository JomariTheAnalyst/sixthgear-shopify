import { companyData } from "@lib/company-data"
import type { ShopifyProduct } from "@lib/shopify/types"
import { getBaseURL } from "@lib/util/env"

const DEFAULT_COUNTRY_CODE = "ph"
const BRAND_NAME = "SixthgearMoto"
const BRAND_LEGAL_NAME = "Sixthgear Motosupply"
const BRAND_DESCRIPTION =
  "SixthgearMoto is a rider-focused shop in the Philippines for motorcycle gear, parts, workshop services, and First Gear Coffee."
const SOCIAL_PROFILES = [
  "https://www.facebook.com/camille.sixthgear",
  "https://www.instagram.com/sixthgear_moto_supply/",
  "https://www.tiktok.com/@sixthgear.moto.su",
  "https://twitter.com/sixthgear",
  "https://linkedin.com/company/sixthgear",
]

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

export const getOrganizationStructuredData = (
  countryCode = DEFAULT_COUNTRY_CODE
) => {
  const siteUrl = getLocalizedSiteUrl(countryCode)
  const logoUrl = `${getBaseURL()}/images/logo/sixthgear-removebg-preview.png`

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: BRAND_NAME,
    legalName: BRAND_LEGAL_NAME,
    alternateName: "Sixthgear Moto Supply",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
    description: BRAND_DESCRIPTION,
    email: "info@sixthgear.ph",
    telephone: "+63-995-093-0157",
    sameAs: SOCIAL_PROFILES,
  }
}

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
      "@id": `${siteUrl}#organization`,
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
  countryCode = DEFAULT_COUNTRY_CODE
) => {
  const productUrl = getAbsoluteSiteUrl(countryCode, `/products/${product.handle}`)
  const images = product.images?.edges
    ?.map((edge) => edge.node.url)
    .filter((url): url is string => Boolean(url)) ?? []
  const minVariantPrice = product.priceRange.minVariantPrice

  return {
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
        name: "Sixthgear Moto",
      },
    },
  }
}

export const brandSeo = {
  brandName: BRAND_NAME,
  legalName: BRAND_LEGAL_NAME,
  description: BRAND_DESCRIPTION,
  businessDescription: companyData.aboutUs.description || BRAND_DESCRIPTION,
}
