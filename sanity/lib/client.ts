import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * The single Sanity client used by both published and draft-aware fetching.
 * Request-level perspective, token, CDN, and stega behavior is owned by defineLive.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})
