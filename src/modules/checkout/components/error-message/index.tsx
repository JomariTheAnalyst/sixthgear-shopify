type ErrorMessageProps = {
  error?: string | null | false
  className?: string
  [key: string]: unknown
}

export default function ErrorMessage({
  error,
  className = "",
  ...props
}: ErrorMessageProps) {
  if (!error) {
    return null
  }

  return (
    <p
      className={`mt-2 text-sm font-medium text-red-600 ${className}`}
      role="alert"
      {...props}
    >
      {error}
    </p>
  )
}
