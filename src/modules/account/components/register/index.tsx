"use client"

import { useState, useEffect, useRef } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/common/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Turnstile, { TurnstileHandle } from "@modules/common/components/turnstile"
import { TURNSTILE_ERROR_MESSAGE } from "@lib/util/turnstile"


type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(signup, null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const hasSubmitted = useRef(false)
  const turnstileRef = useRef<TurnstileHandle>(null)
  const [tokenMissing, setTokenMissing] = useState(false)

  useEffect(() => {
    if (isPending) {
      hasSubmitted.current = true
    }
  }, [isPending])

  useEffect(() => {
    if (hasSubmitted.current && !isPending && message === null) {
      router.push("/account")
      router.refresh()
    }
    // A failed submit spent the token; get a fresh one for the retry.
    if (hasSubmitted.current && !isPending && message) {
      turnstileRef.current?.reset()
    }
  }, [isPending, message, router])

  // Preventing the submit event also stops the form action.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const ready = Boolean(turnstileRef.current?.getToken())
    setTokenMissing(!ready)
    if (!ready) event.preventDefault()
  }

  return (
    <div data-testid="register-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>

      <form className="space-y-5" action={formAction} onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              name="first_name"
              type="text"
              placeholder="First Name"
              autoComplete="given-name"
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
              placeholder="Last Name"
              autoComplete="family-name"
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
            placeholder="Email Address"
            autoComplete="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            data-testid="email-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              data-testid="password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Use at least 8 characters. For better security, use a mix of upper and lowercase letters, numbers, and symbols.
          </p>
        </div>

        <p className="text-xs text-gray-500">
          By creating an account, you agree to Sixthgear&apos;s{" "}
          <LocalizedClientLink
            href="/privacy"
            className="text-blue-600 hover:text-blue-700"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/terms"
            className="text-blue-600 hover:text-blue-700"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </p>

        <ErrorMessage
          error={tokenMissing ? TURNSTILE_ERROR_MESSAGE : message}
          data-testid="register-error"
        />

        <Turnstile ref={turnstileRef} />

        <SubmitButton
          className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          data-testid="register-button"
        >
          Create Account
        </SubmitButton>

      </form>
    </div>
  )
}

export default Register
