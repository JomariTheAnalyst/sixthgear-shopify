import { retrieveCustomer } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"
import { getNoindexFollowRobots } from "@lib/seo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: getNoindexFollowRobots(),
}

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
    </AccountLayout>
  )
}
