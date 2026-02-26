"use client"

import { resetPassword } from "@lib/data/customer"
import { useActionState } from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SubmitButton } from "@modules/common/components/submit-button"

export default function ResetPasswordTemplate() {
  const [message, formAction, isPending] = useActionState(resetPassword, null)
  const [showSuccess, setShowSuccess] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }
  const hasSubmitted = useRef(false)
  const resetUrl = searchParams.get("url")

  useEffect(() => {
    if (!resetUrl) {
      router.push(`/${countryCode}/forgot-password`)
    }
  }, [resetUrl, router, countryCode])

  useEffect(() => {
    if (isPending) {
      hasSubmitted.current = true
    }
  }, [isPending])

  useEffect(() => {
    if (hasSubmitted.current && !isPending && message === "success") {
      setShowSuccess(true)
      // Auto-redirect to account after 3 seconds
      const timer = setTimeout(() => {
        router.push(`/${countryCode}/account`)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isPending, message, router, countryCode])

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
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. Redirecting to your
              account...
            </p>
            <LocalizedClientLink
              href="/account"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Go to Account
            </LocalizedClientLink>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            {message && message !== "success" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{message}</p>
              </div>
            )}

            <input type="hidden" name="reset_url" value={resetUrl} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="New Password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                data-testid="password-input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                name="confirm_password"
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                data-testid="confirm-password-input"
              />
            </div>

            <SubmitButton
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              data-testid="reset-password-button"
            >
              Reset Password
            </SubmitButton>

            <div className="text-center">
              <LocalizedClientLink
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Login
              </LocalizedClientLink>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
