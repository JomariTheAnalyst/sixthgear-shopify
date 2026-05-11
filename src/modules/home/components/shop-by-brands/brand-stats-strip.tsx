import Image from "next/image"

import { inter, montserrat } from "@lib/fonts"

export type BrandStatItem = {
  iconUrl?: string
  icon?: string
  title: string
  description: string
}

const FALLBACK_BRAND_STATS: BrandStatItem[] = [
  {
    title: "Rider-Built Experience",
    description: "Years of hands-on motorcycle expertise",
  },
  {
    title: "Trusted by Riders",
    description: "Preferred by riders and enthusiasts",
  },
  {
    title: "Fast Turnaround",
    description: "Efficient, reliable service delivery",
  },
  {
    title: "Genuine Parts & Accessories",
    description: "Trusted OEM and premium aftermarket",
  },
]

function StatGlyph({
  index,
  iconUrl,
  title,
}: {
  index: number
  iconUrl?: string
  title: string
}) {
  if (iconUrl) {
    return (
      <Image
        src={iconUrl}
        alt={title}
        width={20}
        height={20}
        className="h-5 w-5 object-contain brightness-0 saturate-0"
      />
    )
  }

  const glyphs = [
    (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 3l2.65 5.37L20.5 9.2l-4.25 4.14L17.3 20 12 17.2 6.7 20l1.05-6.66L3.5 9.2l5.85-.83L12 3z"
        />
      </svg>
    ),
    (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 5v14M5 12h14"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M7 7l10 10M17 7L7 17"
        />
      </svg>
    ),
    (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4v4h-4z"
        />
      </svg>
    ),
    (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M8 11a3 3 0 116 0 3 3 0 11-6 0zM3 18a5 5 0 0110 0M14 10a2 2 0 114 0 2 2 0 11-4 0zM15.5 18a4 4 0 017 0"
        />
      </svg>
    ),
  ]

  return glyphs[index % glyphs.length]
}

export default function BrandStatsStrip({
  stats,
}: {
  stats?: BrandStatItem[] | null
}) {
  const resolvedStats = stats && stats.length > 0 ? stats : FALLBACK_BRAND_STATS

  if (resolvedStats.length === 0) {
    return null
  }

  return (
    <div className="mt-4 w-full border-y border-black/10 bg-[#efefef] md:mt-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {resolvedStats.map((stat, index) => (
            <div
              key={`${stat.title}-${index}`}
              className="border-b border-r border-black/10 p-4 last:border-r-0 even:border-r-0 md:border-b-0 md:even:border-r md:[&:nth-child(4)]:border-r-0 md:p-6"
            >
              <div className="mb-3 flex items-center gap-3 text-black">
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-black/25" />
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-black/25" />
                  <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-black/25" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-black/25" />
                  <StatGlyph
                    index={index}
                    iconUrl={stat.iconUrl}
                    title={stat.title}
                  />
                </div>
              </div>

              <h3
                className={`${montserrat.className} text-sm font-black uppercase tracking-[0.05em] text-[#111111] md:text-[15px]`}
              >
                {stat.title}
              </h3>
              <p
                className={`${inter.className} mt-1 text-sm leading-6 text-[#4f4b46]`}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
