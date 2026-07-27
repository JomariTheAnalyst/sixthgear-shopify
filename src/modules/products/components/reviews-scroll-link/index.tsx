"use client"

import { type MouseEvent, type ReactNode } from "react"
import { useLenis } from "@modules/common/components/lenis-provider"

type ReviewsScrollLinkProps = {
  children: ReactNode
  className?: string
}

export default function ReviewsScrollLink({
  children,
  className,
}: ReviewsScrollLinkProps) {
  const lenis = useLenis()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    const reviewsSection = document.getElementById("reviews")
    if (!reviewsSection) {
      return
    }

    if (lenis) {
      lenis.scrollTo(reviewsSection, { offset: -120 })
      return
    }

    reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <a href="#reviews" className={className} onClick={handleClick}>
      {children}
    </a>
  )
}
