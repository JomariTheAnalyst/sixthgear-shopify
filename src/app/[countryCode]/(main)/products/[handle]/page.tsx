import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getProduct } from "@lib/shopify"
import { getRegion } from "@lib/data/regions"
import JsonLd from "@modules/common/components/json-ld"
import ProductTemplate from "@modules/products/templates"
import SkeletonProductDetail from "@modules/skeletons/templates/skeleton-product-detail"
import {
  decodeRouteParam,
  getBreadcrumbStructuredData,
  getCanonicalPath,
  getOpenGraph,
  getPageTitle,
  getProductBrand,
  getProductDescription,
  getProductStructuredData,
} from "@lib/seo"
import { rootRelativeHtmlHrefs } from "@lib/util/href"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

// Query params (?v_id= variant, tracking) never change the indexable page:
// they canonicalise to the clean product URL.
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const handle = decodeRouteParam(params.handle)

  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const title = product.seo?.title?.trim() || product.title
  const description = getProductDescription(product)
  const path = `/products/${product.handle}`

  return {
    title: getPageTitle(title),
    description,
    openGraph: getOpenGraph({
      title,
      description,
      path,
      image: product.featuredImage?.url,
    }),
    twitter: {
      card: product.featuredImage ? "summary_large_image" : "summary",
      title,
      description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
    alternates: {
      canonical: getCanonicalPath(path),
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  if (!region) {
    notFound()
  }

  const shopifyProduct = await getProduct(decodeRouteParam(params.handle))

  if (!shopifyProduct) {
    notFound()
  }
  const selectedVariantId = searchParams.v_id
  const breadcrumbStructuredData = getBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/store" },
    { name: shopifyProduct.title, path: `/products/${shopifyProduct.handle}` },
  ])
  const productStructuredData = getProductStructuredData(
    shopifyProduct,
    selectedVariantId
  )

  const productVendor = getProductBrand(shopifyProduct)
  const productTitle = shopifyProduct.title?.trim()
  const titleIncludesVendor =
    productVendor &&
    productTitle?.toLowerCase().includes(productVendor.toLowerCase())
  const productImageAlt =
    titleIncludesVendor || !productVendor
      ? productTitle || "Product image"
      : `${productVendor} ${productTitle}`

  const mappedImages = [
    ...shopifyProduct.images.edges.map((edge) => ({
      id: edge.node.url,
      url: edge.node.url,
      width: edge.node.width,
      height: edge.node.height,
      altText: edge.node.altText?.trim() || productImageAlt,
    })),
    ...shopifyProduct.variants.edges
      .map((edge) => edge.node.image)
      .filter((image): image is NonNullable<typeof image> => Boolean(image))
      .map((image) => ({
        id: image.url,
        url: image.url,
        width: image.width,
        height: image.height,
        altText: image.altText?.trim() || productImageAlt,
      })),
  ].filter(
    (image, index, list) =>
      Boolean(image.url) &&
      list.findIndex((candidate) => candidate.url === image.url) === index
  )

  if (
    mappedImages.length === 0 &&
    shopifyProduct.featuredImage?.url
  ) {
    mappedImages.push({
      id: shopifyProduct.featuredImage.url,
      url: shopifyProduct.featuredImage.url,
      width: shopifyProduct.featuredImage.width,
      height: shopifyProduct.featuredImage.height,
      altText: shopifyProduct.featuredImage.altText?.trim() || productImageAlt,
    })
  }

  // Map Shopify product to the Medusa HttpTypes.StoreProduct format expected by the template
  const mappedProduct = {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.descriptionHtml
      ? rootRelativeHtmlHrefs(shopifyProduct.descriptionHtml)
      : shopifyProduct.description,
    thumbnail: mappedImages[0]?.url || shopifyProduct.featuredImage?.url,
    collection: { title: shopifyProduct.vendor },
    options: shopifyProduct.options.map((opt) => ({
      id: opt.id,
      title: opt.name,
      values: opt.values.map(val => ({ id: val, value: val })),
    })),
    images: mappedImages,
    variants: shopifyProduct.variants.edges.map((edge) => {
      const v = edge.node;
      
      // Stock logic requested by user mapping
      let q = 0;
      if (v.quantityAvailable === null || v.quantityAvailable === undefined) {
        q = v.availableForSale ? 10 : 0;
      } else {
        q = v.quantityAvailable;
      }

      return {
        id: v.id,
        title: v.title,
        options: v.selectedOptions.map((opt) => {
          const matchedOption = shopifyProduct.options.find(o => o.name === opt.name);
          return {
            option_id: matchedOption?.id || opt.name,
            value: opt.value,
          };
        }),
        options_values: v.selectedOptions,
        manage_inventory: true,
        allow_backorder: false,
        inventory_quantity: q,
        calculated_price: {
          calculated_amount: v.price ? parseFloat(v.price.amount) : null,
          original_amount: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null,
          currency_code: v.price?.currencyCode || "php"
        },
        image: v.image
          ? {
              url: v.image.url,
              altText: v.image.altText || "",
              width: v.image.width,
              height: v.image.height,
            }
          : null,
      }
    }),
    metadata: shopifyProduct.metafields?.reduce((acc: any, field: any) => {
      acc[field.key] = field.value;
      return acc;
    }, {}) || {},
    // Pass raw Shopify fields for Specifications tab
    shopifyMetafields: (shopifyProduct.metafields || []).filter(Boolean),
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    tags: shopifyProduct.tags,
  } as any;

  // Emulate getImagesForVariant functionality
  let displayImages = mappedProduct.images;
  if (selectedVariantId) {
    const variantNode = shopifyProduct.variants.edges.find(e => e.node.id === selectedVariantId)?.node;
    if (variantNode?.image?.url) {
      displayImages = [
        {
          id: variantNode.image.url,
          url: variantNode.image.url,
          width: variantNode.image.width,
          height: variantNode.image.height,
          altText: variantNode.image.altText?.trim() || productImageAlt,
        },
        ...mappedProduct.images.filter((img: any) => img.url !== variantNode.image?.url)
      ];
    }
  }

  return (
    <>
      <JsonLd id="product-breadcrumbs" data={breadcrumbStructuredData} />
      <JsonLd id="product-structured-data" data={productStructuredData} />
      <Suspense fallback={<SkeletonProductDetail />}>
        <ProductTemplate
          product={mappedProduct}
          region={region}
          countryCode={params.countryCode}
          images={displayImages}
        />
      </Suspense>
    </>
  )
}
