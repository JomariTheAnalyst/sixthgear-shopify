export default function ServiceDetailSkeleton() {
  return (
    <div className="bg-white animate-pulse">
      <div className="relative h-[320px] md:h-[420px] lg:h-[520px] bg-gray-200" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-10 md:py-14 lg:py-16 space-y-10">
        <div className="space-y-4 max-w-3xl">
          <div className="h-5 w-28 rounded bg-gray-200" />
          <div className="h-10 md:h-12 w-full max-w-2xl rounded bg-gray-200" />
          <div className="h-5 w-full max-w-3xl rounded bg-gray-100" />
          <div className="h-5 w-[88%] max-w-2xl rounded bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_360px] gap-10 lg:gap-12">
          <div className="space-y-4">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-[92%] rounded bg-gray-100" />
              <div className="h-4 w-[86%] rounded bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 rounded-2xl border border-gray-100 bg-gray-50"
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 md:p-8 space-y-4">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-[90%] rounded bg-gray-100" />
            <div className="h-4 w-[82%] rounded bg-gray-100" />
            <div className="pt-4 space-y-3">
              <div className="h-12 w-full rounded-xl bg-gray-200" />
              <div className="h-12 w-full rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>

        <div className="space-y-5 pt-4">
          <div className="h-7 w-48 rounded bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-64 rounded-3xl border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
