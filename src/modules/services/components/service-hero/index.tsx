"use client"

/**
 * Service Hero Section
 * Hero banner for main services page. The photo is shown whole (its own
 * aspect ratio, no crop, no overlay). The h1 and description stay in the
 * page for SEO and screen readers.
 */

import Image from "next/image"

import type { ServicesHeroContent } from "@lib/cms/services-page-content"

interface ServiceHeroProps {
  content: ServicesHeroContent
}

export default function ServiceHero({ content }: ServiceHeroProps) {
  return (
    <div className="relative w-full">
      <Image
        src={content.heroImage}
        alt={content.imageAlt}
        width={2134}
        height={737}
        quality={100}
        sizes="100vw"
        priority
        className="block h-auto w-full"
      />

      <h1 className="sr-only">{content.title}</h1>
      {content.description && <p className="sr-only">{content.description}</p>}
    </div>
  )
}
