"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const MAX_THUMBNAILS = 6

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-gray-200 rounded-2xl flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext()
      else handlePrev()
    }
    setTouchStart(null)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current || !isZoomed) return
    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const selectedImage = images[activeIndex]

  const extraCount = images.length - MAX_THUMBNAILS
  const displayedThumbnails = images.slice(0, MAX_THUMBNAILS)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "Escape") setIsLightboxOpen(false)
        if (e.key === "ArrowLeft") handlePrev()
        if (e.key === "ArrowRight") handleNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLightboxOpen, handlePrev, handleNext])

  useEffect(() => {
    const handleVariantImage = (e: any) => {
      const imageUrl = e.detail?.imageUrl
      if (!imageUrl) return

      const idx = images.findIndex((img) => img.url === imageUrl)
      if (idx !== -1) {
        setActiveIndex(idx)
      }
    }

    window.addEventListener("variantImageSelected", handleVariantImage)
    return () =>
      window.removeEventListener("variantImageSelected", handleVariantImage)
  }, [images])

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Mobile dots indicator */}
      <div className="flex lg:hidden justify-center gap-1.5 mt-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all focus:outline-none ${
              activeIndex === index
                ? "bg-black w-5"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to image ${index + 1}`}
            aria-current={activeIndex === index}
          />
        ))}
      </div>

      {/* Thumbnails — Horizontal Strip on Mobile, Vertical on Desktop */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden scrollbar-hide pb-1 lg:pb-0 pr-1 w-full lg:w-[80px] flex-shrink-0 lg:max-h-[600px]">
        {displayedThumbnails.map((image, index) => (
          <button
            key={image.id || index}
            onClick={() => setActiveIndex(index)}
            className={`relative flex-shrink-0 w-16 h-16 md:w-[72px] md:h-[72px] lg:w-full lg:h-auto lg:aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 ${
              activeIndex === index
                ? "border-gray-900"
                : "border-transparent hover:border-gray-400"
            }`}
            aria-label={`View image ${index + 1}`}
            aria-current={activeIndex === index}
          >
            {image.url && (
              <Image
                src={image.url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 72px, 80px"
                unoptimized
              />
            )}
          </button>
        ))}

        {/* "+N more" Indicator */}
        {extraCount > 0 && (
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="relative flex-shrink-0 w-16 h-16 md:w-[72px] md:h-[72px] lg:w-full lg:h-auto lg:aspect-square rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
            aria-label={`View ${extraCount} more images`}
          >
            <span className="text-white text-sm font-semibold">
              +{extraCount} more
            </span>
          </button>
        )}
      </div>

      {/* Main Image */}
      <div className="relative w-full flex-grow">
        <div
          ref={mainImageRef}
          className="relative aspect-[4/5] lg:aspect-[4/4.5] w-full rounded-2xl overflow-hidden bg-gray-200 cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Click to open full screen gallery"
          onKeyDown={(e) => e.key === "Enter" && setIsLightboxOpen(true)}
        >
          {selectedImage?.url && (
            <Image
              src={selectedImage.url}
              alt={`Product image ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              className={`object-contain p-6 transition-transform duration-200 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              sizes="(max-width: 768px) 100vw, 60vw"
              unoptimized
            />
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-6 right-6 bg-white shadow-sm overflow-hidden rounded-full w-10 h-10 flex flex-col items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn
              className="w-5 h-5 text-gray-700"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl max-h-[85vh] px-16">
            {selectedImage?.url && (
              <img
                src={selectedImage.url}
                alt={`Product image ${activeIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Bottom thumbnail strip in lightbox */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                  activeIndex === index
                    ? "border-white opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                {img.url && (
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
