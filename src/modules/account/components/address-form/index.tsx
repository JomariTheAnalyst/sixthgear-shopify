"use client"

import { useActionState, useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import { ShopifyMailingAddress } from "@lib/shopify/types"

interface AddressFormProps {
  action: (
    prevState: string | null,
    formData: FormData
  ) => Promise<string | null>
  existingAddress?: ShopifyMailingAddress
  onSuccess: () => void
  onCancel: () => void
  submitLabel?: string
}

const inputClassName =
  "w-full h-11 border border-gray-200 rounded-lg px-3 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"

const labelClassName = "text-sm font-medium text-gray-700 mb-1.5 block"

export default function AddressForm({
  action,
  existingAddress,
  onSuccess,
  onCancel,
  submitLabel,
}: AddressFormProps) {
  const [message, formAction, isPending] = useActionState(action, null)
  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (isPending) {
      hasSubmitted.current = true
    }
  }, [isPending])

  useEffect(() => {
    if (hasSubmitted.current && !isPending && message === null) {
      onSuccess()
    }
  }, [isPending, message, onSuccess])

  return (
    <form action={formAction} className="space-y-4">
      {existingAddress && (
        <input type="hidden" name="addressId" value={existingAddress.id} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>First Name</label>
          <input
            className={inputClassName}
            name="firstName"
            required
            defaultValue={existingAddress?.firstName ?? ""}
          />
        </div>
        <div>
          <label className={labelClassName}>Last Name</label>
          <input
            className={inputClassName}
            name="lastName"
            required
            defaultValue={existingAddress?.lastName ?? ""}
          />
        </div>
      </div>

      <div>
        <label className={labelClassName}>Company</label>
        <input
          className={inputClassName}
          name="company"
          placeholder="Company (optional)"
          defaultValue={existingAddress?.company ?? ""}
        />
      </div>

      <div>
        <label className={labelClassName}>Address Line 1</label>
        <input
          className={inputClassName}
          name="address1"
          required
          placeholder="Street address"
          defaultValue={existingAddress?.address1 ?? ""}
        />
      </div>

      <div>
        <label className={labelClassName}>Address Line 2</label>
        <input
          className={inputClassName}
          name="address2"
          placeholder="Apartment, suite, unit (optional)"
          defaultValue={existingAddress?.address2 ?? ""}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>City</label>
          <input
            className={inputClassName}
            name="city"
            required
            defaultValue={existingAddress?.city ?? ""}
          />
        </div>
        <div>
          <label className={labelClassName}>ZIP / Postal Code</label>
          <input
            className={inputClassName}
            name="zip"
            required
            defaultValue={existingAddress?.zip ?? ""}
          />
        </div>
      </div>

      <div>
        <label className={labelClassName}>Province / Region</label>
        <input
          className={inputClassName}
          name="province"
          required
          placeholder="Province or region"
          defaultValue={existingAddress?.province ?? ""}
        />
      </div>

      <div>
        <label className={labelClassName}>Country</label>
        <input
          className={inputClassName}
          name="country"
          defaultValue={existingAddress?.country ?? "Philippines"}
        />
      </div>

      <div>
        <label className={labelClassName}>Phone</label>
        <input
          className={inputClassName}
          name="phone"
          type="tel"
          placeholder="+63 9XX XXX XXXX"
          defaultValue={existingAddress?.phone ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="isDefault"
          value="on"
          defaultChecked={!existingAddress}
          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />
        Set as default shipping address
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 bg-[#0a0a0a] text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-60 flex items-center justify-center"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          submitLabel ?? "Save Address"
        )}
      </button>

      {message && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{message}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
      >
        Cancel
      </button>
    </form>
  )
}
