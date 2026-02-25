"use client"
import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { createTransferRequest } from "@lib/data/orders"
import { SubmitButton } from "@modules/common/components/submit-button"
import { CheckCircle2 as CheckCircleMiniSolid, XCircle as XCircleSolid } from "lucide-react"
import { useEffect, useState } from "react"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="grid sm:grid-cols-2 items-center gap-x-8 gap-y-4 w-full">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-lg text-neutral-950 font-semibold">
            Order transfers
          </h3>
          <span className="text-base-regular text-neutral-500">
            Can&apos;t find the order you are looking for?
            <br /> Connect an order to your account.
          </span>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-1 sm:items-end"
        >
          <div className="flex flex-col gap-y-2 w-full">
            <Input className="w-full" name="order_id" label="Order ID" />
            <SubmitButton
              className="w-fit whitespace-nowrap self-end"
            >
              Request transfer
            </SubmitButton>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <span className="text-base-regular text-rose-500 text-right">
          {state.error}
        </span>
      )}
      {showSuccess && (
        <div className="flex justify-between p-4 bg-neutral-50 shadow-borders-base w-full self-stretch items-center">
          <div className="flex gap-x-2 items-center">
            <CheckCircleMiniSolid className="w-4 h-4 text-emerald-500" />
            <div className="flex flex-col gap-y-1">
              <span className="text-medim-pl text-neutral-950">
                Transfer for order {state.order?.id} requested
              </span>
              <span className="text-base-regular text-neutral-600">
                Transfer request email sent to {state.order?.email}
              </span>
            </div>
          </div>
          <button
            className="h-fit bg-transparent"
            onClick={() => setShowSuccess(false)}
          >
            <XCircleSolid className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
      )}
    </div>
  )
}
