import Image from "next/image"
import Link from "next/link"
import { draftMode } from "next/headers"
import { HttpTypes } from "@medusajs/types"
import type { SanityFeaturedCollectionItem } from "@lib/cms/types"
import type { ShopifyProductCard } from "@lib/shopify/types"
import { inter, montserrat } from "@lib/fonts"
import ProductCard from "@modules/home/components/product-sections/product-card"
import HomepageCollectionRail from "@modules/home/components/product-sections/homepage-collection-rail"
import { getCollection, getCollectionProductsByHandle } from "@lib/shopify"
import { mapShopifyToStoreProduct } from "@lib/shopify/map-to-store-product"
import {
  getFeaturedCollectionVideoUrl,
  isFullWidthFeaturedCollection,
  resolveFeaturedCollectionProducts,
  warnFeaturedCollectionInDevelopment,
} from "@lib/cms/featured-collection"
import { cleanSanityHref, cleanSanityString, keyedSanityPath } from "@lib/cms/visual-editing"
import { buildSanityImageUrl, getObjectPosition } from "@lib/util/sanity-image"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"
import FullWidthBanner from "./full-width-banner"

// Same size and "View All" rule as the homepage collection rails.
const RAIL_PRODUCT_LIMIT = 12

/**
 * Re-uses the same mapping the store/collection page uses,
 * so ProductCard behaves identically here and on the PLP.
 */
function mapShopifyProductToSharedCard(
  product: ShopifyProductCard
): HttpTypes.StoreProduct {
  const price = product.priceRange?.minVariantPrice
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice

  const images =
    product.images?.edges?.map((e: any) => ({ url: e.node.url })) || []
  if (images.length === 0 && product.featuredImage) {
    images.push({ url: product.featuredImage.url })
  }

  const variants =
    product.variants?.edges?.map((edge: any) => {
      const node = edge.node
      const variantPrice = node.price || price
      const variantCompare = node.compareAtPrice || compareAtPrice

      return {
        id: node.id,
        title:
          node.selectedOptions?.map((o: any) => o.value).join(" / ") ||
          "Default Title",
        allow_backorder: false,
        manage_inventory: true,
        inventory_quantity: node.availableForSale !== false ? 10 : 0,
        options:
          node.selectedOptions?.map((o: any) => ({
            value: o.value,
            option: { title: o.name },
          })) || [],
        calculated_price: {
          calculated_amount: variantPrice
            ? parseFloat(variantPrice.amount)
            : null,
          original_amount: variantCompare
            ? parseFloat(variantCompare.amount)
            : null,
          currency_code: variantPrice?.currencyCode || "php",
        },
        image: node.image ? { url: node.image.url } : null,
        thumbnail: node.image?.url || null,
      }
    }) || [
      {
        id: product.id,
        allow_backorder: false,
        manage_inventory: true,
        inventory_quantity: product.availableForSale ? 10 : 0,
        calculated_price: {
          calculated_amount: price ? parseFloat(price.amount) : null,
          original_amount: compareAtPrice
            ? parseFloat(compareAtPrice.amount)
            : null,
          currency_code: price?.currencyCode || "php",
        },
      },
    ]

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.featuredImage?.url,
    images,
    collection: { title: product.vendor || "Sixthgear" },
    tags: product.tags?.map((t: string) => ({ value: t })) || [],
    options:
      product.options?.map((opt: any) => ({
        id: opt.id,
        title: opt.name,
        values:
          opt.values?.map((v: string) => ({ id: v, value: v })) || [],
      })) || [],
    variants,
  } as unknown as HttpTypes.StoreProduct
}

function CollectionNotFoundNote({ handle }: { handle: string | null }) {
  return (
    <p
      role="note"
      className={`${inter.className} border-2 border-dashed border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900`}
    >
      Collection not found: Shopify returned no products for &ldquo;{handle || "missing handle"}&rdquo;.
      Visitors see the banner only. This note shows in preview only.
    </p>
  )
}

function BannerCopy({
  heading,
  subtext,
  cta,
  url,
  large = false,
}: {
  heading: string
  subtext: string | null
  cta: string
  url: string
  large?: boolean
}) {
  return (
    <>
      <h2
        className={`${montserrat.className} text-white font-black leading-tight tracking-[0.02em] mb-1 ${
          large
            ? "text-3xl md:text-5xl lg:text-6xl"
            : "text-2xl lg:text-3xl xl:text-4xl"
        }`}
      >
        {heading}
      </h2>
      {subtext && (
        <p
          className={`${inter.className} mb-3 ${
            large ? "text-white/80 text-sm md:text-base max-w-xl" : "text-white/70 text-sm"
          }`}
        >
          {subtext}
        </p>
      )}
      <Link
        href={url}
        className={`${montserrat.className} mt-3 inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-black text-sm font-bold uppercase tracking-[0.06em] transition-colors`}
      >
        {cta}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </>
  )
}

interface FeaturedCollectionItemProps {
  data: SanityFeaturedCollectionItem | null
}

