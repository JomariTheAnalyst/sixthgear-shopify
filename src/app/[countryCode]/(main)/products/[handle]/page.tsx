import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getProduct } from "@lib/shopify"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import SkeletonProductDetail from "@modules/skeletons/templates/skeleton-product-detail"

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
    title: `${product.title} | Sixthgear Moto`,
    description: product.description,
    openGraph: {
      title: `${product.title} | Sixthgear Moto`,
      description: product.description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
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

  const shopifyProduct = await getProduct(params.handle)

  if (!shopifyProduct) {
    notFound()
  }

  // Map Shopify product to the Medusa HttpTypes.StoreProduct format expected by the template
  const mappedProduct = {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.descriptionHtml || shopifyProduct.description,
    thumbnail: shopifyProduct.featuredImage?.url,
    collection: { title: shopifyProduct.vendor },
    options: shopifyProduct.options.map((opt) => ({
      id: opt.id,
      title: opt.name,
      values: opt.values.map(val => ({ id: val, value: val })),
    })),
    images: shopifyProduct.images.edges.map((edge) => ({
      id: edge.node.url,
      url: edge.node.url,
    })),
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
        }
      }
    }),
    metadata: shopifyProduct.metafields?.reduce((acc: any, field: any) => {
      acc[field.key] = field.value;
      return acc;
    }, {}) || {}
  } as any;

  // Emulate getImagesForVariant functionality
  const selectedVariantId = searchParams.v_id
  let displayImages = mappedProduct.images;
  if (selectedVariantId) {
    const variantNode = shopifyProduct.variants.edges.find(e => e.node.id === selectedVariantId)?.node;
    if (variantNode?.image?.url) {
      displayImages = [
        { id: variantNode.image.url, url: variantNode.image.url },
        ...mappedProduct.images.filter((img: any) => img.url !== variantNode.image?.url)
      ];
    }
  }

  return (
    <Suspense fallback={<SkeletonProductDetail />}>
      <ProductTemplate
        product={mappedProduct}
        region={region}
        countryCode={params.countryCode}
        images={displayImages}
      />
    </Suspense>
  )
}
