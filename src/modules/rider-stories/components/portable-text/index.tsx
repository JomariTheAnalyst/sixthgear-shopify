import Image from "next/image"
import { PortableText, type PortableTextComponents } from "@portabletext/react"

import { inter, montserrat } from "@lib/fonts"
import type { SanityPortableTextBlock } from "@lib/cms/types"
import { toRootRelativeHref } from "@lib/util/href"

type RiderStoryPortableTextProps = {
  value: SanityPortableTextBlock[] | null
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className={`${inter.className} text-[1.02rem] leading-[1.78] text-[#252525] sm:text-[1.06rem]`}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className={`${montserrat.className} text-[2.55rem] font-extrabold leading-[0.92] tracking-[-0.07em] text-[#191b22] sm:text-[4rem]`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={`${montserrat.className} text-[1.75rem] font-extrabold leading-[0.96] tracking-[-0.05em] text-[#191b22] sm:text-[2.3rem]`}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className={`${montserrat.className} text-[1.3rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#191b22] sm:text-[1.5rem]`}
      >
        {children}
      </h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul
        className={`${inter.className} list-disc space-y-3 pl-6 text-[1.02rem] leading-[1.78] text-[#252525] sm:text-[1.06rem]`}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        className={`${inter.className} list-decimal space-y-3 pl-6 text-[1.02rem] leading-[1.78] text-[#252525] sm:text-[1.06rem]`}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href =
        typeof value?.href === "string" && value.href.length > 0
          ? toRootRelativeHref(value.href)
          : "#"
      const isExternal = /^https?:\/\//i.test(href)

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-medium text-[#F16D34] underline underline-offset-4 transition-colors hover:text-[#d95e29]"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.url) {
        return null
      }

      const alt =
        typeof value.alt === "string" && value.alt.length > 0
          ? value.alt
          : "Article image"

      return (
        <figure className="overflow-hidden rounded-[20px] bg-black/[0.03]">
          <div className="relative aspect-[16/10]">
            <Image
              src={value.url}
              alt={alt}
              fill
              sizes="(max-width: 959px) 100vw, 860px"
              className="object-cover"
            />
          </div>
          {value.alt ? (
            <figcaption
              className={`${inter.className} px-4 py-3 text-sm leading-6 text-black/60 sm:px-5`}
            >
              {value.alt}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },
}

export default function RiderStoryPortableText({
  value,
}: RiderStoryPortableTextProps) {
  if (!value || value.length === 0) {
    return null
  }

  return (
    <div className="space-y-10 [&_h2]:mt-20 [&_h2]:mb-12 [&_h3]:mt-16 [&_h3]:mb-8 [&_h4]:mt-12 [&_h4]:mb-6 [&_figure]:my-12">
      <PortableText value={value} components={components} />
    </div>
  )
}
