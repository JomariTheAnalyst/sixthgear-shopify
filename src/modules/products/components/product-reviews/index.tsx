import {
  getProductReviews,
  parseRatingSummaryFromMetafields,
  buildWriteReviewUrl,
} from "@lib/data/reviews"
import StarRating from "@modules/products/components/star-rating"
import { Star, PenLine, BadgeCheck, ThumbsUp, ThumbsDown } from "lucide-react"
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
      className="mt-10 pt-8"
      aria-label="Customer reviews"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-black">Reviews</h2>
          {ratingSummary && ratingSummary.count > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              Showing {reviews.length} from {ratingSummary.count} reviews
            </p>
          )}
        </div>
        <a
          href={writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <PenLine className="w-3.5 h-3.5" />
          Write a Review
        </a>
      </div>

      {hasReviews ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Left — Reviews List */}
          <div className="space-y-0 divide-y divide-gray-100">
            {reviews
              .filter((r) => r.published && !r.hidden)
              .map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>

          {/* Right — Rating Summary */}
          {ratingSummary && ratingSummary.count > 0 && (
            <div className="lg:sticky lg:top-28 lg:self-start">
              <RatingSummaryBlock
                ratingSummary={ratingSummary}
                reviews={reviews}
              />
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto">
            <Star className="w-7 h-7 text-orange-500" />
          </div>
          <p className="text-black font-semibold mt-5 text-lg">
            No reviews yet
          </p>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
            Be the first to share your experience with this product.
          </p>
          <a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PenLine className="w-3.5 h-3.5" />
            Write the First Review
          </a>
        </div>
      )}

      {/* Load more */}
      {reviewsData && reviewsData.total_pages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Showing {reviews.length} of {reviewsData.total_count} reviews
          </p>
          <a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-orange-500 hover:underline"
          >
            Show all reviews
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
  const distribution: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  }
  reviews.forEach((r) => {
    const rounded = Math.round(r.rating)
    if (rounded >= 1 && rounded <= 5) {
      distribution[rounded]++
    }
  })
  const totalShown = reviews.length || 1

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      {/* Large Rating */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <StarRating rating={ratingSummary.average} size="md" />
          <p className="text-sm text-gray-400 mt-1">
            {ratingSummary.count} review
            {ratingSummary.count !== 1 ? "s" : ""}
          </p>
        </div>
        <p className="text-4xl font-bold text-black leading-none">
          {ratingSummary.average.toFixed(1)}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0
          const pct = Math.round((count / totalShown) * 100)
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3 text-right font-medium">
                {star}
              </span>
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-6 text-right">
                {count}
              </span>
            </div>
          )
        })}
      </div>

      {ratingSummary.count > reviews.length && (
        <p className="text-[10px] text-gray-400 mt-3">
          Distribution based on displayed reviews
        </p>
      )}
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
    <div className="py-5">
      {/* Top row — avatar, name, stars */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 text-sm font-bold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-black">{name}</p>
            {review.verified === "verified_buyer" && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-green-600">
                <BadgeCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <div className="mt-1">
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-600 mt-3 leading-relaxed pl-[52px]">
        {review.body}
      </p>

      {/* Photos */}
      {review.picture_urls && review.picture_urls.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap pl-[52px]">
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

      {/* Bottom row — Reply, likes */}
      <div className="flex items-center gap-4 mt-3 pl-[52px]">
        <span className="text-xs text-gray-400">{dateFormatted}</span>
      </div>
    </div>
  )
}
