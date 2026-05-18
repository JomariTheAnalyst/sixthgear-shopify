export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[220px] bg-gray-100 sm:h-[280px] lg:h-[340px]" />

      <div className="border-b border-gray-100 bg-gray-50/60">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-12">
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-12 lg:py-8">
        <div className="animate-pulse">
          <div className="mb-6 flex items-center justify-between border-y border-gray-200 py-3">
            <div className="hidden gap-3 md:flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-9 w-24 rounded bg-gray-100" />
              ))}
            </div>
            <div className="h-9 w-24 rounded bg-gray-100 md:hidden" />
            <div className="h-9 w-32 rounded bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 border-l border-t border-gray-200 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="border-b border-r border-gray-200 bg-white">
                <div className="aspect-square bg-gray-100" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-16 rounded bg-gray-100" />
                  <div className="h-4 w-4/5 rounded bg-gray-100" />
                  <div className="h-4 w-1/2 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
