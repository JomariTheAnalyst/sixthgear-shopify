import { Metadata } from "next"
import { redirect } from "next/navigation"
import { activateCustomerAccountByUrl } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Activate Account",
}

function redirectToLogin(errorCode: string): never {
  const params = new URLSearchParams({ error: errorCode })
  return redirect(`/login?${params.toString()}`)
}

export default async function ActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>
}) {
  const { url: rawUrl } = await searchParams

  if (!rawUrl || !rawUrl.trim()) {
    redirectToLogin("activation_missing_url")
  }

  let decodedUrl = ""
  try {
    decodedUrl = decodeURIComponent(rawUrl).trim()
  } catch {
    redirectToLogin("activation_malformed_url")
  }

  if (!decodedUrl || !decodedUrl.startsWith("https://")) {
    redirectToLogin("activation_malformed_url")
  }

  const result = await activateCustomerAccountByUrl(decodedUrl)

  if (result.success) {
    redirect("/account")
  }

  redirectToLogin(result.error || "activation_failed")
}
