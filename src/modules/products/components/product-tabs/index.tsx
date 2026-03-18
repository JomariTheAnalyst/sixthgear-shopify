"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("description")

  const tabs = [
    {
      id: "description",
      title: "Description",
      content: product.description ? (
        <div
          className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        <p className="text-sm text-gray-400 italic">
          No description available.
        </p>
      ),
    },
    {
      id: "specifications",
      title: "Specifications",
      content: <ProductInfoContent product={product} />,
    },
    {
      id: "size_guide",
      title: "Size Guide",
      content: <SizeGuideContent />,
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: <ShippingAndReturnsContent />,
    },
  ]

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className="flex flex-col w-full">
      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
        <div className="flex gap-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 focus:outline-none ${
                  isActive
                    ? "border-orange-500 text-black"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
                aria-selected={isActive}
                role="tab"
              >
                {tab.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">{activeContent}</div>
    </div>
  )
}

/* ─── Specifications ─── */
const ProductInfoContent = ({ product }: ProductTabsProps) => {
  const p = product as any

  // Label map covering both `shopify` taxonomy keys and `custom` keys
  const METAFIELD_LABELS: Record<string, string> = {
    // shopify namespace (Category metafields shown in admin)
    color:              "Color",
    accessory_size:     "Size",
    handwear_material:  "Material",
    material:           "Material",
    age_group:          "Age Group",
    target_gender:      "Target Gender",
    gender:             "Gender",
    size:               "Size",
    // custom namespace
    weight:             "Weight",
    dimensions:         "Dimensions",
    height:             "Height",
    width:              "Width",
    length:             "Length",
    brand:              "Brand",
    country_of_origin:  "Country of Origin",
    protection_level:   "Protection Level",
    certification:      "Certification",
  }

  const specs: { label: string; value: string }[] = []

  // Skip these — review data, not spec fields
  const SKIP_KEYS = new Set(["care_instructions", "size_guide", "rating", "rating_count"])
  const SKIP_NAMESPACES = new Set(["reviews"])

  // Shopify stores list-type values as JSON arrays e.g. ["Black","navy green"]
  function parseValue(raw: string): string {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map((v: unknown) => String(v)).join(", ")
      return String(parsed)
    } catch {
      return raw
    }
  }

  const seenLabels = new Set<string>()

  // Read all metafields across shopify + custom namespaces
  if (Array.isArray(p.shopifyMetafields)) {
    for (const mf of p.shopifyMetafields) {
      if (SKIP_NAMESPACES.has(mf.namespace)) continue
      if (SKIP_KEYS.has(mf.key)) continue
      if (!mf.value) continue
      const label = METAFIELD_LABELS[mf.key]
      if (!label) continue
      if (seenLabels.has(label)) continue  // deduplicate same label from different namespaces
      seenLabels.add(label)
      specs.push({ label, value: parseValue(mf.value) })
    }
  }

  if (specs.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No specifications available for this product.
      </p>
    )
  }

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {specs.map(({ label, value }, index) => (
            <tr
              key={label}
              className={index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}
            >
              <th
                scope="row"
                className="px-4 py-3 text-left font-semibold text-black w-1/3 whitespace-nowrap"
              >
                {label}
              </th>
              <td className="px-4 py-3 text-gray-600 border-l border-gray-100">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Size Guide ─── */
const SizeGuideContent = () => (
  <div className="text-sm text-gray-600">
    <p className="mb-4 leading-relaxed">
      Please refer to the specific sizing chart provided in the product images or description above. 
      Riding gear sizing can vary significantly between brands and models.
    </p>
    <p className="leading-relaxed">
      If you are unsure about your size, we recommend taking your measurements 
      (chest, waist, and inseam) and contacting our support team for guidance before placing your order. 
      For protective gear, a snug but comfortable fit is essential for safety.
    </p>
  </div>
)

/* ─── Shipping & Returns ─── */
const ShippingAndReturnsContent = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-base font-semibold text-black mb-3 text-left">
        Shipping Details
      </h3>
      <ul className="text-sm text-gray-600 space-y-2 list-inside list-disc">
        <li>Standard Delivery: 3-5 business days</li>
        <li>Provincial Delivery: 5-7 business days</li>
        <li>Cash on Delivery (COD) available nationwide</li>
        <li>Tracking link provided via email/SMS for all orders</li>
      </ul>
    </div>
    <div className="pt-6 border-t border-gray-100">
      <h3 className="text-base font-semibold text-black mb-3 text-left">
        Return Policy
      </h3>
      <ul className="text-sm text-gray-600 space-y-2 list-inside list-disc">
        <li>Easy returns accepted for defective or incorrect items</li>
        <li>Item must be unused, unwashed, and in its original packaging with tags intact</li>
        <li>Please contact support within 7 days of successful delivery</li>
      </ul>
    </div>
  </div>
)

export default ProductTabs
