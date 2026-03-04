import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight, Home } from "lucide-react"

type BreadcrumbProps = {
  product: HttpTypes.StoreProduct
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  const items = [
    { label: "Store", href: "/store" },
    ...(product.collection
      ? [{ label: product.collection.title || "Collection", href: `/collections/${product.collection.handle}` }]
      : []),
    { label: product.title || "Product" },
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        <li>
          <LocalizedClientLink
            href="/"
            className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </LocalizedClientLink>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            {item.href ? (
              <LocalizedClientLink
                href={item.href}
                className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded"
              >
                {item.label}
              </LocalizedClientLink>
            ) : (
              <span className="text-slate-900 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
