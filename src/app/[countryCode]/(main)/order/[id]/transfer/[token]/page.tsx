import { Metadata } from "next"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export const metadata: Metadata = {
  title: "Order Transfer",
}

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <h1 className="text-xl text-zinc-900 font-semibold">
          Transfer request for order {id}
        </h1>
        <span className="text-zinc-600">
          You&#39;ve received a request to transfer ownership of your order ({id}).
          If you agree to this request, you can approve the transfer by clicking
          the button below.
        </span>
        <div className="w-full h-px bg-zinc-200" />
        <span className="text-zinc-600">
          If you accept, the new owner will take over all responsibilities and
          permissions associated with this order.
        </span>
        <span className="text-zinc-600">
          If you do not recognize this request or wish to retain ownership, no
          further action is required.
        </span>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
