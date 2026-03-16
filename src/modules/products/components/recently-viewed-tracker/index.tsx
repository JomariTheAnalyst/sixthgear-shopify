"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@lib/hooks/use-recently-viewed"

interface RecentlyViewedTrackerProps {
  handle: string
  title: string
  price: string
  image: string
}

const RecentlyViewedTracker = ({ handle, title, price, image }: RecentlyViewedTrackerProps) => {
  const { addRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    addRecentlyViewed({ handle, title, price, image })
  }, [handle, title, price, image, addRecentlyViewed])

  return null
}

export default RecentlyViewedTracker
