"use client"

import Modal from "@modules/common/components/modal"

type ActionStatusModalProps = {
  isOpen: boolean
  onClose: () => void
  variant: "success" | "error"
  title: string
  description: string
}

export default function ActionStatusModal({
  isOpen,
  onClose,
  variant,
  title,
  description,
}: ActionStatusModalProps) {
  const isSuccess = variant === "success"

  return (
    <Modal isOpen={isOpen} close={onClose} size="small">
      <Modal.Title>{title}</Modal.Title>
      <Modal.Body>
        <div className="w-full pt-6">
          <div
            className={`rounded-2xl border p-5 ${
              isSuccess
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <p
              className={`text-sm leading-7 ${
                isSuccess ? "text-green-800" : "text-red-700"
              }`}
            >
              {description}
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-[#F16D34]"
            >
              Close
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
