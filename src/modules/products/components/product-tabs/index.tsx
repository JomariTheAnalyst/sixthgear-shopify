"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { ChevronDown } from "lucide-react"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const tabs = [
    {
      id: "description",
      title: "Description",
      content: product.description ? (
        <div
          className="prose prose-slate prose-sm max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        <p className="text-sm text-slate-400 italic mb-4">No description available.</p>
      ),
    },
    {
      id: "specifications",
      title: "Specifications",
      content: <ProductInfoContent product={product} />,
    },
    {
      id: "fitment",
      title: "Fitment & Compatibility",
      content: <FitmentContent />,
    }
  ]

  return (
    <div className="flex flex-col w-full">
      {tabs.map((item, index) => {
        const isOpen = openItems.includes(item.id)
        return (
          <div key={item.id} className="border-b border-gray-100 last:border-b">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 group"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-header-${item.id}`}
            >
              <span className="text-[15px] font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                {item.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            <div
              id={`accordion-content-${item.id}`}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="text-slate-600 pb-5">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Specifications (Details) ─── */
const ProductInfoContent = ({ product }: ProductTabsProps) => {
  const hasDetails =
    product.material ||
    product.origin_country ||
    product.type ||
    product.weight

  if (!hasDetails) {
    return (
      <p className="text-sm text-slate-400 italic mb-4">
        No additional specifications available.
      </p>
    )
  }

  const specs: Record<string, string> = {}
  if (product.material) specs["Material"] = product.material
  if (product.origin_country) specs["Country of Origin"] = product.origin_country
  if (product.type) specs["Type"] = product.type.value
  if (product.weight) specs["Weight"] = `${product.weight} g`
  if (product.length && product.width && product.height) {
    specs["Dimensions"] = `${product.length}L x ${product.width}W x ${product.height}H`
  }

  const entries = Object.entries(specs)

  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden mb-4">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value], index) => (
            <tr
              key={key}
              className={index % 2 === 0 ? "bg-slate-50/50" : "bg-white"}
            >
              <th
                scope="row"
                className="px-4 py-3 text-left font-semibold text-slate-900 w-1/3"
              >
                {key}
              </th>
              <td className="px-4 py-3 text-slate-600 border-l border-slate-100">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Fitment & Compatibility ─── */
const FitmentContent = () => (
  <div className="text-sm text-slate-600 mb-4">
    <p>
      Please check the manufacturer's manual or contact our support team at{" "}
      <a href="mailto:support@sixthgearmoto.com" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">
        support@sixthgearmoto.com
      </a>{" "}
      if you are unsure whether this part fits your motorcycle.
    </p>
  </div>
)

export default ProductTabs
