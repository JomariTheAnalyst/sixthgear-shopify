 "use client"

import { HttpTypes } from "@medusajs/types"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BreadcrumbProps = {
  product: HttpTypes.StoreProduct
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  const { countryCode } = useParams<{ countryCode: string }>()
  const searchParams = useSearchParams()

  const sourceHref = searchParams.get("from")
  const sourceLabel = searchParams.get("fromLabel")?.trim()
  const safeSourceHref =
    sourceHref &&
    countryCode &&
    (sourceHref === `/${countryCode}` || sourceHref.startsWith(`/${countryCode}/`))
      ? sourceHref
      : null

  const derivedSourceLabel = (() => {
    if (sourceLabel) {
      return sourceLabel
    }

    if (!safeSourceHref) {
      return "Store"
    }

    if (safeSourceHref.includes("/store")) {
      return "Store"
    }

    if (safeSourceHref.includes("/collections/")) {
      return "Collection"
    }

    if (safeSourceHref.includes("/search")) {
      return "Search"
    }

    return "Store"
  })()

  const items = [
    { label: "Home", href: "/" },
    ...(safeSourceHref && derivedSourceLabel !== "Home"
      ? [{ label: derivedSourceLabel, href: safeSourceHref, localized: false }]
      : [{ label: "Store", href: "/store", localized: true }]),
    { label: product.title || "Product" },
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <span className="text-gray-300">/</span>
            )}
            {item.href ? (
              item.localized === false ? (
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                <LocalizedClientLink
                  href={item.href}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {item.label}
                </LocalizedClientLink>
              )
            ) : (
              <span className="text-gray-700 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