export default async function FeaturedCollectionItem({
  data,
}: FeaturedCollectionItemProps) {
  if (!data) return null
  if (!data.isActive) return null

  const isPreview = (await draftMode()).isEnabled
  const isFullWidth = isFullWidthFeaturedCollection(data)
  const collectionHandle = data.collectionHandle
    ? cleanSanityString(data.collectionHandle).trim()
    : null

  const heading = data.heading as string
  const subtext = data.subtext || null
  const cta = data.ctaLabel as string
  const url = cleanSanityHref(data.ctaLink as string)
  const campaignPath = data._key
    ? keyedSanityPath("featuredCollections", data._key)
    : "featuredCollections"

  // Hotspot: the URL keeps the editor's crop, object-position keeps the focal point.
  const imageSrc =
    buildSanityImageUrl(
      data.bannerImageRef
        ? {
            asset: { _ref: cleanSanityString(data.bannerImageRef) },
            crop: data.bannerImageCrop ?? null,
            hotspot: data.bannerImageHotspot ?? null,
          }
        : null,
      { width: isFullWidth ? 2400 : 1400 }
    ) || cleanSanityString(data.bannerImageUrl as string)
  const objectPosition = getObjectPosition(data.bannerImageHotspot)

  // Content position classes
  const pos = cleanSanityString(data.contentPosition || "bottom-left")
  let alignClass = "items-start text-left"
  if (pos === "bottom-center") {
    alignClass = "items-center text-center"
  } else if (pos === "bottom-right") {
    alignClass = "items-end text-right"
  }

  if (isFullWidth) {
    const collection = collectionHandle
      ? await getCollection(collectionHandle, { first: RAIL_PRODUCT_LIMIT + 1 }).catch(
          () => null
        )
      : null
    const railProducts =
      collection?.products?.edges?.map((edge) => mapShopifyToStoreProduct(edge.node)) ?? []

    if (railProducts.length === 0) {
      warnFeaturedCollectionInDevelopment(
        `Full-width campaign "${data.internalName || "Untitled"}" has no products for collection "${collectionHandle || "missing"}". Showing the banner without a product row.`
      )
    }

    return (
      <div className="w-full">
        <SanityEditTarget
          documentId="marketing"
          documentType="marketing"
          path={`${campaignPath}.bannerImage`}
        >
          <FullWidthBanner
            imageSrc={imageSrc}
            imageAlt={data.bannerImageAlt as string}
            objectPosition={objectPosition}
            videoUrl={getFeaturedCollectionVideoUrl(data)}
            darkOverlay={data.darkOverlay !== false}
          >
            <div
              className={`absolute inset-x-0 bottom-0 z-10 flex flex-col px-[2.5vw] pb-8 md:pb-12 lg:pb-16 ${alignClass}`}
            >
              <BannerCopy heading={heading} subtext={subtext} cta={cta} url={url} large />
            </div>
          </FullWidthBanner>
        </SanityEditTarget>

        {railProducts.length > 0 && collectionHandle ? (
          <HomepageCollectionRail
            title={collection?.title || collectionHandle}
            collectionHandle={collectionHandle}
            productLimit={RAIL_PRODUCT_LIMIT}
            products={railProducts}
          />
        ) : (
          isPreview && (
            <div className="px-[2.5vw] py-6">
              <CollectionNotFoundNote handle={collectionHandle} />
            </div>
          )
        )}
      </div>
    )
  }

  const products = await resolveFeaturedCollectionProducts(
    data,
    getCollectionProductsByHandle
  )
  if (!products) {
    warnFeaturedCollectionInDevelopment(
      `Campaign "${data.internalName || 'Untitled'}" did not render because its configuration is incomplete or Shopify returned no products for collection "${data.collectionHandle || 'missing'}".`
    )
    // Visitors see nothing; editors in preview see the banner and a note.
    if (!isPreview) return null
  }

  const isImageRight = cleanSanityString(data.layout || "") === "image_right"

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden min-h-[400px]">
        {/* ── Image Panel (50%) ── */}
        <SanityEditTarget
          documentId="marketing"
          documentType="marketing"
          path={`${campaignPath}.bannerImage`}
          className={`relative min-h-[360px] lg:min-h-[500px] flex flex-col ${
            isImageRight
              ? "order-1 lg:order-2"
              : "order-1 lg:order-1"
          }`}
        >
          <Image
            src={imageSrc}
            alt={data.bannerImageAlt as string}
            fill
            className="object-cover"
            style={{ objectPosition }}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Gradient + text overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-6 md:px-8 py-8 md:py-10 z-10 flex flex-col ${alignClass}`}
          >
            <BannerCopy heading={heading} subtext={subtext} cta={cta} url={url} />
          </div>
        </SanityEditTarget>

        {/* ── Products Panel (50%) ── */}
        <div
          className={`px-2 py-5 sm:px-6 sm:py-8 md:p-12 lg:p-16 flex flex-col justify-center items-center ${
            isImageRight
              ? "order-2 lg:order-1"
              : "order-2 lg:order-2"
          }`}
        >
          {products ? (
            /* Product grid — 2x2 with generous spacing, constrained max-width to make items smaller */
            <div className="w-full max-w-none sm:max-w-[520px] lg:max-w-[540px] grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-x-8 md:gap-y-6 featured-collection-grid">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={mapShopifyProductToSharedCard(product)}
                />
              ))}
            </div>
          ) : (
            <CollectionNotFoundNote handle={collectionHandle} />
          )}
        </div>
      </div>
    </div>
  )
}
