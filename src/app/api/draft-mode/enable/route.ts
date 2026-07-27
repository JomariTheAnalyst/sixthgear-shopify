import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { sanityClient } from '../../../../../sanity/lib/client'
import {
  handleDraftModeEnable,
} from '@lib/cms/draft-mode'

export async function GET(request: Request): Promise<Response> {
  return handleDraftModeEnable(request, async (validatedRequest, token) => {
    const handler = defineEnableDraftMode({
      client: sanityClient.withConfig({
        token,
        useCdn: false,
        perspective: 'drafts',
      }),
    })
    return handler.GET(validatedRequest)
  })
}
