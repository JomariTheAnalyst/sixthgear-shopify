"use client"
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import Modal from "@modules/common/components/modal"
import { resolveSizeChart, type SizeChartResult } from "@lib/size-chart"

const ACTIVATE_SIZE_GUIDE_EVENT = "product:activate-size-guide-tab"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("description")
  const sizeChart = resolveSizeChart((product as any).shopifyMetafields)

  useEffect(() => {
    const activateSizeGuide = () => {
      if (sizeChart.type !== "none") {
        setActiveTab("size_guide")
      }
    }

    window.addEventListener(ACTIVATE_SIZE_GUIDE_EVENT, activateSizeGuide)

    return () => {
      window.removeEventListener(ACTIVATE_SIZE_GUIDE_EVENT, activateSizeGuide)
    }
  }, [sizeChart.type])

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
    ...(sizeChart.type === "none"
      ? []
      : [
          {
            id: "size_guide",
            title: "Size Guide",
            content: <SizeGuideContent sizeChart={sizeChart} />,
          },
        ]),
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
      <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar w-full">
        <div className="flex mx-auto gap-8 lg:gap-16 px-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 focus:outline-none px-2 ${
                  isActive
                    ? "border-black text-black"
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
  const SKIP_KEYS = new Set([
    "care_instructions",
    "size_guide",
    "size_chart",
    "size_chart_image",
    "size_chart_data",
    "rating",
    "rating_count",
  ])
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
type SizeGuideContentProps = {
  sizeChart: SizeChartResult
}

const SizeGuideContent = ({ sizeChart }: SizeGuideContentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  if (sizeChart.type === "none") {
    return null
  }

  if (sizeChart.type === "table") {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-100 text-sm">
          <thead className="bg-gray-50/50">
            <tr>
              {sizeChart.data.headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="whitespace-nowrap border-b border-gray-100 px-4 py-3 text-left font-semibold text-black"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeChart.data.rows.map((row, index) => (
              <tr
                key={`${row.join("-")}-${index}`}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className="whitespace-nowrap border-b border-gray-100 px-4 py-3 text-gray-600"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="block w-full text-left"
        >
          <div className="w-full rounded-lg border border-gray-200 p-4 md:p-6">
            <img
              src={sizeChart.url}
              alt="Size chart"
              className="mx-auto block h-auto max-w-full"
            />
          </div>
        </button>
        <p className="text-sm text-gray-500">
          Click image to zoom.
        </p>
      </div>

      <Modal isOpen={isModalOpen} close={() => {
        setIsModalOpen(false)
        setIsZoomed(false)
      }} size="large">
        <Modal.Title>
          <h2 className="font-semibold">Size Guide</h2>
        </Modal.Title>
        <Modal.Body>
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="mx-auto block w-full max-w-4xl rounded-lg border border-gray-200 p-4 md:p-6"
          >
            <img
              src={sizeChart.url}
              alt="Size chart full size"
              className={`mx-auto block h-auto max-w-full transition-transform duration-200 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
            />
          </button>
        </Modal.Body>
      </Modal>
    </>
  )
}

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
