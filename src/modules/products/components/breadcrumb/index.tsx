import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BreadcrumbProps = {
  product: HttpTypes.StoreProduct
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  const items = [
    { label: "Home", href: "/" },
    ...(product.collection
      ? [
          {
            label: product.collection.title || "Collection",
            href: `/collections/${product.collection.handle}`,
          },
        ]
      : [{ label: "Store", href: "/store" }]),
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
              <LocalizedClientLink
                href={item.href}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {item.label}
              </LocalizedClientLink>
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
