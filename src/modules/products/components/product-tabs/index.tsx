"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import Modal from "@modules/common/components/modal"
import { resolveSizeChart, type SizeChartResult } from "@lib/size-chart"
import { resolveWhatsInBox, resolveSpecifications, resolveShipping, resolveProductVideoUrl } from "@lib/shopify/metafield-resolvers"
import { extractShopifyRichTextRows } from "@lib/shopify/rich-text-renderer"

const ACTIVATE_SIZE_GUIDE_EVENT = "product:activate-size-guide-tab"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("description")
  const sizeChart = resolveSizeChart((product as any).shopifyMetafields)
  const whatsInBox = resolveWhatsInBox((product as any).shopifyMetafields)
  const whatsInBoxRows = extractShopifyRichTextRows(whatsInBox)
  const specifications = resolveSpecifications((product as any).shopifyMetafields)
  const specificationsRows = extractShopifyRichTextRows(specifications)
  const shipping = resolveShipping((product as any).shopifyMetafields)
  const shippingRows = extractShopifyRichTextRows(shipping)
  const productVideoUrl = resolveProductVideoUrl((product as any).shopifyMetafields)

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
      content: specificationsRows.length > 0
        ? <ParsedSpecificationsContent rows={specificationsRows} />
        : <ProductInfoContent product={product} />,
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
    ...(whatsInBoxRows.length === 0
      ? []
      : [
          {
            id: "whats_in_the_box",
            title: "What's in the Box",
            content: <WhatsInTheBoxContent rows={whatsInBoxRows} />,
          },
        ]),
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: shippingRows.length > 0
        ? <RichTextRowsContent rows={shippingRows} />
        : <ShippingAndReturnsContent />,
    },
    ...(productVideoUrl
      ? [
          {
            id: "product_video",
            title: "Product Video",
            content: <ProductVideoContent url={productVideoUrl} />,
          },
        ]
      : []),
  ]

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className="flex w-full flex-col">
      <div className="hide-scrollbar flex w-full overflow-x-auto border-b border-gray-200">
        <div className="mx-auto flex gap-8 px-4 lg:gap-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none ${
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

      <div className="py-6">{activeContent}</div>
    </div>
  )
}

