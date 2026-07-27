"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { openCalPopup } from "@modules/booking/lib/cal-embed"
import BookingSuccessModal from "../booking-success-modal"
import {
  CONTACT_SUBJECT_OPTIONS,
  contactFormSchema,
  ContactApiResponse,
  ContactFormInput,
  ContactFormValues,
  ServiceOption,
} from "@lib/contact/schema"

const ORDER_SUPPORT_SUBJECT = "Order Support"
const SERVICE_BOOKING_SUBJECT = "Service Booking"
const SERVICE_BOOKING_TIME_OPTIONS = [
  "Morning (9:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 5:00 PM)",
  "Evening (5:00 PM - 8:00 PM)",
] as const

type ContactFormProps = {
  services: ServiceOption[]
}

type SuccessData = {
  firstName: string
  email: string
  subject: ContactFormValues["subject"]
  serviceTitle?: string
  preferredDate?: string
  preferredTime?: string
}

export default function ContactForm({ services }: ContactFormProps) {
  const searchParams = useSearchParams()
  const hasPrefilledSubject = useRef(false)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      orderNumber: "",
      serviceType: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
      companyWebsite: "",
    },
  })

  const selectedSubject = watch("subject")
  const today = new Date().toISOString().split("T")[0] || ""

  useEffect(() => {
    if (hasPrefilledSubject.current) {
      return
    }

    hasPrefilledSubject.current = true

    if (searchParams.get("subject") === SERVICE_BOOKING_SUBJECT) {
      setValue("subject", SERVICE_BOOKING_SUBJECT)
    }
  }, [searchParams, setValue])

  useEffect(() => {
    if (selectedSubject !== ORDER_SUPPORT_SUBJECT) {
      setValue("orderNumber", "")
    }
  }, [selectedSubject, setValue])

  useEffect(() => {
    if (selectedSubject !== SERVICE_BOOKING_SUBJECT) {
      setValue("serviceType", "")
      setValue("preferredDate", "")
      setValue("preferredTime", "")
    }
  }, [selectedSubject, setValue])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = (await response.json()) as ContactApiResponse

      if (!response.ok) {
        if (data.fieldErrors) {
          for (const [field, message] of Object.entries(data.fieldErrors)) {
            if (!message) continue
            setError(field as keyof ContactFormValues, {
              type: "server",
              message,
            })
          }
        }

        toast.error("Message not sent", {
          description: data.message,
        })
        return
      }

      const serviceTitle = services.find(
        (service) => service.slug === values.serviceType
      )?.title

      reset()
      setSuccessData({
        firstName: values.firstName,
        email: values.email,
        subject: values.subject,
        serviceTitle,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
      })
      toast.success("Message sent", {
        description: data.message,
      })
    } catch (error) {
      console.error(error)
      toast.error("Message not sent", {
        description: "Please try again later.",
      })
    }
  })

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register("companyWebsite")}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">First Name</label>
            <input
              type="text"
              placeholder="First name"
              className="h-12 w-full rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all placeholder-gray-300 focus:ring-1 focus:ring-black"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              className="h-12 w-full rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all placeholder-gray-300 focus:ring-1 focus:ring-black"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">E-mail</label>
          <input
            type="email"
            placeholder="you@gmail.com"
            className="h-12 w-full rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all placeholder-gray-300 focus:ring-1 focus:ring-black"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Phone Number</label>
          <input
            type="tel"
            placeholder="+63 917 123 4567"
            className="h-12 w-full rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all placeholder-gray-300 focus:ring-1 focus:ring-black"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Subject</label>
          <div className="relative">
            <select
              className="h-12 w-full cursor-pointer appearance-none rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all focus:ring-1 focus:ring-black"
              {...register("subject", {
                onChange: (event) => {
                  if (event.target.value === SERVICE_BOOKING_SUBJECT) {
                    openCalPopup().catch(() => undefined)
                  }
                },
              })}
            >
              {CONTACT_SUBJECT_OPTIONS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.subject && (
            <p className="text-xs text-red-500">{errors.subject.message}</p>
          )}
        </div>

        {selectedSubject === SERVICE_BOOKING_SUBJECT && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Service Type</label>
              <div className="relative">
                <select
                  className="h-12 w-full cursor-pointer appearance-none rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all focus:ring-1 focus:ring-black"
                  {...register("serviceType")}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.serviceType && (
                <p className="text-xs text-red-500">{errors.serviceType.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Preferred Date</label>
              <input
                type="date"
                min={today}
                className="h-12 w-full rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all focus:ring-1 focus:ring-black"
                {...register("preferredDate")}
              />
              {errors.preferredDate && (
                <p className="text-xs text-red-500">{errors.preferredDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Preferred Time</label>
              <div className="relative">
                <select
                  className="h-12 w-full cursor-pointer appearance-none rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all focus:ring-1 focus:ring-black"
                  {...register("preferredTime")}
                >
                  <option value="">Select a time window</option>
                  {SERVICE_BOOKING_TIME_OPTIONS.map((timeOption) => (
                    <option key={timeOption} value={timeOption}>
                      {timeOption}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.preferredTime && (
                <p className="text-xs text-red-500">{errors.preferredTime.message}</p>
              )}
            </div>
          </>
        )}

        {selectedSubject === ORDER_SUPPORT_SUBJECT && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Order Number</label>
            <input
              type="text"
              placeholder="SGM-12345"
              className="h-12 w-full rounded-lg border-none bg-white px-4 text-gray-900 shadow-sm transition-all placeholder-gray-300 focus:ring-1 focus:ring-black"
              {...register("orderNumber")}
            />
            {errors.orderNumber && (
              <p className="text-xs text-red-500">{errors.orderNumber.message}</p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Message</label>
          <textarea
            rows={4}
            placeholder="Leave us a message..."
            className="w-full resize-none rounded-lg border-none bg-white p-4 text-gray-900 shadow-sm transition-all placeholder-gray-300 focus:ring-1 focus:ring-black"
            {...register("message")}
          />
          {errors.message && (
            <p className="text-xs text-red-500">{errors.message.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-14 items-center gap-3 rounded-full bg-black px-8 font-semibold text-white shadow-md transition-all hover:bg-[#F16D34] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            {!isSubmitting && (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 12h16m-7-7l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      <BookingSuccessModal
        isOpen={Boolean(successData)}
        onClose={() => setSuccessData(null)}
        successData={successData}
      />
    </>
  )
}
