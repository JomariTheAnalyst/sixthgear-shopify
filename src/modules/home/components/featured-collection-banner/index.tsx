import FeaturedCollectionItem from "./FeaturedCollectionItem"
import type { SanityFeaturedCollectionItem } from "@lib/cms/types"
import { keyedSanityPath } from "@lib/cms/visual-editing"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"

interface FeaturedCollectionBannerProps {
  data: SanityFeaturedCollectionItem | null
}

export default function FeaturedCollectionBanner({
  data,
}: FeaturedCollectionBannerProps) {
  if (!data) return null

  const path = data._key
    ? keyedSanityPath("featuredCollections", data._key)
    : "featuredCollections"

  return (
    <SanityEditTarget
      documentId="marketing"
      documentType="marketing"
      path={path}
      className="w-full py-4 md:py-6"
    >
      <FeaturedCollectionItem data={data} />
    </SanityEditTarget>
  )
}
