import ServiceBottomSheet from "@modules/services/components/service-bottom-sheet"
import ServiceDetailSkeleton from "@modules/services/components/service-detail-skeleton"

export default function LoadingOverlayServicePage() {
  return (
    <ServiceBottomSheet>
      <ServiceDetailSkeleton />
    </ServiceBottomSheet>
  )
}
