import { Metadata } from "next"
import { getLocalizedCanonicalPath } from "@lib/seo"
import BirSealBadge from "@modules/legal/components/bir-seal-badge"

export const metadata: Metadata = {
  title: "Government Compliance",
  description:
    "Sixthgear Moto Supply & Cafe is registered with the Bureau of Internal Revenue (BIR). Scan the BIR Registration Seal QR code to verify.",
  alternates: {
    canonical: getLocalizedCanonicalPath("ph", "/government-compliance"),
  },
}

export default function GovernmentCompliancePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Government Compliance
        </h1>
        <p className="text-gray-700 leading-relaxed mb-8">
          Sixthgear is registered with the Bureau of Internal Revenue (BIR).
          Scan the QR code to verify our registration.
        </p>
        <BirSealBadge />
      </div>
    </div>
  )
}
