"use client"

import Image from "next/image"

import { parkinsans } from "@lib/fonts"
import { ABOUT_TITLE } from "@modules/about/styles"
import CalBookingTrigger from "@modules/booking/components/cal-booking-trigger"

const BOOKING_VIDEO_URL =
  "https://res.cloudinary.com/djn9ubf6a/video/upload/q_auto,f_auto/2ND-VIDEO_tf9hw5.mp4"

const BOOKING_STEPS = [
  {
    number: "01",
    title: "Pick your preferred schedule",
    description:
      "Choose an available date and time that works best for your visit.",
  },
  {
    number: "02",
    title: "Tell us about your motorcycle",
    description:
      "Share your bike model and service concern so our team can prepare properly.",
  },
  {
    number: "03",
    title: "Check your confirmation",
    description:
      "Review your booking details, bring your ride in, and we’ll take care of the rest.",
  },
] as const

export default function ServicesBookingCta() {
  return (
    <section
      aria-labelledby="services-booking-cta-heading"
      className={`${parkinsans.className} relative isolate w-full overflow-hidden bg-white`}
    >
      <div className="relative z-0 w-full overflow-hidden bg-black">
        <video
          className="block h-auto w-full"
          src={BOOKING_VIDEO_URL}
          aria-label="Sixthgear motorcycle service workshop"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
        />

        <div className="pointer-events-none absolute inset-0 bg-black/50" />

        <div className="absolute inset-x-0 top-[40%] z-10 -translate-y-1/2 px-5 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-[980px] text-center text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75 sm:text-xs">
              Ready for what’s next
            </p>
            <h2
              id="services-booking-cta-heading"
              className={`${ABOUT_TITLE} mt-4 sm:mt-5`}
            >
              The road ahead feels better when your bike is ready for it.
            </h2>
            <p className="mx-auto mt-4 hidden max-w-[58ch] text-sm leading-6 text-white/75 sm:block sm:text-base sm:leading-7">
              Book a workshop visit and let Sixthgear handle the details before
              your next ride.
            </p>

            <CalBookingTrigger
              aria-label="Book a motorcycle service with Sixthgear"
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-[#F16D34] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-black transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:mt-7 sm:min-h-11 sm:px-8 sm:py-3 sm:text-xs"
            >
              Book Now
            </CalBookingTrigger>
          </div>
        </div>
      </div>

      <div className="relative z-0 -mt-[clamp(96px,12vw,230px)] overflow-hidden pb-16 pt-[clamp(150px,11vw,212px)] sm:pb-20 lg:min-h-[28.125vw] lg:pb-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-x-0 bottom-0 top-[28.125vw] bg-[#F15A38]" />
          <Image
            src="/images/69ae970776f4f1e7370b0408_Enroll Shape.png"
            alt=""
            width={1920}
            height={540}
            sizes="100vw"
            className="absolute inset-x-0 top-0 h-auto w-full"
          />
        </div>

        <ol className="relative grid w-full px-5 text-white sm:px-8 lg:px-12 xl:grid-cols-3 xl:items-start xl:gap-8 xl:px-0">
          {BOOKING_STEPS.map((step, index) => (
            <li
              key={step.number}
              className={`px-4 py-8 text-center sm:px-8 xl:py-0 ${
                index > 0 ? "border-t border-white/25 xl:border-t-0" : ""
              } ${
                index === 0
                ? "xl:translate-y-[112px]"
                : index === 1
                  ? "xl:translate-y-[56px]"
                  : ""
              }`}
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-[#F15A38] shadow-sm">
                {step.number}
              </span>
              <h3 className="mt-5 text-lg font-bold leading-tight tracking-[-0.02em] sm:text-xl">
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-[34ch] text-xs leading-5 text-white/85 sm:text-sm sm:leading-6">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
