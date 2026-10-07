import { createDataAttribute, stegaClean } from 'next-sanity'

import { toRootRelativeHref } from '@lib/util/href'

export const SANITY_STUDIO_PATH = '/studio'

export type SanityEditTarget = {
  documentId: string
  documentType: string
  path: string
}

export function shouldRenderVisualEditing(isDraftModeEnabled: boolean): boolean {
  return isDraftModeEnabled
}

export function cleanSanityString(value: string): string {
  return stegaClean(value)
}

/** A CMS link value, cleaned and made root-relative (see toRootRelativeHref). */
export function cleanSanityHref(value: string): string {
  return toRootRelativeHref(stegaClean(value))
}

export function cleanOptionalSanityString(
  value: string | null | undefined
): string | null {
  return typeof value === 'string' ? stegaClean(value) : null
}

export function keyedSanityPath(parentPath: string, key: string): string {
  const cleanKey = stegaClean(key).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `${parentPath}[_key=="${cleanKey}"]`
}

export function createSanityDataAttribute(
  enabled: boolean,
  target: SanityEditTarget
): string | undefined {
  if (!enabled) return undefined

  return createDataAttribute({
    baseUrl: SANITY_STUDIO_PATH,
    id: target.documentId,
    type: target.documentType,
    path: target.path,
  }).toString()
}

export function getSafeInternalPath(
  value: string | null | undefined,
  fallback = '/'
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
