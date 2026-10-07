"use client"

import { requestPasswordReset } from "@lib/data/customer"
import { useActionState } from "react"
import { useState, useEffect, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SubmitButton } from "@modules/common/components/submit-button"
import Turnstile, { TurnstileHandle } from "@modules/common/components/turnstile"
import { TURNSTILE_ERROR_MESSAGE } from "@lib/util/turnstile"
import { Mail } from "lucide-react"

export default function ForgotPasswordTemplate() {
  const [message, formAction, isPending] = useActionState(
    requestPasswordReset,
    null
  )
  const [showSuccess, setShowSuccess] = useState(false)
  const hasSubmitted = useRef(false)
  const turnstileRef = useRef<TurnstileHandle>(null)
  const [tokenMissing, setTokenMissing] = useState(false)

  useEffect(() => {
    if (isPending) {
      hasSubmitted.current = true
    }
  }, [isPending])

  useEffect(() => {
    if (hasSubmitted.current && !isPending && message === "success") {
      setShowSuccess(true)
    }
    // A failed submit spent the token; get a fresh one for the retry.
    if (hasSubmitted.current && !isPending && message && message !== "success") {
      turnstileRef.current?.reset()
    }
  }, [isPending, message])

  // Preventing the submit event also stops the form action.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const ready = Boolean(turnstileRef.current?.getToken())
    setTokenMissing(!ready)
    if (!ready) event.preventDefault()
  }

  const errorMessage = tokenMissing
    ? TURNSTILE_ERROR_MESSAGE
    : message !== "success"
      ? message
      : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        {showSuccess ? (
          <div className="border border-gray-200 rounded-xl p-8 text-center">
            <Mail className="w-10 h-10 text-[#0a0a0a] mx-auto mb-6" strokeWidth={1.5} />

            <h2 className="text-[22px] font-bold text-[#0a0a0a] mb-4">
              Check your inbox
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              If an account exists for this email, you will receive
              password reset instructions.
            </p>

            <p className="text-xs text-gray-500 leading-relaxed mb-2">
              Didn&apos;t receive the email? Check your spam folder
              or try again.
            </p>

            <p className="text-xs text-gray-400 mb-6">
              Need help? Contact us at noreply@sixthgearmoto.com
            </p>

            <div className="border-t border-gray-200 my-6" />

            <LocalizedClientLink
              href="/login"
              className="flex w-full items-center justify-center bg-[#0a0a0a] text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Sign In
            </LocalizedClientLink>
          </div>
        ) : (
          <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                data-testid="email-input"
              />
            </div>

            <Turnstile ref={turnstileRef} />

            <SubmitButton
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              data-testid="send-reset-button"
            >
              Send Reset Link
            </SubmitButton>

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
