"use client"

import { useState } from "react"
import { AlertTriangle, Loader2, MapPin } from "lucide-react"
import { deleteCustomerAddress, setDefaultAddress } from "@lib/data/customer"
import { ShopifyMailingAddress } from "@lib/shopify/types"

interface AddressCardProps {
  address: ShopifyMailingAddress
  isDefault: boolean
  onEdit: () => void
  onSetDefault: () => void
  onDeleted: () => void
}

export default function AddressCard({
  address,
  isDefault,
  onEdit,
  onSetDefault,
  onDeleted,
}: AddressCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSettingDefault, setIsSettingDefault] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [defaultError, setDefaultError] = useState<string | null>(null)

  const handleSetDefault = async () => {
    setDefaultError(null)
    setIsSettingDefault(true)
    const result = await setDefaultAddress(address.id)
    setIsSettingDefault(false)

    if (result.success) {
      onSetDefault()
      return
    }

    setDefaultError(result.error || "Failed to set default address.")
  }

  const handleDelete = async () => {
    setDeleteError(null)
    setIsDeleting(true)
    const result = await deleteCustomerAddress(address.id)
    setIsDeleting(false)

    if (result.success) {
      onDeleted()
      return
    }

    setDeleteError(result.error || "Delete failed.")
  }

  if (showConfirm) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-sm font-semibold text-gray-900 mt-2 text-center">
          Delete this address?
        </p>
        <p className="text-sm text-gray-500 text-center">This action cannot be undone.</p>
        <p className="text-xs text-gray-400 mt-1 text-center">
          {[address.address1, address.city].filter(Boolean).join(", ")}
        </p>

        {deleteError && <p className="text-sm text-red-600 mt-2 text-center">{deleteError}</p>}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setShowConfirm(false)
              setDeleteError(null)
            }}
            className="flex-1 bg-white border border-gray-200 text-gray-700 rounded-lg h-9 text-sm hover:border-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white rounded-lg h-9 text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative">
      <div className="flex justify-between items-start">
        <div>
          {isDefault && (
            <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={onEdit}
            className="text-sm text-gray-500 hover:text-gray-900 underline-offset-2 hover:underline"
          >
            Edit
          </button>
          <span className="text-gray-300 mx-1.5">|</span>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="text-sm text-gray-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-700">
        {(address.firstName || address.lastName) && (
          <p>{[address.firstName, address.lastName].filter(Boolean).join(" ")}</p>
        )}
        {address.company && <p>{address.company}</p>}
        {address.address1 && <p>{address.address1}</p>}
        {address.address2 && <p>{address.address2}</p>}
        {(address.city || address.province || address.zip) && (
          <p>{`${address.city || ""}${address.city ? ", " : ""}${address.province || ""}${address.province ? " " : ""}${address.zip || ""}`.trim()}</p>
        )}
        {address.country && <p>{address.country}</p>}
        {address.phone && <p className="text-gray-500">{address.phone}</p>}
      </div>

      {!isDefault && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleSetDefault}
            className="text-sm text-gray-500 hover:text-orange-600"
            disabled={isSettingDefault}
          >
            {isSettingDefault ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" />
                Setting...
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                Set as default
              </>
            )}
          </button>
          {defaultError && <p className="text-sm text-red-600 mt-2">{defaultError}</p>}
        </div>
      )}
    </div>
  )
}
