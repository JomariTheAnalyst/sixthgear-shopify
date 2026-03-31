export default function SkeletonProductCard() {
  return (
    <article className="h-full flex flex-col bg-white animate-pulse">
      {/* Image area — white bg */}
      <div className="relative w-full aspect-square bg-white overflow-hidden" />

      {/* Text section */}
      <div className="flex flex-col flex-1 pt-4 px-4 pb-4">
        {/* Vendor placeholder */}
        <div className="h-2 w-16 bg-gray-100 rounded-sm mb-1.5" />
        {/* Title placeholder — line 1 */}
        <div className="h-4 w-3/4 bg-gray-200 rounded-sm mb-1.5" />
        {/* Title placeholder — line 2 */}
        <div className="h-4 w-1/2 bg-gray-200 rounded-sm mb-2" />
        
        {/* Availability placeholder */}
        <div className="h-2 w-2/5 bg-gray-100 rounded-sm mt-1" />

        {/* Pricing & Cart row */}
        <div className="mt-auto pt-2 flex w-full items-end justify-between gap-2">
          <div className="h-3.5 w-20 bg-gray-200 rounded-sm" />
          <div className="w-9 h-9 flex-shrink-0 bg-gray-100 rounded-sm" />
        </div>
      </div>
    </article>
  );
}
