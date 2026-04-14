"use client"

import Modal from "@modules/common/components/modal"

type BookingSuccessData = {
  firstName: string
  email: string
  subject: string
  serviceTitle?: string
  preferredDate?: string
  preferredTime?: string
}

type BookingSuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  successData: BookingSuccessData | null
}

const SERVICE_BOOKING_SUBJECT = "Service Booking"

function formatPreferredDate(preferredDate?: string) {
  if (!preferredDate) {
    return "Not provided"
  }

  const parsedDate = new Date(`${preferredDate}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return preferredDate
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(parsedDate)
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  successData,
}: BookingSuccessModalProps) {
  if (!successData) {
    return null
  }

  const isServiceBooking = successData.subject === SERVICE_BOOKING_SUBJECT

  return (
    <Modal isOpen={isOpen} close={onClose} size="small">
      <Modal.Title>
        {isServiceBooking ? "Booking Request Received" : "Message Sent"}
      </Modal.Title>
      <Modal.Body>
        <div className="w-full pt-6">
          {isServiceBooking && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-semibold text-gray-900">Service</span>
                  <span className="text-right">
                    {successData.serviceTitle || "Service booking"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-semibold text-gray-900">Preferred Date</span>
                  <span className="text-right">
                    {formatPreferredDate(successData.preferredDate)}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-semibold text-gray-900">Preferred Time</span>
                  <span className="text-right">
                    {successData.preferredTime || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm leading-7 text-gray-600">
            {isServiceBooking
              ? `Thank you, ${successData.firstName}! Your booking request has been submitted. We will get back to you as soon as possible at ${successData.email}.`
              : `Thanks for reaching out, ${successData.firstName}! We will get back to you as soon as possible at ${successData.email}.`}
          </p>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-[#F16D34]"
            >
              {isServiceBooking ? "Got it, thanks!" : "Done"}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
