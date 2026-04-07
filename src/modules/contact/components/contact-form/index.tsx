"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  CONTACT_SUBJECT_OPTIONS,
  contactFormSchema,
  ContactApiResponse,
  ContactFormInput,
  ContactFormValues,
} from "@lib/contact/schema"

const ORDER_SUPPORT_SUBJECT = "Order Support"

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

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
      message: "",
      companyWebsite: "",
    },
  })

  const selectedSubject = watch("subject")

  useEffect(() => {
    if (selectedSubject !== ORDER_SUPPORT_SUBJECT) {
      setValue("orderNumber", "")
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

      reset()
      setIsSubmitted(true)
      toast.success("Message sent", {
        description: data.message,
      })
    } catch (error) {
      console.error("[contact] Submit failed:", error)
      toast.error("Message not sent", {
        description: "Please try again later.",
      })
    }
  })

  if (isSubmitted) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Message Sent Successfully
        </h3>
        <p className="text-gray-600 mb-8">
          We&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="text-[#F16D34] font-medium hover:underline transition-all"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("companyWebsite")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">First Name</label>
          <input
            type="text"
            placeholder="First name"
            className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-1 focus:ring-black text-gray-900 placeholder-gray-300 shadow-sm transition-all"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Last Name</label>
          <input
            type="text"
            placeholder="Last name"
            className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-1 focus:ring-black text-gray-900 placeholder-gray-300 shadow-sm transition-all"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">E-mail</label>
        <input
          type="email"
          placeholder="you@gmail.com"
          className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-1 focus:ring-black text-gray-900 placeholder-gray-300 shadow-sm transition-all"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Phone Number</label>
        <input
          type="tel"
          placeholder="+63 917 123 4567"
          className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-1 focus:ring-black text-gray-900 placeholder-gray-300 shadow-sm transition-all"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Subject</label>
        <div className="relative">
          <select
            className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-1 focus:ring-black text-gray-900 shadow-sm appearance-none cursor-pointer transition-all"
            {...register("subject")}
          >
            {CONTACT_SUBJECT_OPTIONS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.subject && (
          <p className="text-red-500 text-xs">{errors.subject.message}</p>
        )}
      </div>

      {selectedSubject === ORDER_SUPPORT_SUBJECT && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Order Number</label>
          <input
            type="text"
            placeholder="SGM-12345"
            className="w-full h-12 px-4 rounded-lg border-none bg-white focus:ring-1 focus:ring-black text-gray-900 placeholder-gray-300 shadow-sm transition-all"
            {...register("orderNumber")}
          />
          {errors.orderNumber && (
            <p className="text-red-500 text-xs">{errors.orderNumber.message}</p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Message</label>
        <textarea
          rows={4}
          placeholder="Leave us a message..."
          className="w-full p-4 rounded-lg border-none bg-white focus:ring-1 focus:ring-black text-gray-900 placeholder-gray-300 resize-none shadow-sm transition-all"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-red-500 text-xs">{errors.message.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-3 bg-black hover:bg-[#F16D34] text-white px-8 h-14 rounded-full font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
          {!isSubmitting && (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 12h16m-7-7l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}
