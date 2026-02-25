"use client"

import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center font-semibold text-sm text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className || "h-10 px-5"}`}
      data-testid={dataTestId}
    >
      {pending ? "Saving…" : children}
    </button>
  )
}
