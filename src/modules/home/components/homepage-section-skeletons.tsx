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
    <section className="w-full overflow-hidden bg-black px-4 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="w-full">
        <div className="mb-8 md:mb-10">
          <div className="h-9 w-64 animate-pulse rounded bg-[#ffffff]/15 md:h-12 md:w-80" />
        </div>
        <div className="border-b border-[#ffffff]/25">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="grid h-[clamp(6.2rem,9vw,8.5rem)] grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 border-t border-[#ffffff]/25 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-6"
            >
              <div className="h-3 w-6 animate-pulse rounded bg-[#E0521F]/35" />
              <div className="flex-1">
                <div className={`h-10 animate-pulse rounded bg-[#ffffff]/15 md:h-16 ${index === 1 ? "w-3/5" : "w-2/5"}`} />
                <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-[#ffffff]/10" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 h-12 w-48 animate-pulse rounded-full bg-[#ffffff]/20 md:mt-10 md:w-56" />
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
      </div>
      <div className="flex gap-3 overflow-hidden px-3">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex min-h-[360px] shrink-0 basis-[85%] flex-col rounded-xl bg-[#f3f3f3] p-5 xsmall:min-h-[420px] xsmall:basis-[calc((100%_-_0.75rem)/2)] xsmall:p-6 md:min-h-[480px] md:p-8 small:basis-[calc((100%_-_1.5rem)/3)] medium:basis-[calc((100%_-_2.25rem)/4)] xlarge:min-h-[540px]"
          >
            <div className="h-5 w-7 animate-pulse rounded bg-gray-200" />
            <div className="mt-8 h-5 w-full animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-5 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-5 w-4/6 animate-pulse rounded bg-gray-200" />
            <div className="mt-auto h-4 w-28 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
      <div className="px-4 md:px-8">
        <div className="mt-6 flex justify-center gap-3">
          <SkeletonBlock className="h-12 w-12" />
          <SkeletonBlock className="h-12 w-12" />
        </div>
      </div>
    </section>
  )
}
