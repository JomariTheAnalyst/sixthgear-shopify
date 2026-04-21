"use client"

import Image from "next/image"

type CollectionHeroProps = {
  title: string
  description?: string
  backgroundImageUrl?: string | null
}

export default function CollectionHero({
  title,
  description,
  backgroundImageUrl,
}: CollectionHeroProps) {
  return (
    <section className="relative w-full bg-zinc-950 overflow-hidden flex items-center justify-center h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
      {backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          className="object-cover object-center opacity-70"
          priority
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 w-full">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white tracking-tight leading-none mb-2 md:mb-4"
          style={{ fontFamily: "'Inter Display', sans-serif" }}
        >
          {title}
        </h1>

        {description && description.trim() !== "" && (
          <p
            className="text-xs sm:text-sm md:text-base text-gray-200 max-w-xl leading-relaxed mt-1 md:mt-2 font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
