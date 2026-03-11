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
    <section className="relative w-full bg-zinc-950 overflow-hidden flex items-center justify-center min-h-[320px]">
      {/* LAYER 1 — Background Image dictates the natural height, ensuring NO cropping and NO zooming */}
      {backgroundImageUrl ? (
        <Image
          src={backgroundImageUrl}
          alt=""
          width={1920}
          height={640}
          className="w-full h-auto object-cover" // h-auto uses the exact aspect ratio of the image
          priority
        />
      ) : (
        <div className="w-full aspect-[16/5] min-h-[320px] bg-zinc-950" />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 pointer-events-none" />

      {/* LAYER 2 — Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 py-8 pointer-events-none">
        {badge && badge.trim() !== "" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold uppercase tracking-widest mb-4">
            {badge}
          </span>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none mb-4">
          {heading}
        </h1>

        {description && description.trim() !== "" && (
          <p className="text-sm md:text-base text-white/60 max-w-xl leading-relaxed mt-2">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
