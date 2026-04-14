"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useRef, useState } from "react"
import { updateCustomer } from "@lib/data/customer"
import { ShopifyCustomer } from "@lib/shopify/types"
import ActionStatusModal from "@modules/account/components/action-status-modal"

type Props = {
  customer: ShopifyCustomer
}

type ClientErrors = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+()\-\s\d]{7,20}$/

export default function ProfileForm({ customer }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [clientErrors, setClientErrors] = useState<ClientErrors>({})
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    variant: "success" | "error"
    title: string
    description: string
  }>({
    isOpen: false,
    variant: "success",
    title: "",
    description: "",
  })
  const formRef = useRef<HTMLFormElement>(null)

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target

    if (clientErrors[name as keyof ClientErrors]) {
      setClientErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const firstName = ((formData.get("first_name") as string) || "").trim()
    const lastName = ((formData.get("last_name") as string) || "").trim()
    const email = ((formData.get("email") as string) || "").trim()
    const phone = ((formData.get("phone") as string) || "").trim()

    const errors: ClientErrors = {}

    if (!firstName) {
      errors.first_name = "First name is required"
    }

    if (!lastName) {
      errors.last_name = "Last name is required"
    }

    if (!email) {
      errors.email = "Email address is required"
    } else if (!emailPattern.test(email)) {
      errors.email = "Enter a valid email address"
    }

    if (phone && !phonePattern.test(phone)) {
      errors.phone = "Enter a valid phone number"
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors)
      return
    }

    setClientErrors({})
    setIsLoading(true)
    const result = await updateCustomer(null, formData)
    setIsLoading(false)

    if (result === "success") {
      setModalState({
        isOpen: true,
        variant: "success",
        title: "Profile Updated",
        description: "Your profile details have been updated successfully.",
      })
      return
    }

    setModalState({
      isOpen: true,
      variant: "error",
      title: "Update Failed",
      description: result || "We could not update your profile right now. Please try again.",
    })
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                data-testid="first-name-input"
              />
              {clientErrors.first_name && (
                <p className="mt-2 text-sm text-red-600">{clientErrors.first_name}</p>
              )}
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
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                data-testid="last-name-input"
              />
              {clientErrors.last_name && (
                <p className="mt-2 text-sm text-red-600">{clientErrors.last_name}</p>
              )}
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
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              data-testid="email-input"
            />
            {clientErrors.email && (
              <p className="mt-2 text-sm text-red-600">{clientErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={customer.phone ?? ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              data-testid="phone-input"
            />
            <p className="mt-2 text-xs text-gray-500">
              Optional. Include country code if needed.
            </p>
            {clientErrors.phone && (
              <p className="mt-2 text-sm text-red-600">{clientErrors.phone}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="save-profile-button"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <ActionStatusModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        variant={modalState.variant}
        title={modalState.title}
        description={modalState.description}
      />
    </>
  )
}
