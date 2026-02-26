export default function OrdersLoading() {
  return (
    <div className="w-full animate-pulse" data-testid="orders-skeleton">
      {/* Page Title */}
      <div className="h-8 w-32 bg-gray-100 rounded-lg mb-6" />

      {/* Orders Table */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded ml-auto" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-4 border-b border-gray-50 last:border-0"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
            <div className="h-6 w-20 bg-gray-100 rounded-full ml-auto" />
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
