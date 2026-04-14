"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useRef, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ActionStatusModal from "@modules/account/components/action-status-modal"
import PasswordField from "@modules/account/components/password-field"
import { changePassword } from "@lib/data/customer"

type ClientErrors = {
  old_password?: string
  new_password?: string
  confirm_password?: string
}

const passwordHint =
  "Use at least 8 characters. For better security, use a mix of upper and lowercase letters, numbers, and symbols."

export default function ProfilePassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [clientErrors, setClientErrors] = useState<ClientErrors>({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const clearState = () => {
    setClientErrors({})
  }

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
    clearState()

    const formData = new FormData(event.currentTarget)
    const oldPassword = (formData.get("old_password") as string) || ""
    const newPassword = (formData.get("new_password") as string) || ""
    const confirmPassword = (formData.get("confirm_password") as string) || ""

    const errors: ClientErrors = {}

    if (!oldPassword) {
      errors.old_password = "Current password is required"
    }

    if (!newPassword) {
      errors.new_password = "New password is required"
    } else if (newPassword.length < 8) {
      errors.new_password = "New password must be at least 8 characters"
    } else if (newPassword === oldPassword) {
      errors.new_password = "New password must be different from your current password"
    }

    if (!confirmPassword) {
      errors.confirm_password = "Please confirm your new password"
    } else if (newPassword !== confirmPassword) {
      errors.confirm_password = "Passwords do not match"
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors)
      return
    }

    setIsLoading(true)
    const result = await changePassword(oldPassword, newPassword, confirmPassword)
    setIsLoading(false)

    if (result.success) {
      formRef.current?.reset()
      setModalState({
        isOpen: true,
        variant: "success",
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
      return
    }

    setModalState({
      isOpen: true,
      variant: "error",
      title: "Password Update Failed",
      description:
        result.error || "Unable to update your password right now. Please try again.",
    })

    if (result.error?.toLowerCase().includes("incorrect")) {
      const oldPasswordInput = formRef.current?.elements.namedItem(
        "old_password"
      ) as HTMLInputElement | null

      if (oldPasswordInput) {
        oldPasswordInput.value = ""
      }
    }
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onReset={clearState}
        className="space-y-6"
        data-testid="account-password-editor"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            <p className="mt-1 text-sm text-gray-500">
              Change your password to keep your account secure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <PasswordField
                label="Current Password"
                name="old_password"
                show={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((prev) => !prev)}
                onChange={handleInputChange}
                autoComplete="current-password"
                disabled={isLoading}
                required
                error={clientErrors.old_password}
                dataTestId="old-password-input"
              />
            </div>

            <div>
              <PasswordField
                label="New Password"
                name="new_password"
                show={showNewPassword}
                onToggle={() => setShowNewPassword((prev) => !prev)}
                onChange={handleInputChange}
                autoComplete="new-password"
                disabled={isLoading}
                required
                error={clientErrors.new_password}
                hint={passwordHint}
                dataTestId="new-password-input"
              />
            </div>

            <div>
              <PasswordField
                label="Confirm New Password"
                name="confirm_password"
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
                onChange={handleInputChange}
                autoComplete="new-password"
                disabled={isLoading}
                required
                error={clientErrors.confirm_password}
                dataTestId="confirm-password-input"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <LocalizedClientLink
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Forgot your password? Reset it here
          </LocalizedClientLink>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Password"}
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
