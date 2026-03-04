import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
}

export default function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  className = "",
}: StarRatingProps) {
  const iconSize = sizeMap[size]

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const position = i + 1
        const isFull = rating >= position
        const isHalf = !isFull && rating >= position - 0.5

        if (isFull) {
          return (
            <Star
              key={i}
              className={`${iconSize} text-orange-500 fill-orange-500`}
              aria-hidden="true"
            />
          )
        }

        if (isHalf) {
          return (
            <div key={i} className={`relative ${iconSize}`}>
              <Star
                className={`absolute inset-0 ${iconSize} text-gray-200 fill-gray-200`}
                aria-hidden="true"
              />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star
                  className={`${iconSize} text-orange-500 fill-orange-500`}
                  aria-hidden="true"
                />
              </div>
            </div>
          )
        }

        return (
          <Star
            key={i}
            className={`${iconSize} text-gray-200 fill-gray-200`}
            aria-hidden="true"
          />
        )
      })}
      {showValue && (
        <span className="ml-1.5 text-sm font-semibold text-gray-900">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
