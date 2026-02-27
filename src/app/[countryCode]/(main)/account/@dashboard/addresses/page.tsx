import { retrieveCustomer } from "@lib/data/customer"
import AddressesTemplate from "@modules/account/templates/addresses-template"

export default async function AddressesPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    return null
  }

  const addresses = customer.addresses?.edges?.map(({ node }) => node) || []
  const defaultAddressId = customer.defaultAddress?.id

  return (
    <AddressesTemplate
      addresses={addresses}
      defaultAddressId={defaultAddressId}
    />
  )
}
