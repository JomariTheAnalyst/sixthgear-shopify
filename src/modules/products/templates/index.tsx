import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductReviews from "@modules/products/components/product-reviews"
import YouMayLike from "@modules/products/components/you-may-like"
import StarRating from "@modules/products/components/star-rating"
import Breadcrumb from "@modules/products/components/breadcrumb"
import RecentlyViewedTracker from "@modules/products/components/recently-viewed-tracker"
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

  const ratingSummary = parseRatingSummaryFromMetafields(
    product.metafields as any
  )

  const variant = product.variants?.[0]
  const calculatedAmount = variant?.calculated_price?.calculated_amount
  const currencyCode = variant?.calculated_price?.currency_code || "PHP"
  const formattedPrice = calculatedAmount
    ? new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: currencyCode,
      }).format(calculatedAmount)
    : "Price Unavailable"

  return (
    <div className="min-h-screen bg-white">
      <RecentlyViewedTracker
        handle={product.handle || ""}
        title={product.title || ""}
        price={formattedPrice}
        image={images?.[0]?.url || ""}
      />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6 lg:pb-12">
        {/* Breadcrumb - Placed at the top */}
        <div className="mb-4">
          <Breadcrumb product={product} />
        </div>

        {/* Above the Fold – Gallery + Product Info */}
        <section
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-8"
          data-testid="product-container"
        >
          {/* Left Column — Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={images} />
          </div>

          {/* Right Column — Product Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start space-y-4 px-0 lg:px-4">
            {/* Title & Brand */}
            <div>
              {product.collection?.title && (
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {product.collection.title}
                </span>
              )}
              <h1
                className="text-2xl lg:text-3xl xl:text-4xl font-black text-black leading-tight tracking-tight"
                data-testid="product-title"
              >
                {product.title}
              </h1>
            </div>

            {/* Rating Row */}
            <a
              href="#reviews"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity mt-2"
            >
              {ratingSummary && ratingSummary.count > 0 ? (
                <>
                  <StarRating rating={ratingSummary.average} size="sm" />
                  <span className="text-sm text-gray-900 font-bold">
                    {ratingSummary.average.toFixed(1)}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-700 font-medium">
                    {ratingSummary.count} Reviews
                  </span>
                </>
              ) : (
                <>
                  <StarRating rating={0} size="sm" />
                  <span className="text-sm text-gray-700 font-medium ml-1">No reviews yet</span>
                </>
              )}
            </a>

            {/* Product Actions (Price, Variants, Qty, CTA) */}
            <ProductActions product={product} region={region} />
          </div>
        </section>

        {/* Tabs + Reviews Section */}
        <section className="border-t border-gray-100 pt-8 mt-4" id="details-tab">
          <ProductTabs product={product} />

          {/* Reviews Section */}
          <ProductReviews
            productHandle={product.handle || ""}
            productTitle={product.title || ""}
            metafields={product.metafields as any}
          />
        </section>

        {/* You May Like (Related Products) */}
        <section className="mb-16 mt-16">
          <Suspense
            fallback={
              <div className="animate-pulse">
                <div className="h-8 bg-gray-100 rounded w-48 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 aspect-square rounded-xl"
                    />
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
