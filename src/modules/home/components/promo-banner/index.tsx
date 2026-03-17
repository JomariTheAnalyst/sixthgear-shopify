import Image from "next/image"
import Link from "next/link"
import type { SanityPromoBanner } from "@lib/cms/types"
import { interDisplay, lato } from "@lib/fonts"

interface PromoBannerProps {
  data: SanityPromoBanner | null
}

const posMap: Record<string, string> = {
  top_left: "top-4 left-4 md:top-6 md:left-8",
  top_center: "top-4 left-1/2 -translate-x-1/2 md:top-6",
  top_right: "top-4 right-4 md:top-6 md:right-8",
  bottom_left: "bottom-4 left-4 md:bottom-8 md:left-8",
  bottom_center: "bottom-4 left-1/2 -translate-x-1/2 md:bottom-8",
  bottom_right: "bottom-4 right-4 md:bottom-8 md:right-8",
}

export default function PromoBanner({ data }: PromoBannerProps) {
  if (!data) return null
  if (!data.isActive) return null
  if (!data.imageUrl) return null

  const btnPos = posMap[data.buttonPosition ?? "bottom_right"] ?? posMap.bottom_right

  return (
    <section className="w-full relative overflow-hidden">
      <div className="relative w-full overflow-hidden h-[260px] sm:h-[320px] md:h-[400px] lg:h-[500px]">
        <Image
          src={data.imageUrl}
          alt={data.heading || data.internalName || "Promotional banner"}
          fill
          className="object-cover"
          sizes="100vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Heading */}
        {data.heading && (
          <div className="absolute bottom-8 left-4 md:bottom-12 md:left-8 z-10 pointer-events-none">
            <span className={`${lato.className} text-white/80 font-black text-[4rem] md:text-[6rem] lg:text-[8rem] leading-none tracking-[0.04em]`}>
              {data.heading}
            </span>
          </div>
        )}

        {/* Button */}
        {data.buttonLabel && data.buttonLink && (
          <Link
            href={data.buttonLink}
            className={`${interDisplay.className} absolute z-10 ${btnPos} inline-block bg-white text-gray-900 font-bold text-sm md:text-base uppercase tracking-wider px-6 py-3 md:px-8 md:py-4 hover:bg-gray-100 transition-colors duration-200`}
          >
            {data.buttonLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
