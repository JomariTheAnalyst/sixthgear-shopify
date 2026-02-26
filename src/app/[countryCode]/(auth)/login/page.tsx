import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Sixthgear account.",
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ redirect?: string }>
}) {
  const { countryCode } = await params
  const { redirect: redirectTo } = await searchParams
  const customer = await retrieveCustomer().catch(() => null)

  if (customer) {
    redirect(redirectTo || `/${countryCode}/account`)
  }

  return <LoginTemplate />
}
