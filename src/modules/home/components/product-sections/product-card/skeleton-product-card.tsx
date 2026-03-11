export default function SkeletonProductCard() {
  return (
    <article className="h-full flex flex-col bg-white animate-pulse">
      {/* Top Image Container — exact match to real aspect-square */}
      <div className="relative w-full aspect-square bg-[#f0f0f0] overflow-hidden" />

      {/* Compact Bottom Information Block */}
      <div className="flex flex-col flex-1 pt-2 px-1 pb-1 bg-white relative">
        <div className="flex flex-col gap-0.5">
          {/* Brand Placeholder */}
          <div className="h-2 w-1/3 bg-gray-200 rounded-sm mb-0.5" />
          {/* Title Placeholder */}
          <div className="h-3 w-3/4 bg-gray-200 rounded-sm" />
          {/* Availability Text Placeholder */}
          <div className="h-2 w-1/2 bg-gray-100 rounded-sm mt-0.5" />
        </div>

        {/* Pricing & Cart Action Row */}
        <div className="mt-auto pt-1 flex w-full items-center justify-between gap-2">
          <div className="flex flex-col gap-1 w-full">
             <div className="h-3.5 w-20 bg-gray-200 rounded-sm" />
          </div>

          {/* Cart Icon Placeholder (10x10) */}
          <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-sm" />
        </div>
      </div>
    </article>
  );
}
