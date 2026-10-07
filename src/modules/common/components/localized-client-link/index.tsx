"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import React from "react"

import { toRootRelativeHref } from "@lib/util/href"

// Where a product page was opened from, for its breadcrumb. Kept in
// sessionStorage so product URLs stay clean (no ?from= query params).
export const PRODUCT_SOURCE_STORAGE_KEY = "sg:product-source"

export type ProductSource = {
  productPath: string
  href: string
  label: string
}

/**
 * Internal link. Public URLs have no country prefix (see middleware); hrefs
 * from CMS data are made root-relative here.
 */
const LocalizedClientLink = ({
  children,
  href: rawHref,
  preserveSource = false,
  onClick,
  ...props
}: {
  children?: React.ReactNode
  href: string
  preserveSource?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  passHref?: true
  [x: string]: any
}) => {
  const href = toRootRelativeHref(rawHref)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event)

    if (!preserveSource || !href.startsWith("/products/")) {
      return
    }

    const currentQuery = searchParams.toString()
    const label = pathname.includes("/store")
      ? "Store"
      : pathname.includes("/collections/")
        ? "Collection"
        : null

    if (!label) {
      return
    }

    const source: ProductSource = {
      productPath: href.split("?")[0],
      href: `${pathname}${currentQuery ? `?${currentQuery}` : ""}`,
      label,
    }

    try {
      sessionStorage.setItem(PRODUCT_SOURCE_STORAGE_KEY, JSON.stringify(source))
    } catch {
      // Storage unavailable (private mode): the breadcrumb falls back to Store.
    }
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
