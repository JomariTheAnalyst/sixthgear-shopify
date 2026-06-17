"use client"

import Image from "next/image"
import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"

type ProductGalleryImage = {
  id?: string
  url?: string | null
  width?: number | null
  height?: number | null
  altText?: string | null
}

type ImageGalleryProps = {
  images: ProductGalleryImage[]
}

const MAX_THUMBNAILS = 6

function isShopifyImageUrl(url?: string | null) {
  return Boolean(url && /^https:\/\/cdn\.shopify\.com\//i.test(url))
}

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-200">
      <svg
        className="h-8 w-8"
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

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isLightboxZoomed, setIsLightboxZoomed] = useState(false)
  const [lightboxZoomPosition, setLightboxZoomPosition] = useState({
    x: 50,
    y: 50,
  })
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(
    () => new Set()
  )
  const mainImageRef = useRef<HTMLDivElement>(null)
  const lightboxImageRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-white rounded-lg flex items-center justify-center">
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

  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lightboxImageRef.current || !isLightboxZoomed) return
    const rect = lightboxImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setLightboxZoomPosition({ x, y })
  }

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
    setIsLightboxZoomed(false)
    setLightboxZoomPosition({ x: 50, y: 50 })
  }, [])

  const markImageFailed = useCallback((url?: string | null) => {
    if (!url) return

    setFailedImageUrls((current) => {
      if (current.has(url)) {
        return current
      }

      const next = new Set(current)
      next.add(url)
      return next
    })
  }, [])

  const selectedImage = images[activeIndex]
  const selectedImageUrl = selectedImage?.url || ""
  const selectedImageAlt =
    selectedImage?.altText?.trim() || `Product image ${activeIndex + 1}`
  const selectedImageWidth = selectedImage?.width || 1600
  const selectedImageHeight = selectedImage?.height || 1600
  const selectedImageLargestEdge = Math.max(
    selectedImage?.width || 0,
    selectedImage?.height || 0
  )
  const canHoverZoom = Boolean(selectedImageUrl)
  const zoomScale =
    selectedImageLargestEdge >= 2400
      ? 2
      : selectedImageLargestEdge >= 1800
        ? 1.8
        : selectedImageLargestEdge >= 1400
          ? 1.6
          : selectedImageLargestEdge >= 1000
            ? 1.45
            : 1.6

  const extraCount = images.length - MAX_THUMBNAILS
  const displayedThumbnails = images.slice(0, MAX_THUMBNAILS)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "Escape") closeLightbox()
        if (e.key === "ArrowLeft") handlePrev()
        if (e.key === "ArrowRight") handleNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLightboxOpen, handlePrev, handleNext, closeLightbox])

  useEffect(() => {
    setIsLightboxZoomed(false)
    setLightboxZoomPosition({ x: 50, y: 50 })
  }, [activeIndex])

  useEffect(() => {
    const activeUrl = images[activeIndex]?.url

    if (!activeUrl || !failedImageUrls.has(activeUrl)) {
      return
    }

    const nextValidIndex = images.findIndex(
      (image) => image.url && !failedImageUrls.has(image.url)
    )

    if (nextValidIndex !== -1 && nextValidIndex !== activeIndex) {
      setActiveIndex(nextValidIndex)
    }
  }, [activeIndex, failedImageUrls, images])

  useEffect(() => {
    const handleVariantImage = (e: CustomEvent<{ imageUrl?: string }>) => {
      const imageUrl = e.detail?.imageUrl
      if (!imageUrl) return

      const idx = images.findIndex((img) => img.url === imageUrl)
      if (idx !== -1) {
        setActiveIndex(idx)
      }
    }

    window.addEventListener(
      "variantImageSelected",
      handleVariantImage as EventListener
    )

    return () =>
      window.removeEventListener(
        "variantImageSelected",
        handleVariantImage as EventListener
      )
  }, [images])

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
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

      <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden scrollbar-hide pb-1 lg:pb-0 pr-1 w-full lg:w-[88px] flex-shrink-0 lg:max-h-[600px]">
        {displayedThumbnails.map((image, index) => (
          <button
            key={image.id || index}
            onClick={() => setActiveIndex(index)}
            className={`relative flex-shrink-0 w-[72px] h-[72px] md:w-[88px] md:h-[88px] lg:w-full lg:h-auto lg:aspect-square bg-white rounded overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 ${
              activeIndex === index
                ? "border-gray-900"
                : "border-transparent hover:border-gray-400"
            }`}
            aria-label={`View image ${index + 1}`}
            aria-current={activeIndex === index}
          >
            {image.url && !failedImageUrls.has(image.url) ? (
              <Image
                src={image.url}
                alt={image.altText?.trim() || ""}
                fill
                unoptimized={isShopifyImageUrl(image.url)}
                onError={() => markImageFailed(image.url)}
                className="object-cover"
                sizes="(max-width: 1024px) 72px, 88px"
                quality={75}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </button>
        ))}

        {extraCount > 0 && (
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="relative flex-shrink-0 w-[72px] h-[72px] md:w-[88px] md:h-[88px] lg:w-full lg:h-auto lg:aspect-square rounded overflow-hidden bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
            aria-label={`View ${extraCount} more images`}
          >
            <span className="text-white text-sm font-semibold">
              +{extraCount} more
            </span>
          </button>
        )}
      </div>

      <div className="relative w-full flex-grow">
        <div
          ref={mainImageRef}
          className={`relative aspect-[4/5] lg:aspect-[3.5/4] w-full rounded-[4px] md:rounded-lg border border-gray-100 overflow-hidden bg-white ${
            canHoverZoom ? "cursor-zoom-in" : "cursor-default"
          }`}
          onMouseEnter={() => canHoverZoom && setIsZoomed(true)}
          onMouseLeave={() => {
            setIsZoomed(false)
            setZoomPosition({ x: 50, y: 50 })
          }}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Click to open full screen gallery"
          onKeyDown={(e) => e.key === "Enter" && setIsLightboxOpen(true)}
        >
          {selectedImageUrl && !failedImageUrls.has(selectedImageUrl) ? (
            <>
              <Image
                src={selectedImageUrl}
                alt={selectedImageAlt}
                fill
                priority={activeIndex === 0}
                unoptimized={isShopifyImageUrl(selectedImageUrl)}
                onError={() => markImageFailed(selectedImageUrl)}
                className={`object-contain p-6 transition-transform duration-200 ${
                  canHoverZoom && isZoomed ? "scale-[1.02]" : "scale-100"
                }`}
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), (max-width: 1280px) 58vw, 700px"
                quality={85}
              />

              {canHoverZoom && isZoomed && (
                <div
                  className="absolute inset-0 pointer-events-none hidden md:block"
                  style={{
                    backgroundColor: "#ffffff",
                    backgroundImage: `url("${selectedImageUrl}")`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${zoomScale * 100}%`,
                  }}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/40 to-transparent p-4">
                    <span className="inline-flex rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm">
                      Hover to zoom
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ImagePlaceholder />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(true)
            }}
            className="absolute bottom-4 right-4 bg-white border border-gray-200 shadow-sm rounded-full w-10 h-10 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            aria-label="View in fullscreen"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" aria-hidden="true" />
          </button>
        </div>
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[120] bg-white flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-black" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>

          <div
            ref={lightboxImageRef}
            className={`max-w-5xl max-h-[85vh] overflow-hidden px-16 flex items-center justify-center ${
              selectedImageUrl ? "cursor-zoom-in" : "cursor-default"
            }`}
            onMouseEnter={() => selectedImageUrl && setIsLightboxZoomed(true)}
            onMouseLeave={() => {
              setIsLightboxZoomed(false)
              setLightboxZoomPosition({ x: 50, y: 50 })
            }}
            onMouseMove={handleLightboxMouseMove}
          >
            {selectedImageUrl && !failedImageUrls.has(selectedImageUrl) ? (
              <Image
                src={selectedImageUrl}
                alt={selectedImageAlt}
                width={selectedImageWidth}
                height={selectedImageHeight}
                unoptimized={isShopifyImageUrl(selectedImageUrl)}
                onError={() => markImageFailed(selectedImageUrl)}
                className={`max-w-full max-h-[85vh] w-auto h-auto object-contain transition-transform duration-300 ease-out ${
                  isLightboxZoomed ? "scale-[1.75]" : "scale-100"
                }`}
                style={{
                  transformOrigin: `${lightboxZoomPosition.x}% ${lightboxZoomPosition.y}%`,
                }}
                sizes="100vw"
                quality={90}
              />
            ) : (
              <div className="h-[420px] w-[420px] max-w-full">
                <ImagePlaceholder />
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {images.map((img, index) => (
              <button
                key={img.id || index}
                onClick={() => setActiveIndex(index)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all bg-gray-50 ${
                  activeIndex === index
                    ? "border-black opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {img.url && !failedImageUrls.has(img.url) ? (
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    unoptimized={isShopifyImageUrl(img.url)}
                    onError={() => markImageFailed(img.url)}
                    className="object-cover"
                    sizes="56px"
                    quality={75}
                  />
                ) : (
                  <ImagePlaceholder />
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
