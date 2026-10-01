import { Suspense } from "react"
import Image from "next/image"

import { businessInfo } from "@lib/business"
import { getAllServicesCMS } from "@lib/cms/client"
import type { ServiceOption } from "@lib/contact/schema"
import CalBookingTrigger from "@modules/booking/components/cal-booking-trigger"

import ContactForm from "./components/contact-form"

const FALLBACK_SERVICES: ServiceOption[] = [
  { slug: "preventive-maintenance", title: "Preventive Maintenance (PMS)" },
  { slug: "repairs-diagnostics", title: "Repairs & Diagnostics" },
  {
    slug: "accessories-installation",
    title: "Accessories & Custom Installation",
  },
  { slug: "wheels-drivetrain", title: "Wheels, Drivetrain & Handling" },
  { slug: "detailing-protection", title: "Detailing & Protection" },
  { slug: "performance-upgrades", title: "Performance Upgrades" },
  { slug: "roadside-assistance", title: "Roadside Assistance & Recovery" },
  { slug: "rider-support", title: "Rider Support & Convenience" },
]

export default async function ContactPage() {
  const cmsServices = await getAllServicesCMS()
  const services = cmsServices
    .filter((service) => Boolean(service.slug?.trim()) && Boolean(service.title?.trim()))
    .map((service) => ({
      slug: service.slug!.trim(),
      title: service.title!.trim(),
    }))
  const serviceOptions = services.length > 0 ? services : FALLBACK_SERVICES

  return (
    <div className="min-h-screen bg-white pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-[56px]">
            Get in Touch with Us
          </h1>
          <p className="text-base text-gray-600 md:text-lg">
            Contact SixthGearMoto for motorcycle parts, service center bookings,
            carwash support, coffee visits, and rider help from Makati for Metro
            Manila.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-2xl bg-[#F6F6F6] p-8 lg:p-12">
            <h2 className="mb-3 max-w-sm text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
              Need Workshop Support?
            </h2>
            <p className="mb-6 max-w-md text-sm text-gray-500 md:text-base">
              Send your motorcycle concern, parts question, preferred service,
              or visit details. Our team will help you plan the right next
              step.
            </p>
            <CalBookingTrigger className="mb-10 inline-flex h-12 items-center justify-center rounded-full border border-black px-6 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
              Book Service Online
            </CalBookingTrigger>

            <Suspense fallback={null}>
              <ContactForm services={serviceOptions} />
            </Suspense>
          </div>

          <div className="flex flex-col gap-5">
            <div className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-2xl bg-black text-white lg:h-[340px]">
              <Image
                src="/images/sixthgear-storefront-16x9.jpg"
                alt="Expert Support"
                fill
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute pt-[15rem] inset-0 flex flex-col justify-start p-8">
                <div className="flex items-center gap-3" />
                <h3 className="max-w-[320px] text-3xl font-semibold leading-[1.1] tracking-tight lg:text-[40px]">
                  Our experts will always help you
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-5 rounded-xl bg-[#e4ece9] p-5 transition-colors hover:bg-[#d6e3df]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                  <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{businessInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-xl bg-[#e4ece9] p-5 transition-colors hover:bg-[#d6e3df]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                  <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Call</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{businessInfo.phone}</p>
              </div>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-xl bg-[#e4ece9] p-5 transition-colors hover:bg-[#d6e3df]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                  <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">
                    {businessInfo.address.postalAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-xl bg-[#e4ece9] p-5 transition-colors hover:bg-[#d6e3df]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                  <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Working Hours</p>
                  <p className="text-sm text-gray-600">
                    {businessInfo.openingHoursText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
