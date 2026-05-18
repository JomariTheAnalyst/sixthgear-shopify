import { Metadata } from "next"
import { acceptTransferRequest } from "@lib/data/orders"
import TransferImage from "@modules/order/components/transfer-image"

export const metadata: Metadata = {
  title: "Order Transfer Accepted",
}

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  const { success, error } = await acceptTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <h1 className="text-xl text-zinc-900 font-semibold">
              Order transfered!
            </h1>
            <span className="text-zinc-600">
              Order {id} has been successfully transfered to the new owner.
            </span>
          </>
        )}
        {!success && (
          <>
            <span className="text-zinc-600">
              There was an error accepting the transfer. Please try again.
            </span>
            {error && (
              <span className="text-red-500">Error message: {error}</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
