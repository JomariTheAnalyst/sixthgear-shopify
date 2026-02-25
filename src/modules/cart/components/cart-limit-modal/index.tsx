"use client"

import { X } from "lucide-react"

type CartLimitModalProps = {
  isOpen: boolean
  onClose: () => void
  currentCount: number
  limit: number
}

const CartLimitModal = ({
  isOpen,
  onClose,
  currentCount,
  limit,
}: CartLimitModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Cart Limit Reached</h2>

          <p className="text-gray-600">
            You have reached the maximum cart limit of {limit} items. Your cart
            currently has {currentCount} items.
          </p>

          <p className="text-gray-600">
            Please remove some items from your cart before adding more.
          </p>

          <button
            onClick={onClose}
            className="w-full mt-2 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartLimitModal
