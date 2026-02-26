import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { ShopifyMailingAddress } from "@lib/shopify/types"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  const addresses = customer.addresses?.edges?.map((e) => e.node) || []
  const defaultAddressId = customer.defaultAddress?.id

  return (
    <div className="space-y-6" data-testid="addresses-page-wrapper">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Shipping Addresses
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Manage your delivery addresses for faster checkout
            </p>
          </div>
        </div>
      </div>

      {/* Address Cards */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={address.id === defaultAddressId}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
          </div>
          <h3 className="text-gray-900 font-medium mb-1">No addresses saved</h3>
          <p className="text-gray-500 text-sm">
            Your saved addresses will appear here after your first checkout.
          </p>
        </div>
      )}

      {/* TODO: Add address management controls once mutations are implemented */}
    </div>
  )
}

function AddressCard({
  address,
  isDefault,
}: {
  address: ShopifyMailingAddress
  isDefault: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 relative">
      {isDefault && (
        <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
          Default
        </span>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-900">
          {address.firstName} {address.lastName}
        </p>
        {address.address1 && (
          <p className="text-sm text-gray-600">{address.address1}</p>
        )}
        {address.address2 && (
          <p className="text-sm text-gray-600">{address.address2}</p>
        )}
        <p className="text-sm text-gray-600">
          {[address.city, address.province, address.zip]
            .filter(Boolean)
            .join(", ")}
        </p>
        {address.country && (
          <p className="text-sm text-gray-600">{address.country}</p>
        )}
        {address.phone && (
          <p className="text-sm text-gray-500 mt-2">{address.phone}</p>
        )}
      </div>
    </div>
  )
}
