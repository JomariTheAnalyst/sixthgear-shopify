import { stegaClean } from 'next-sanity'

function getSafeInternalPath(
  value: string | null | undefined,
  fallback = '/ph'
): string {
  if (typeof value !== 'string') return fallback
  const cleaned = stegaClean(value).trim()
  if (!cleaned.startsWith('/') || cleaned.startsWith('//') || cleaned.includes('\\')) {
    return fallback
  }
  try {
    const resolved = new URL(cleaned, 'https://sixthgear.invalid')
    return resolved.origin === 'https://sixthgear.invalid'
      ? `${resolved.pathname}${resolved.search}${resolved.hash}`
      : fallback
  } catch {
    return fallback
  }
}

const REDIRECT_KEYS = [
  'redirect',
  'redirectTo',
  'path',
  'pathname',
  'sanity-preview-pathname',
] as const

export function hasUnsafeDraftModeRedirect(requestUrl: string): boolean {
  try {
    const url = new URL(requestUrl)
    return REDIRECT_KEYS.some((key) => {
      const value = url.searchParams.get(key)
      return value !== null && getSafeInternalPath(value, '__invalid__') === '__invalid__'
    })
  } catch {
    return true
  }
}

export function getDraftModeReturnPath(requestUrl: string): string {
  try {
    const url = new URL(requestUrl)
    return getSafeInternalPath(url.searchParams.get('redirect'), '/ph')
  } catch {
    return '/ph'
  }
}

export function getSanityApiReadToken(): string | null {
  const token = process.env.SANITY_API_READ_TOKEN?.trim()
  return token || null
}

export async function handleDraftModeEnable(
  request: Request,
  activate: (request: Request, token: string) => Promise<Response>,
  token: string | null = getSanityApiReadToken()
): Promise<Response> {
  if (!token) {
    return new Response('Draft Mode is not configured', { status: 503 })
  }
  if (hasUnsafeDraftModeRedirect(request.url)) {
    return new Response('Invalid redirect', { status: 400 })
  }
  return activate(request, token)
}

export async function handleDraftModeDisable(
  request: Request,
  disable: () => void | Promise<void>
): Promise<Response> {
  await disable()
  return Response.redirect(
    new URL(getDraftModeReturnPath(request.url), request.url),
    307
  )
}
