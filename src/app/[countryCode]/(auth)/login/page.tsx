import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your SixthGear Moto account.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect: redirectTo } = await searchParams
  const customer = await retrieveCustomer().catch(() => null)

  if (customer) {
    redirect(redirectTo || "/account")
  }

  return <LoginTemplate />
}
