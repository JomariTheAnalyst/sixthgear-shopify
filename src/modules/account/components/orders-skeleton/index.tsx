// Pure shimmer skeleton — no client state needed

export default function OrdersSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-36 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2">
        {[80, 60, 72, 64, 70, 60].map((w, i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-gray-100 animate-pulse flex-shrink-0"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Order card skeletons */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left block */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
                  <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
                </div>
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
              {/* Right block */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
