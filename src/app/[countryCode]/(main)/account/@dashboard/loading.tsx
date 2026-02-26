export default function DashboardLoading() {
  return (
    <div className="w-full animate-pulse" data-testid="dashboard-skeleton">
      {/* Greeting */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-100 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg" />
      </div>

      {/* Recent Orders */}
      <div className="mb-6">
        <div className="h-6 w-36 bg-gray-100 rounded-lg mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="p-6 border border-gray-100 rounded-xl">
        <div className="h-5 w-40 bg-gray-100 rounded-lg mb-3" />
        <div className="h-3 w-full bg-gray-100 rounded mb-2" />
        <div className="h-3 w-3/4 bg-gray-100 rounded" />
      </div>
    </div>
  )
}
