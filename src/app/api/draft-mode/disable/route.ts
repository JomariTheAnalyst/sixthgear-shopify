import { draftMode } from 'next/headers'
import { handleDraftModeDisable } from '@lib/cms/draft-mode'

export async function GET(request: Request): Promise<Response> {
  return handleDraftModeDisable(request, async () => {
    const draft = await draftMode()
    draft.disable()
  })
}
