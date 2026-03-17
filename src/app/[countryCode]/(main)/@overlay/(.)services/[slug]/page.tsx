import { notFound } from "next/navigation"

import { getServiceDetailData } from "@lib/data/service-detail"
import ServiceBottomSheet from "@modules/services/components/service-bottom-sheet"
import ServiceDetailTemplate from "@modules/services/templates/service-detail"

interface OverlayServicePageProps {
  params: Promise<{
    countryCode: string
    slug: string
  }>
}

export default async function OverlayServicePage({
  params,
}: OverlayServicePageProps) {
  const { slug } = await params
  const data = await getServiceDetailData(slug)

  if (!data) {
    notFound()
  }

  return (
    <ServiceBottomSheet>
      <ServiceDetailTemplate
        service={data.service}
        otherServices={data.otherServices}
      />
    </ServiceBottomSheet>
  )
}
