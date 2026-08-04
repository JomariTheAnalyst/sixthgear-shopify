"use client"

import Link from "next/link"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import React, { useMemo } from "react"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  preserveSource = false,
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
  const { countryCode } = useParams()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const localizedHref = useMemo(() => {
    const baseHref = `/${countryCode}${href}`

    if (!preserveSource || !href.startsWith("/products/")) {
      return baseHref
    }

    const [path, existingQuery = ""] = baseHref.split("?")
    const nextParams = new URLSearchParams(existingQuery)
    const currentQuery = searchParams.toString()
    const currentPath = `${pathname}${currentQuery ? `?${currentQuery}` : ""}`

    nextParams.set("from", currentPath)

    if (pathname.includes("/store")) {
      nextParams.set("fromLabel", "Store")
    } else if (pathname.includes("/collections/")) {
      nextParams.set("fromLabel", "Collection")
    } else if (pathname.includes("/search")) {
      nextParams.set("fromLabel", "Search")
    }

    const serializedParams = nextParams.toString()
    return serializedParams ? `${path}?${serializedParams}` : path
  }, [countryCode, href, pathname, preserveSource, searchParams])

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
