import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getProduct } from "@lib/shopify"
import { invalidatePattern } from "@lib/cache/redis"
import { getRegion } from "@lib/data/regions"
import JsonLd from "@modules/common/components/json-ld"
import ProductTemplate from "@modules/products/templates"
import SkeletonProductDetail from "@modules/skeletons/templates/skeleton-product-detail"
import {
  getBreadcrumbStructuredData,
  getLocalizedCanonicalPath,
} from "@lib/seo"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params

  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
    alternates: {
      canonical: getLocalizedCanonicalPath(
        params.countryCode,
        `/products/${handle}`
      ),
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

  // Bust stale cache so updated metafield query runs
  await invalidatePattern("product")
  const shopifyProduct = await getProduct(params.handle)

  if (!shopifyProduct) {
    notFound()
  }
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    params.countryCode,
    [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/store" },
      { name: shopifyProduct.title, path: `/products/${params.handle}` },
    ]
  )

  // DEBUG: log raw metafields from Shopify to terminal

  const mappedImages = [
    ...shopifyProduct.images.edges.map((edge) => ({
      id: edge.node.url,
      url: edge.node.url,
      width: edge.node.width,
      height: edge.node.height,
      altText: edge.node.altText || "",
    })),
    ...shopifyProduct.variants.edges
      .map((edge) => edge.node.image)
      .filter((image): image is NonNullable<typeof image> => Boolean(image))
      .map((image) => ({
        id: image.url,
        url: image.url,
        width: image.width,
        height: image.height,
        altText: image.altText || "",
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
      altText: shopifyProduct.featuredImage.altText || "",
    })
  }

  // Map Shopify product to the Medusa HttpTypes.StoreProduct format expected by the template
  const mappedProduct = {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.descriptionHtml || shopifyProduct.description,
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
  const selectedVariantId = searchParams.v_id
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
          altText: variantNode.image.altText || "",
        },
        ...mappedProduct.images.filter((img: any) => img.url !== variantNode.image?.url)
      ];
    }
  }

  return (
    <Suspense fallback={<SkeletonProductDetail />}>
      <>
        <JsonLd id="product-breadcrumbs" data={breadcrumbStructuredData} />
        <ProductTemplate
          product={mappedProduct}
          region={region}
          countryCode={params.countryCode}
          images={displayImages}
        />
      </>
    </Suspense>
  )
}