const ProductInfoContent = ({ product }: ProductTabsProps) => {
  const p = product as any

  const METAFIELD_LABELS: Record<string, string> = {
    color: "Color",
    accessory_size: "Size",
    handwear_material: "Material",
    material: "Material",
    age_group: "Age Group",
    target_gender: "Target Gender",
    gender: "Gender",
    size: "Size",
    weight: "Weight",
    dimensions: "Dimensions",
    height: "Height",
    width: "Width",
    length: "Length",
    brand: "Brand",
    country_of_origin: "Country of Origin",
    protection_level: "Protection Level",
    certification: "Certification",
  }

  const specs: { label: string; value: string }[] = []

  const SKIP_KEYS = new Set([
    "care_instructions",
    "what_is_in_the_box",
    "size_guide",
    "size_chart",
    "size_chart_image",
    "size_chart_data",
    "rating",
    "rating_count",
    "specifications",
    "shipping",
    "product_video_url",
  ])
  const SKIP_NAMESPACES = new Set(["reviews"])

  function parseValue(raw: string): string {
    try {
      const parsed = JSON.parse(raw)

      if (Array.isArray(parsed)) {
        return parsed.map((v: unknown) => String(v)).join(", ")
      }

      return String(parsed)
    } catch {
      return raw
    }
  }

  const seenLabels = new Set<string>()

  if (Array.isArray(p.shopifyMetafields)) {
    for (const mf of p.shopifyMetafields) {
      if (SKIP_NAMESPACES.has(mf.namespace)) continue
      if (SKIP_KEYS.has(mf.key)) continue
      if (!mf.value) continue
      const label = METAFIELD_LABELS[mf.key]
      if (!label) continue
      if (seenLabels.has(label)) continue
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
    <div className="overflow-hidden rounded-lg border border-gray-100">
      <table className="w-full text-sm">
        <tbody>
          {specs.map(({ label, value }, index) => (
            <tr
              key={label}
              className={index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}
            >
              <th
                scope="row"
                className="w-1/3 whitespace-nowrap px-4 py-3 text-left font-semibold text-black"
              >
                {label}
              </th>
              <td className="border-l border-gray-100 px-4 py-3 text-gray-600">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type WhatsInTheBoxContentProps = {
  rows: string[]
}

const WhatsInTheBoxContent = ({ rows }: WhatsInTheBoxContentProps) => {
  if (rows.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {rows.map((row, index) => (
        <div
          key={`${row}-${index}`}
          className={`px-4 py-3 text-sm leading-relaxed text-gray-700 md:px-5 ${
            index % 2 === 0 ? "bg-[#fafafa]" : "bg-white"
          }`}
        >
          {row}
        </div>
      ))}
    </div>
  )
}

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
        <p className="text-sm text-gray-500">Click image to zoom.</p>
      </div>

      <Modal
        isOpen={isModalOpen}
        close={() => {
          setIsModalOpen(false)
          setIsZoomed(false)
        }}
        size="large"
      >
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

const ShippingAndReturnsContent = () => (
  <div className="space-y-6">
    <div>
      <h3 className="mb-3 text-left text-base font-semibold text-black">
        Shipping Details
      </h3>
      <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
        <li>Standard Delivery: 3-5 business days</li>
        <li>Provincial Delivery: 5-7 business days</li>
        <li>Tracking link provided via email/SMS for all orders</li>
      </ul>
    </div>
    <div className="border-t border-gray-100 pt-6">
      <h3 className="mb-3 text-left text-base font-semibold text-black">
        Return Policy
      </h3>
      <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
        <li>Easy returns accepted for defective or incorrect items</li>
        <li>Item must be unused, unwashed, and in its original packaging with tags intact</li>
        <li>Please contact support within 7 days of successful delivery</li>
      </ul>
    </div>
  </div>
)

type RichTextRowsContentProps = {
  rows: string[]
}

const RichTextRowsContent = ({ rows }: RichTextRowsContentProps) => {
  if (rows.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {rows.map((row, index) => (
        <div
          key={`${row}-${index}`}
          className={`px-4 py-3 text-sm leading-relaxed text-gray-700 md:px-5 ${
            index % 2 === 0 ? "bg-[#fafafa]" : "bg-white"
          }`}
        >
          {row}
        </div>
      ))}
    </div>
  )
}

type ParsedSpecificationsContentProps = {
  rows: string[]
}

const ParsedSpecificationsContent = ({ rows }: ParsedSpecificationsContentProps) => {
  if (rows.length === 0) return null

  const parsed: { label: string; value: string }[] = []
  let safeToParse = true

  for (const row of rows) {
    const colonIndex = row.indexOf(":")
    if (colonIndex === -1) {
      safeToParse = false
      break
    }
    const label = row.slice(0, colonIndex).trim()
    const value = row.slice(colonIndex + 1).trim()
    parsed.push({ label, value })
  }

  // Fallback Rule: Unsafe parsing reverts to raw rich text rows
  if (!safeToParse) {
    return <RichTextRowsContent rows={rows} />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <tbody>
          {parsed.map(({ label, value }, index) => (
            <tr
              key={`${label}-${index}`}
              className={index % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}
            >
              <th
                scope="row"
                className="w-[40%] whitespace-nowrap px-6 py-5 md:px-8 md:py-6 text-left font-semibold text-black"
              >
                {label}
              </th>
              <td className="border-l border-gray-100 px-6 py-5 md:px-8 md:py-6 text-gray-600">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type ProductVideoContentProps = {
  url: string
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    // YouTube standard: youtube.com/watch?v=ID
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`
    }

    // YouTube short: youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`
    }

    // YouTube Shorts: youtube.com/shorts/ID
    if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname.replace("/shorts/", "")
      return `https://www.youtube.com/embed/${id}`
    }

    // Vimeo: vimeo.com/ID
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.replace("/", "")
      return `https://player.vimeo.com/video/${id}`
    }

    // Already an embed URL or unknown — return as-is
    return url
  } catch {
    return null
  }
}

const ProductVideoContent = ({ url }: ProductVideoContentProps) => {
  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) {
    return (
      <p className="text-sm text-gray-400 italic">
        Invalid video URL.
      </p>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={embedUrl}
          title="Product Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  )
}

export default ProductTabs
