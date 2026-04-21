function SkeletonBlock({
  className,
}: {
  className: string
}) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

function SectionHeaderSkeleton({
  dark = false,
}: {
  dark?: boolean
}) {
  const titleClass = dark ? "bg-white/20" : "bg-gray-200"
  const copyClass = dark ? "bg-white/10" : "bg-gray-100"

  return (
    <div className="mb-8 md:mb-12 lg:mb-16 text-center">
      <div className={`mx-auto h-10 w-64 animate-pulse rounded ${titleClass} md:h-12 md:w-80 lg:h-14 lg:w-96`} />
      <div className={`mx-auto mt-4 h-4 w-56 animate-pulse rounded ${copyClass} md:h-5 md:w-72 lg:w-96`} />
    </div>
  )
}

export function ServicesSectionSkeleton() {
  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <SectionHeaderSkeleton />
        <div className="flex gap-4 md:gap-6 overflow-hidden -mx-4 px-4 md:-mx-0 md:px-0">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-[350px] lg:w-[400px] h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100"
            >
              <SkeletonBlock className="h-full w-full rounded-none" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="h-7 w-3/4 animate-pulse rounded bg-white/70" />
                <div className="mt-5 h-10 w-32 animate-pulse rounded bg-white/60" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 md:mt-8 flex justify-center gap-3">
          <SkeletonBlock className="h-11 w-11 md:h-12 md:w-12 rounded-lg" />
          <SkeletonBlock className="h-11 w-11 md:h-12 md:w-12 rounded-lg" />
        </div>
      </div>
    </section>
  )
}

export function ExperiencesSectionSkeleton() {
  return (
    <section className="bg-[#2a2a2a] py-12 md:py-16 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <SectionHeaderSkeleton dark />
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl bg-[#1a1a1a]">
              <div className="h-48 md:h-56 lg:h-64 animate-pulse bg-white/10" />
              <div className="p-5 md:p-6">
                <div className="h-6 w-3/4 animate-pulse rounded bg-white/15" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TeamSectionSkeleton() {
  return (
    <section className="relative">
      <div className="bg-[#0A0A0A] relative overflow-hidden">
        <div className="py-16 md:py-24 lg:py-28">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            <SectionHeaderSkeleton dark />
            <div className="flex gap-6 overflow-hidden px-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="overflow-hidden rounded-3xl bg-white">
                    <div className="aspect-[4/5] animate-pulse bg-gray-300" />
                    <div className="px-6 py-8 md:py-10">
                      <div className="mx-auto h-6 w-32 animate-pulse rounded bg-gray-200" />
                      <div className="mx-auto mt-3 h-4 w-28 animate-pulse rounded bg-gray-100" />
                      <div className="mx-auto mt-5 h-4 w-40 animate-pulse rounded bg-gray-100" />
                      <div className="mx-auto mt-3 h-3 w-48 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSectionSkeleton() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <SectionHeaderSkeleton />
        <div className="flex gap-6 md:gap-8 overflow-hidden -mx-2 px-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="min-w-[300px] max-w-[360px] flex-shrink-0 rounded-2xl border border-gray-100 bg-[#F9F9F9] p-6 md:p-8"
            >
              <div className="mx-auto h-6 w-8 animate-pulse rounded bg-gray-200" />
              <div className="mt-6 h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-4 w-4/6 animate-pulse rounded bg-gray-200" />
              <div className="mx-auto mt-8 h-px w-12 bg-gray-200" />
              <div className="mx-auto mt-5 h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="mx-auto mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <SkeletonBlock className="h-12 w-12" />
          <SkeletonBlock className="h-12 w-12" />
        </div>
      </div>
    </section>
  )
}
