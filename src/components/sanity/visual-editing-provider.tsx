'use client'

import { createContext, type HTMLAttributes, type ReactNode, useContext } from 'react'

import {
  createSanityDataAttribute,
  type SanityEditTarget as SanityEditTargetValue,
} from '@lib/cms/visual-editing'

const SanityVisualEditingContext = createContext(false)

export function useSanityVisualEditingEnabled() {
  return useContext(SanityVisualEditingContext)
}

export function SanityVisualEditingProvider({
  enabled,
  children,
}: {
  enabled: boolean
  children: ReactNode
}) {
  return (
    <SanityVisualEditingContext.Provider value={enabled}>
      {children}
    </SanityVisualEditingContext.Provider>
  )
}

export function useSanityEditTarget(target: SanityEditTargetValue) {
  const enabled = useSanityVisualEditingEnabled()
  const dataSanity = createSanityDataAttribute(enabled, target)

  return dataSanity ? { 'data-sanity': dataSanity } : {}
}

export function SanityEditTarget({
  documentId,
  documentType,
  path,
  children,
  ...props
}: SanityEditTargetValue & HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const attributes = useSanityEditTarget({ documentId, documentType, path })

  return (
    <div {...attributes} {...props}>
      {children}
    </div>
  )
}
