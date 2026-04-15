"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

type OrderQrModalProps = {
  orderId: string
  orderNumber: number
  orderStatus: string
  receiptUrl: string
}

export default function OrderQrModal({
  orderId,
  orderNumber,
  orderStatus,
  receiptUrl,
}: OrderQrModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const downloadName = useMemo(
    () => `order-${orderNumber}-qr.png`,
    [orderNumber]
  )

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = downloadName
    link.click()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 [font-family:var(--font-poppins)]"
      >
        Show QR Code
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 py-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-[28px] bg-white px-5 pb-6 pt-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] [font-family:var(--font-poppins)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close QR code modal"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="pr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f97316]">
                Order Receipt
              </p>
              <h2 className="mt-3 text-[28px] font-semibold leading-tight text-black">
                Scan to open your receipt
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Scan on your phone to view your order receipt.
              </p>
            </div>

            <div className="mt-6 rounded-[24px] border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex justify-center">
                <div className="rounded-[22px] border border-gray-200 bg-white p-4">
                  <QRCodeCanvas
                    ref={canvasRef}
                    id={`order-qr-${orderId}`}
                    value={receiptUrl}
                    size={220}
                    marginSize={4}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#111111"
                  />
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4 text-center">
                <p className="text-sm font-medium text-black">Order #{orderNumber}</p>
                <p className="mt-1 text-sm text-gray-600">{orderStatus}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3.5 sm:flex-row">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex min-h-[50px] w-full flex-1 items-center justify-center rounded-2xl bg-[#f97316] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#ea6a12] sm:min-h-[48px]"
              >
                Download PNG
              </button>
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[50px] w-full flex-1 items-center justify-center rounded-2xl border border-gray-300 px-6 text-[15px] font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:min-h-[48px]"
              >
                Open receipt
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
