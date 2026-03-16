"use client"

import { useCallback, useEffect, useState } from "react"

export interface LeanProduct {
  handle: string
  title: string
  price: string
  image: string
  savedAt: number
}

const STORAGE_KEY = "sg_recently_viewed"
const MAX_STORED = 8
const MAX_SHOWN = 6

const readRecentlyViewed = (): LeanProduct[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored) as LeanProduct[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<LeanProduct[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setRecentlyViewed(readRecentlyViewed().slice(0, MAX_SHOWN))
    setIsMounted(true)
  }, [])

  const addRecentlyViewed = useCallback((product: Omit<LeanProduct, "savedAt">) => {
    try {
      let currentItems = readRecentlyViewed()

      currentItems = currentItems.filter((item) => item.handle !== product.handle)

      const newItem: LeanProduct = { ...product, savedAt: Date.now() }
      currentItems.unshift(newItem)
      currentItems = currentItems.slice(0, MAX_STORED)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems))
      setRecentlyViewed(currentItems.slice(0, MAX_SHOWN))
    } catch {
      setRecentlyViewed((current) => current.slice(0, MAX_SHOWN))
    }
  }, [])

  return { recentlyViewed, addRecentlyViewed, isMounted }
}
