 "use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import LocalizedClientLink, {
  PRODUCT_SOURCE_STORAGE_KEY,
  type ProductSource,
} from "@modules/common/components/localized-client-link"

type BreadcrumbProps = {
  product: HttpTypes.StoreProduct
}

const isInternalPath = (href: unknown): href is string =>
  typeof href === "string" && href.startsWith("/") && !href.startsWith("//")

function readProductSource(productPath: string): ProductSource | null {
  try {
    const raw = sessionStorage.getItem(PRODUCT_SOURCE_STORAGE_KEY)
    const source = raw ? (JSON.parse(raw) as Partial<ProductSource>) : null

    return source &&
      typeof source.productPath === "string" &&
      decodeURI(source.productPath) === decodeURI(productPath) &&
      isInternalPath(source.href) &&
      typeof source.label === "string"
      ? (source as ProductSource)
      : null
  } catch {
    return null
  }
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  const pathname = usePathname()
  // Read after mount so server and first client render match (Store fallback).
  const [source, setSource] = useState<ProductSource | null>(null)

  useEffect(() => {
    setSource(readProductSource(pathname))
  }, [pathname])

  const items = [
    { label: "Home", href: "/" },
    ...(source
      ? [{ label: source.label, href: source.href, localized: false }]
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
