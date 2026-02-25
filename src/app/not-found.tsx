import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="text-base text-gray-600">
        The page you tried to access does not exist.
      </p>
      <Link
        className="flex gap-x-2 items-center group text-blue-600 hover:text-blue-700"
        href="/"
      >
        <span>Go to frontpage</span>
        <svg
          className="w-4 h-4 group-hover:rotate-45 transition-transform duration-150"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 17L17 7M17 7H7M17 7V17"
          />
        </svg>
      </Link>
    </div>
  )
}
