"use client"

import { useEffect, useRef, useState } from "react"
import { useActionState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/common/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ACTIVATION_ERROR_MESSAGES: Record<string, string> = {
  activation_missing_url:
    "Activation link is missing details. Please request a new activation email.",
  activation_malformed_url:
    "Activation link is invalid. Please request a new activation email.",
  activation_expired:
    "This activation link has expired. Please request a new activation email.",
  activation_used:
    "This activation link was already used. Try signing in to your account.",
  already_activated:
    "Your account is already activated. Please sign in.",
  activation_failed:
    "We could not activate your account from that link. Please request a new activation email.",
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }
  const searchParams = useSearchParams()
  const hasSubmitted = useRef(false)
  const errorCode = searchParams.get("error")
  const activationError = errorCode
    ? ACTIVATION_ERROR_MESSAGES[errorCode]
    : null
  const redirectTo = searchParams.get("redirect") || "/account"

  useEffect(() => {
    if (isPending) {
      hasSubmitted.current = true
    }
  }, [isPending])

  useEffect(() => {
    if (hasSubmitted.current && !isPending && message === null) {
      router.push(redirectTo)
      router.refresh()
    }
  }, [isPending, message, redirectTo, router])

  return (
    <div data-testid="login-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="text-blue-600 hover:text-blue-700 font-medium"
            data-testid="register-button"
            type="button"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6" action={formAction}>
        <input type="hidden" name="country_code" value={countryCode} />
        <input
          type="hidden"
          name="redirect_to"
          value={searchParams.get("redirect") || ""}
        />

        {activationError && (
          <div
            className="bg-orange-50 border border-orange-200 rounded-xl p-4"
            data-testid="activation-error-message"
          >
            <p className="text-sm text-orange-700">{activationError}</p>
          </div>
        )}

        {/* Email */}
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              required
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
        </div>

        {/* Remember Me + Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span>Remember me</span>
          </label>
          <LocalizedClientLink
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </LocalizedClientLink>
        </div>

        <ErrorMessage
          error={message}
          data-testid="login-error-message"
        />

        {/* Submit */}
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Sign In
        </SubmitButton>

      </form>
    </div>
  )
}

export default Login
