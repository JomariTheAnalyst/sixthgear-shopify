/**
 * CMS and Shopify link values are free text. Anything that is not a full URL,
 * an anchor or a query is treated as a site path and made root-relative, so
 * "returns-warranty" never resolves against the current page
 * (/services/x → /services/returns-warranty). A legacy /ph prefix is dropped
 * to avoid a redirect hop.
 */
export function toRootRelativeHref(href: string): string {
  const value = href.trim()

  if (!value || /^([a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(value)) {
    return value
  }

  if (/^www\./i.test(value)) {
    return `https://${value}`
  }

  const path = value.startsWith("/") ? value : `/${value}`

  return path.replace(/^\/ph(?=\/|$|\?|#)/i, "") || "/"
}

/**
 * Applies toRootRelativeHref to every <a href> in store-owner HTML (Shopify
 * product descriptions and policies), which is rendered as-is.
 */
export function rootRelativeHtmlHrefs(html: string): string {
  return html.replace(
    /(<a\b[^>]*?\shref\s*=\s*)(["'])(.*?)\2/gi,
    (_, start: string, quote: string, href: string) =>
      `${start}${quote}${toRootRelativeHref(href)}${quote}`
  )
}
