export default function AddressesLoading() {
  return (
    <div className="w-full animate-pulse" data-testid="addresses-skeleton">
      {/* Page Title */}
      <div className="h-8 w-36 bg-gray-100 rounded-lg mb-6" />

      {/* Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-5 border border-gray-100 rounded-xl space-y-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="h-3 w-48 bg-gray-100 rounded" />
            <div className="h-3 w-40 bg-gray-100 rounded" />
            <div className="h-3 w-36 bg-gray-100 rounded" />
            <div className="h-3 w-28 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
