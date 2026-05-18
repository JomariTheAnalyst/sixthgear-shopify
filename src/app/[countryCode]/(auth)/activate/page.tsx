import { Metadata } from "next"
import { redirect } from "next/navigation"
import { activateCustomerAccountByUrl } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Activate Account",
}

function redirectToLogin(countryCode: string, errorCode: string): never {
  const params = new URLSearchParams({ error: errorCode })
  return redirect(`/${countryCode}/login?${params.toString()}`)
}

export default async function ActivatePage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ url?: string }>
}) {
  const { countryCode } = await params
  const { url: rawUrl } = await searchParams

  if (!rawUrl || !rawUrl.trim()) {
    redirectToLogin(countryCode, "activation_missing_url")
  }

  let decodedUrl = ""
  try {
    decodedUrl = decodeURIComponent(rawUrl).trim()
  } catch {
    redirectToLogin(countryCode, "activation_malformed_url")
  }

  if (!decodedUrl || !decodedUrl.startsWith("https://")) {
    redirectToLogin(countryCode, "activation_malformed_url")
  }

  const result = await activateCustomerAccountByUrl(decodedUrl)

  if (result.success) {
    redirect(`/${countryCode}/account`)
  }

  redirectToLogin(countryCode, result.error || "activation_failed")
}
