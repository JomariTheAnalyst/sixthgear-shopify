const SKELETON_COUNT = 8

export default function WishlistSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-32 animate-pulse mt-3" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="aspect-square bg-gray-50 animate-pulse" />
            <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col">
              <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse mt-auto pt-4" />
              <div className="h-10 bg-gray-100 rounded w-full animate-pulse mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
