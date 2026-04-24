"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Clock3, ExternalLink, MapPin, Phone, Store, X } from "lucide-react"

import { inter, montserrat } from "@lib/fonts"
import {
  storeDirectionsUrl,
  storeInfo,
  storeMapEmbedUrl,
} from "@lib/store-info"

type StoreInfoDrawerProps = {
  open: boolean
  onClose: () => void
}

export default function StoreInfoDrawer({
  open,
  onClose,
}: StoreInfoDrawerProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[110]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-8 sm:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-[460px] bg-white shadow-2xl">
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
                      <div className="pr-4">
                        <Dialog.Title
                          className={`${montserrat.className} text-lg font-bold uppercase tracking-[0.02em] text-gray-950`}
                        >
                          Store Information
                        </Dialog.Title>
                        <p className="mt-1 text-sm text-gray-500">
                          Pickup location details and map
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Close store information"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <div className="border-b border-gray-200">
                        <iframe
                          src={storeMapEmbedUrl}
                          title="Sixth Gear Moto Supply map"
                          className="h-[240px] w-full sm:h-[280px]"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>

                      <div className="space-y-6 px-5 py-6 sm:px-6">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm">
                              <Store className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold uppercase tracking-[0.06em] text-gray-500">
                                Store
                              </p>
                              <h3 className="mt-1 text-lg font-semibold text-gray-950">
                                {storeInfo.shortName}
                              </h3>
                              <p className="mt-1 text-sm leading-6 text-gray-600">
                                {storeInfo.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F16D34]" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                Address
                              </p>
                              <p
                                className={`${inter.className} mt-1 text-sm leading-6 text-gray-600`}
                              >
                                {storeInfo.address}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F16D34]" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                Contact
                              </p>
                              <a
                                href={`tel:${storeInfo.phone.replace(/\s+/g, "")}`}
                                className={`${inter.className} mt-1 inline-block text-sm leading-6 text-gray-600 transition-colors hover:text-gray-950`}
                              >
                                {storeInfo.phone}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F16D34]" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                Store Hours
                              </p>
                              <p
                                className={`${inter.className} mt-1 text-sm leading-6 text-gray-600`}
                              >
                                {storeInfo.hours}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-5 py-4 sm:px-6">
                      <a
                        href={storeDirectionsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                      >
                        Open in Maps
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
