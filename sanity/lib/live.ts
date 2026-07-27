import 'server-only'

import { defineLive } from 'next-sanity/live'

import { sanityClient } from './client'

const readToken = process.env.SANITY_API_READ_TOKEN?.trim() || false

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: readToken,
  browserToken: readToken,
  stega: true,
})
