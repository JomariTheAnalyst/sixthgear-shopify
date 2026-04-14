"use client"

import type { ChangeEventHandler } from "react"
import { Eye, EyeOff } from "lucide-react"

type PasswordFieldProps = {
  label: string
  name: string
  show: boolean
  onToggle: () => void
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  defaultValue?: string
  dataTestId?: string
}

export default function PasswordField({
  label,
  name,
  show,
  onToggle,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  required,
  error,
  hint,
  defaultValue,
  dataTestId,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={onChange}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          data-testid={dataTestId}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {hint && <p className="mt-2 text-xs leading-relaxed text-gray-500">{hint}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
