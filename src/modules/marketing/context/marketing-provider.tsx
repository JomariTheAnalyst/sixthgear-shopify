"use client"

import { createContext, useContext, ReactNode } from "react"
import { MarketingResponse, MarketingItem } from "../../../types/marketing"

interface MarketingContextValue {
  strip: MarketingItem | null
  banners: MarketingItem[]
  popups: MarketingItem[]
}

const MarketingContext = createContext<MarketingContextValue>({
  strip: null,
  banners: [],
  popups: [],
})

export function useMarketing() {
  return useContext(MarketingContext)
}

interface MarketingProviderProps {
  children: ReactNode
  marketing: MarketingResponse
}

export function MarketingProvider({
  children,
  marketing,
}: MarketingProviderProps) {
  return (
    <MarketingContext.Provider value={marketing}>
      {children}
    </MarketingContext.Provider>
  )
}

// Export hook to get banners for a specific placement
export function useBanners(placement?: string): MarketingItem[] {
  const { banners } = useMarketing()

  if (!placement) return banners

  return banners.filter((b) => b.placement === placement)
}
