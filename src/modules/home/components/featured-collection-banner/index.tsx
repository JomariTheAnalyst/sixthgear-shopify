import FeaturedCollectionItem from "./FeaturedCollectionItem"
import type { SanityFeaturedCollectionItem } from "@lib/cms/types"

interface FeaturedCollectionBannerProps {
  data: SanityFeaturedCollectionItem | null
}

export default function FeaturedCollectionBanner({
  data,
}: FeaturedCollectionBannerProps) {
  if (!data) return null

  return (
    <div className="w-full py-4 md:py-6">
      <FeaturedCollectionItem data={data} />
    </div>
  )
}
