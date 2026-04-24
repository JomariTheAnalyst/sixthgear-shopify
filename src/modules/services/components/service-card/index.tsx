"use client"

import Image from "next/image"
import Link from "next/link"

import { TextRoll } from "components/ui/text-roll"
import { inter, montserrat } from "@lib/fonts"

type ServiceCardProps = {
  title: string
  description: string
  image: string
  href?: string | null
  className?: string
}

export default function ServiceCard({
  title,
  description,
  image,
  href,
  className,
}: ServiceCardProps) {
  const content = (
    <>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 639px) 75vw, (max-width: 767px) 60vw, (max-width: 1023px) 350px, 400px"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/15 opacity-95 transition-opacity duration-500 ease-out group-hover:opacity-90" />

      <div className="absolute inset-0 flex items-center justify-center p-5 md:p-6 lg:p-7">
        <div className="relative flex min-h-[170px] w-full items-center justify-center overflow-hidden">
          <h3
            className={`${montserrat.className} absolute max-w-[18ch] text-center text-xl md:text-2xl font-bold tracking-[0.02em] text-white text-balance transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[-18px] group-hover:opacity-0 group-hover:scale-[0.98]`}
          >
            {title}
          </h3>
          <p
            className={`${inter.className} absolute max-w-[30ch] text-center text-sm md:text-[15px] leading-relaxed text-white opacity-0 translate-y-5 scale-[0.985] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-7">
        <span
          className={`${montserrat.className} absolute bottom-5 right-5 md:bottom-6 md:right-6 lg:bottom-7 lg:right-7 inline-flex items-center text-xs md:text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 group-hover:text-[#FF5000]`}
        >
          <TextRoll transition={{ duration: 0.35 }} className="whitespace-nowrap">
            Learn More
          </TextRoll>
        </span>
      </div>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={`group relative aspect-[3/4] overflow-hidden rounded-2xl ${className || ""}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      className={`group relative aspect-[3/4] overflow-hidden rounded-2xl ${className || ""}`}
    >
      {content}
    </div>
  )
}
