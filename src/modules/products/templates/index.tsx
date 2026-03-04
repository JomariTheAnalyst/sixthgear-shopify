import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductReviews from "@modules/products/components/product-reviews"
import YouMayLike from "@modules/products/components/you-may-like"
import StarRating from "@modules/products/components/star-rating"
import Breadcrumb from "@modules/products/components/breadcrumb"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { parseRatingSummaryFromMetafields } from "@lib/data/reviews"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Parse aggregate rating from metafields (synchronous, no API call)
  const ratingSummary = parseRatingSummaryFromMetafields(
    product.metafields as any
  )

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-6 lg:pb-10">
        {/* Breadcrumb */}
        <Breadcrumb product={product} />

        {/* Above the Fold: Gallery + Info */}
        <section
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
          data-testid="product-container"
        >
          {/* Left Column — Gallery (sticky on desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ImageGallery images={images} />
          </div>

          {/* Right Column — Product Info */}
          <div className="space-y-6">
            {/* Vendor & Title */}
            <div>
              {product.collection?.title && (
                <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">
                  {product.collection.title}
                </p>
              )}
              <h1
                className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3"
                data-testid="product-title"
              >
                {product.title}
              </h1>

              {/* Star Rating + Review Count (from Shopify metafields) */}
              <a
                href="#reviews"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {ratingSummary && ratingSummary.count > 0 ? (
                  <>
                    <StarRating rating={ratingSummary.average} size="sm" />
                    <span className="text-sm text-gray-500">
                      ({ratingSummary.count})
                    </span>
                  </>
                ) : (
                  <>
                    <StarRating rating={0} size="sm" />
                    <span className="text-sm text-gray-400">
                      No reviews yet
                    </span>
                  </>
                )}
              </a>
            </div>

            {/* Variant Selection & Add to Cart (includes Price, Options, Qty, Buttons) */}
            <ProductActions product={product} region={region} />

            {/* Collapsible Content Sections */}
            <ProductTabs product={product} />
          </div>
        </section>

        {/* Reviews Section — Judge.me powered */}
        <ProductReviews
          productHandle={product.handle || ""}
          productTitle={product.title || ""}
          metafields={product.metafields as any}
        />

        {/* You May Like (Related Products) */}
        <section className="mb-16">
          <Suspense
            fallback={
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-48 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-100 aspect-square rounded-xl" />
                  ))}
                </div>
              </div>
            }
          >
            <YouMayLike
              productId={product.id}
              countryCode={countryCode}
              region={region}
            />
          </Suspense>
        </section>
      </main>
    </div>
  )
}

export default ProductTemplate
