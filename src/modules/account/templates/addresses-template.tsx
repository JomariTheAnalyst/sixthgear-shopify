"use client"

import { useState } from "react"
import { ChevronLeft, MapPin, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import { ShopifyMailingAddress } from "@lib/shopify/types"
import AddressCard from "@modules/account/components/address-card"
import AddressForm from "@modules/account/components/address-form"

interface AddressesTemplateProps {
  addresses: ShopifyMailingAddress[]
  defaultAddressId: string | undefined
}

type ViewMode = "list" | "add" | "edit"

export default function AddressesTemplate({
  addresses,
  defaultAddressId,
}: AddressesTemplateProps) {
  const router = useRouter()
  const [view, setView] = useState<ViewMode>("list")
  const [editingAddress, setEditingAddress] = useState<ShopifyMailingAddress | null>(null)
  const [defaultId, setDefaultId] = useState<string | undefined>(defaultAddressId)
  const [addressList, setAddressList] = useState<ShopifyMailingAddress[]>(addresses)

  if (view === "add") {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setView("list")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to addresses
        </button>

        <h2 className="text-xl font-bold text-gray-900">Add New Address</h2>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <AddressForm
            action={addCustomerAddress}
            onSuccess={() => {
              router.refresh()
              setView("list")
            }}
            onCancel={() => setView("list")}
            submitLabel="Save Address"
          />
        </div>
      </div>
    )
  }

  if (view === "edit" && editingAddress) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setView("list")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to addresses
        </button>

        <h2 className="text-xl font-bold text-gray-900">Edit Address</h2>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <AddressForm
            action={updateCustomerAddress}
            existingAddress={editingAddress}
            onSuccess={() => {
              router.refresh()
              setView("list")
            }}
            onCancel={() => setView("list")}
            submitLabel="Update Address"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          type="button"
          onClick={() => setView("add")}
          className="bg-[#0a0a0a] text-white text-sm font-medium px-4 h-9 rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {addressList.length === 0 ? (
        <div className="py-16 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-lg font-semibold text-gray-900 mt-4">No saved addresses</p>
          <p className="text-sm text-gray-500 mt-2">Add an address for faster checkout.</p>
          <button
            type="button"
            onClick={() => setView("add")}
            className="mt-6 bg-[#0a0a0a] text-white text-sm font-medium px-4 h-9 rounded-lg hover:bg-gray-800"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressList.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isDefault={addr.id === defaultId}
              onEdit={() => {
                setEditingAddress(addr)
                setView("edit")
              }}
              onSetDefault={() => setDefaultId(addr.id)}
              onDeleted={() => {
                setAddressList((prev) => prev.filter((a) => a.id !== addr.id))
                if (defaultId === addr.id) {
                  setDefaultId(undefined)
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
