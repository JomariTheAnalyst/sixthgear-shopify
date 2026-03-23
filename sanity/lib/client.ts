import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'
import { homepageQuery, collectionHeroQuery } from './cms/queries'
import type { SanityHeroSection, SanityCollectionHero } from './cms/types'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

export async function getHomepageHero(): Promise<SanityHeroSection | null> {
  try {

    const result = await client.fetch<{ hero: SanityHeroSection | null } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      },
    )

    if (!result?.hero) {
    }

    return result?.hero ?? null
  } catch (error) {
    console.error("[Sanity] getHomepageHero failed:", error)
    return null
  }
}

export async function getCollectionHero(
  handle: string
): Promise<SanityCollectionHero | null> {
  try {
    const result = await client.fetch<SanityCollectionHero | null>(
      collectionHeroQuery,
      { handle },
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      },
    )

    return result ?? null
  } catch (error) {
    console.error('[Sanity] getCollectionHero failed:', error)
    return null
  }
}
