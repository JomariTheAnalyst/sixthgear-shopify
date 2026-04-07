"use client"

import Image from "next/image"

import ContactForm from "./components/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 mb-6 tracking-tight">
            Get in Touch with Us
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Have questions about our outdoor adventures or looking to plan your next thrilling getaway? We&apos;re here to help! Reach out for any inquiries, sizing assistance, or riding advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-[#F6F6F6] rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 tracking-tight max-w-sm">
              Have Questions? We&apos;re Just a Message Away!
            </h2>
            <p className="text-gray-500 mb-10 text-sm md:text-base max-w-md">
              Fill out the form below, and one of our team members will get back to you shortly.
            </p>

            <ContactForm />
          </div>

          <div className="flex flex-col gap-5">
            <div className="relative w-full h-[280px] lg:h-[340px] rounded-2xl overflow-hidden bg-black text-white shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2070&auto=format&fit=crop"
                alt="Expert Support"
                fill
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="font-semibold text-lg">SixthGear Moto</span>
                </div>
                <h3 className="text-3xl lg:text-[40px] font-semibold max-w-[320px] leading-[1.1] tracking-tight">
                  Our experts will always help you
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#e4ece9] rounded-xl p-5 flex items-center gap-5 transition-colors hover:bg-[#d6e3df]">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Email</p>
                  <p className="text-gray-600 text-sm">support@sixthgearmoto.com</p>
                </div>
              </div>

              <div className="bg-[#e4ece9] rounded-xl p-5 flex items-center gap-5 transition-colors hover:bg-[#d6e3df]">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Call</p>
                  <p className="text-gray-600 text-sm">+63 995 093 0157</p>
                </div>
              </div>

              <div className="bg-[#e4ece9] rounded-xl p-5 flex items-center gap-5 transition-colors hover:bg-[#d6e3df]">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Address</p>
                  <p className="text-gray-600 text-sm">3610 Bautista St, Makati City, Metro Manila</p>
                </div>
              </div>

              <div className="bg-[#e4ece9] rounded-xl p-5 flex items-center gap-5 transition-colors hover:bg-[#d6e3df]">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Working Hours</p>
                  <p className="text-gray-600 text-sm">Mon-Sat: 9:00 AM - 8:00 PM (PST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
