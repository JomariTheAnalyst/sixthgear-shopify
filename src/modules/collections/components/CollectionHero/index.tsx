import Image from "next/image"
import type { SanityCollectionHero } from "@lib/cms/types"

type CollectionHeroProps = {
  data: SanityCollectionHero | null
  fallbackTitle: string
  fallbackDescription?: string
}

export default function CollectionHero({
  data,
  fallbackTitle,
  fallbackDescription,
}: CollectionHeroProps) {
  const heading = data?.heading ?? fallbackTitle
  const badge = data?.badge ?? null
  const description = data?.description ?? fallbackDescription ?? null
  const backgroundImageUrl = data?.backgroundImageUrl ?? null

  return (
    <section className="relative w-full bg-zinc-950 overflow-hidden flex items-center justify-center h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
      {/* LAYER 1 — Background Image with object-cover ensures it fills the container elegantly on all devices */}
      {backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          className="object-cover object-center opacity-70"
          priority
        />
      )}

      {/* Dark Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

      {/* LAYER 2 — Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 w-full">
        {badge && badge.trim() !== "" && (
          <span className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/90 text-[10px] md:text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4">
            {badge}
          </span>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white tracking-tight leading-none mb-2 md:mb-4" style={{ fontFamily: "'Inter Display', sans-serif" }}>
          {heading}
        </h1>

        {description && description.trim() !== "" && (
          <p className="text-xs sm:text-sm md:text-base text-gray-200 max-w-xl leading-relaxed mt-1 md:mt-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
