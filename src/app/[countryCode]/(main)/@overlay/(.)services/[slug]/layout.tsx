import ServiceBottomSheet from "@modules/services/components/service-bottom-sheet"

export default function OverlayServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ServiceBottomSheet>{children}</ServiceBottomSheet>
}
