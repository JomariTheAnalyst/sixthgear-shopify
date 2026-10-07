"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PasswordField from "@modules/account/components/password-field"

type ClientErrors = {
  password?: string
  confirm_password?: string
}

const passwordHint =
  "Use at least 8 characters. For better security, use a mix of upper and lowercase letters, numbers, and symbols."

export default function ResetPasswordTemplate() {
  const [message, setMessage] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [clientErrors, setClientErrors] = useState<ClientErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const resetUrl = searchParams.get("url")

  useEffect(() => {
    if (!resetUrl) {
      router.push("/forgot-password")
    }
  }, [resetUrl, router])

  useEffect(() => {
    if (!showSuccess) {
      return
    }

    const timer = setTimeout(() => {
      router.push("/account")
    }, 3000)

    return () => clearTimeout(timer)
  }, [showSuccess, router])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target

    if (clientErrors[name as keyof ClientErrors]) {
      setClientErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }

    if (message && message !== "success") {
      setMessage(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!resetUrl) {
      return
    }

    const formData = new FormData(event.currentTarget)
    const password = ((formData.get("password") as string) || "").trim()
    const confirmPassword = ((formData.get("confirm_password") as string) || "").trim()
    const errors: ClientErrors = {}

    setMessage(null)
    setShowSuccess(false)

    if (!password) {
      errors.password = "New password is required"
    } else if (password.length < 8) {
      errors.password = "New password must be at least 8 characters"
    }

    if (!confirmPassword) {
      errors.confirm_password = "Please confirm your new password"
    } else if (password !== confirmPassword) {
      errors.confirm_password = "Passwords do not match"
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors)
      return
    }

    setClientErrors({})
    setIsPending(true)
    const result = await resetPassword(null, formData)
    setIsPending(false)

    if (result === "success") {
      setShowSuccess(true)
      formRef.current?.reset()
      return
    }

    setMessage(result || "Password reset failed. Please try again.")
  }

  if (!resetUrl) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>

        {showSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Password Reset Successful
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. Redirecting to your account.
            </p>
            <LocalizedClientLink
              href="/account"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Go to Account
            </LocalizedClientLink>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{message}</p>
              </div>
            )}

            <input type="hidden" name="reset_url" value={resetUrl} />

            <PasswordField
              label="New Password"
              name="password"
              show={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              onChange={handleInputChange}
              autoComplete="new-password"
              required
              disabled={isPending}
              error={clientErrors.password}
              hint={passwordHint}
              dataTestId="password-input"
            />

            <PasswordField
              label="Confirm New Password"
              name="confirm_password"
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
              onChange={handleInputChange}
              autoComplete="new-password"
              required
              disabled={isPending}
              error={clientErrors.confirm_password}
              dataTestId="confirm-password-input"
            />

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="reset-password-button"
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </button>

            <div className="text-center">
              <LocalizedClientLink
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to Login
              </LocalizedClientLink>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
