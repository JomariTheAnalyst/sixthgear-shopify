"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
        <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false)
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === 'ArrowRight') handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, handlePrev, handleNext])

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails — Desktop (vertical left strip) */}
      <div className="hidden lg:flex flex-col gap-2 w-20 flex-shrink-0">
        {images.map((image, index) => (
          <button
            key={image.id || index}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
              activeIndex === index ? 'border-slate-900' : 'border-slate-200 hover:border-slate-400'
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
                sizes="80px"
                unoptimized
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative">
        <div
          ref={mainImageRef}
          className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Click to open full screen gallery"
          onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
        >
          {selectedImage?.url && (
            <Image
              src={selectedImage.url}
              alt={`Product image ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              className={`object-contain p-4 transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : undefined}
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm pointer-events-none">
            <ZoomIn className="w-5 h-5 text-slate-700" aria-hidden="true" />
          </div>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </>
        )}

        {/* Mobile dots indicator */}
        <div className="flex lg:hidden justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                activeIndex === index ? 'bg-slate-900 w-6' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
              aria-current={activeIndex === index}
            />
          ))}
        </div>
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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
