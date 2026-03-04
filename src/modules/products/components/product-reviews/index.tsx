import {
  getProductReviews,
  parseRatingSummaryFromMetafields,
  buildWriteReviewUrl,
} from "@lib/data/reviews"
import StarRating from "@modules/products/components/star-rating"
import { Star, PenLine, BadgeCheck } from "lucide-react"
import type { JudgeMeReview } from "@lib/shopify/types"

interface ProductReviewsProps {
  productHandle: string
  productTitle: string
  metafields?: Array<{
    namespace: string
    key: string
    value: string
    type?: string
  } | null>
}

export default async function ProductReviews({
  productHandle,
  productTitle,
  metafields,
}: ProductReviewsProps) {
  const [reviewsData, ratingSummary] = await Promise.all([
    getProductReviews(productHandle, 1),
    Promise.resolve(parseRatingSummaryFromMetafields(metafields)),
  ])

  const reviews = reviewsData?.reviews ?? []
  const writeReviewUrl = buildWriteReviewUrl(productHandle)

  const hasReviews =
    reviews.length > 0 || (ratingSummary && ratingSummary.count > 0)

  return (
    <section
      id="reviews"
      className="mt-16 pt-10 border-t border-gray-200"
      aria-label="Customer reviews"
    >
      {/* Section A — Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
        <a
          href={writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <PenLine className="w-3.5 h-3.5" />
          Write a Review
        </a>
      </div>

      {hasReviews ? (
        <>
          {/* Section B — Rating Summary */}
          {ratingSummary && ratingSummary.count > 0 && (
            <RatingSummaryBlock
              ratingSummary={ratingSummary}
              reviews={reviews}
            />
          )}

          {/* Section C — Reviews List */}
          {reviews.length > 0 && (
            <div className="space-y-5 mt-8">
              {reviews
                .filter((r) => r.published && !r.hidden)
                .map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
            </div>
          )}

          {/* Load more note */}
          {reviewsData && reviewsData.total_pages > 1 && (
            <p className="text-center text-sm text-gray-400 mt-6">
              Showing {reviews.length} of {reviewsData.total_count} reviews.{" "}
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Write a review
              </a>
            </p>
          )}
        </>
      ) : (
        /* Section D — Empty State */
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-gray-900 font-semibold mt-4">No reviews yet</p>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
            Be the first to share your experience with this product.
          </p>
          <a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PenLine className="w-3.5 h-3.5" />
            Write the First Review
          </a>
        </div>
      )}
    </section>
  )
}

/* ─── Rating Summary Block ─── */
function RatingSummaryBlock({
  ratingSummary,
  reviews,
}: {
  ratingSummary: { average: number; count: number }
  reviews: JudgeMeReview[]
}) {
  // Compute distribution from the fetched reviews (approximate for paginated)
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => {
    const rounded = Math.round(r.rating)
    if (rounded >= 1 && rounded <= 5) {
      distribution[rounded]++
    }
  })
  const totalShown = reviews.length || 1

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Left — Large average */}
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-900 leading-none">
          {ratingSummary.average.toFixed(1)}
        </p>
        <div className="flex justify-center mt-2">
          <StarRating rating={ratingSummary.average} size="lg" />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {ratingSummary.count} review{ratingSummary.count !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Right — Distribution bars */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0
          const pct = Math.round((count / totalShown) * 100)
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-6 text-right">
                {star} ★
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-4">{count}</span>
            </div>
          )
        })}
        {ratingSummary.count > reviews.length && (
          <p className="text-[10px] text-gray-400 mt-1">
            Showing distribution for displayed reviews
          </p>
        )}
      </div>
    </div>
  )
}

/* ─── Review Card ─── */
function ReviewCard({ review }: { review: JudgeMeReview }) {
  const name = review.reviewer?.name || "Anonymous"
  const words = name.trim().split(/\s+/)
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : name.charAt(0).toUpperCase() || "?"

  const dateFormatted = new Date(review.created_at).toLocaleDateString(
    "en-PH",
    { year: "numeric", month: "short", day: "numeric" }
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          {/* Name + Date */}
          <div>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{dateFormatted}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Verified buyer badge */}
      {review.verified === "verified_buyer" && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full mt-2">
          <BadgeCheck className="w-3 h-3" />
          Verified Buyer
        </span>
      )}

      {/* Title */}
      {review.title && (
        <p className="text-sm font-semibold text-gray-900 mt-3">
          {review.title}
        </p>
      )}

      {/* Body */}
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
        {review.body}
      </p>

      {/* Photos */}
      {review.picture_urls && review.picture_urls.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {review.picture_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Review photo ${i + 1}`}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  )
}
