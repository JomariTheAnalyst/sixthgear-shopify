"use client"

import { useActionState } from "react"
import { useState, useEffect, useRef } from "react"
import { updateCustomer } from "@lib/data/customer"
import { ShopifyCustomer } from "@lib/shopify/types"
import { SubmitButton } from "@modules/common/components/submit-button"

type Props = {
  customer: ShopifyCustomer
}

export default function ProfileForm({ customer }: Props) {
  const [message, formAction, isPending] = useActionState(updateCustomer, null)
  const [showSuccess, setShowSuccess] = useState(false)
  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (isPending) {
      hasSubmitted.current = true
      setShowSuccess(false)
    }
  }, [isPending])

  useEffect(() => {
    if (hasSubmitted.current && !isPending && message === "success") {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isPending, message])

  return (
    <form action={formAction} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              name="first_name"
              type="text"
              defaultValue={customer.firstName ?? ""}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              data-testid="first-name-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              name="last_name"
              type="text"
              defaultValue={customer.lastName ?? ""}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              data-testid="last-name-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            defaultValue={customer.email}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            data-testid="email-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            defaultValue={customer.phone ?? ""}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            data-testid="phone-input"
          />
        </div>
      </div>

      {/* Feedback Messages */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-700">
            Profile updated successfully.
          </p>
        </div>
      )}

      {message && message !== "success" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{message}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <SubmitButton
          className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          data-testid="save-profile-button"
        >
          Save Changes
        </SubmitButton>
      </div>
    </form>
  )
}
