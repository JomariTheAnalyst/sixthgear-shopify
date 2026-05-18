export default function MainLoading() {
  return (
    <div className="min-h-[60vh] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12">
        <div className="animate-pulse">
          <div className="mb-8 h-[220px] rounded-md bg-gray-100 sm:h-[300px] lg:h-[360px]" />

          <div className="mb-6 h-7 w-48 rounded bg-gray-100" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="border border-gray-100 bg-white">
                <div className="aspect-square bg-gray-100" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-16 rounded bg-gray-100" />
                  <div className="h-4 w-4/5 rounded bg-gray-100" />
                  <div className="h-4 w-24 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
