export default function OrderDetailLoading() {
  return (
    <div className="w-full animate-pulse" data-testid="order-detail-skeleton">
      {/* Back link */}
      <div className="h-4 w-24 bg-gray-100 rounded mb-6" />

      {/* Order Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-7 w-36 bg-gray-100 rounded-lg" />
        <div className="h-6 w-24 bg-gray-100 rounded-full" />
        <div className="h-6 w-24 bg-gray-100 rounded-full" />
      </div>

      {/* Date */}
      <div className="h-3 w-40 bg-gray-100 rounded mb-8" />

      {/* Line Items */}
      <div className="space-y-4 mb-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-gray-100 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-100 pt-6 space-y-3 max-w-xs ml-auto">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-12 bg-gray-100 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}
