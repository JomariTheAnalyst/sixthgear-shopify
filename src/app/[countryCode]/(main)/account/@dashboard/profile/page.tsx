import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import ProfileForm from "@modules/account/components/profile-form"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Sixthgear profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return (
    <div className="space-y-6" data-testid="profile-page-wrapper">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
            {customer.firstName?.charAt(0) || "U"}
            {customer.lastName?.charAt(0) || ""}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your personal information and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <ProfileForm customer={customer} />
    </div>
  )
}
