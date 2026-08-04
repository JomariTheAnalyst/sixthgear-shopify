"use client"

import { useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { StoreRegion } from "@medusajs/types"
import CalBookingTrigger from "@modules/booking/components/cal-booking-trigger"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Logo from "@modules/layout/components/brand-logo"
import { ServiceCategory } from "@lib/services-data"

type MobileMenuProps = {
  regions: StoreRegion[]
  navLinks: { name: string; href: string; hasDropdown?: boolean }[]
  servicesData: ServiceCategory[]
}

export default function MobileMenu({
  regions,
  navLinks,
  servicesData,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isServicesExpanded, setIsServicesExpanded] = useState(false)

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Menu Toggle Button - Hamburger Icon */}
      <button
        onClick={openMenu}
        className="md:hidden p-2 text-gray-900 hover:text-[#F16D34] transition-colors duration-200"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Mobile Menu Drawer - Slides from LEFT */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={closeMenu} className="relative z-[100]">
          {/* Backdrop */}
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

          {/* Drawer Panel - FROM LEFT */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header with Close Button and Centered Logo */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                  {/* Close Button (X) on the left */}
                  <button
                    onClick={closeMenu}
                    className="p-2 text-gray-900 hover:text-[#F16D34] transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>

                  {/* Centered Logo */}
                  <Dialog.Title className="flex-1 flex justify-center">
                    <LocalizedClientLink href="/" onClick={closeMenu}>
                      <Logo variant="navbar" />
                    </LocalizedClientLink>
                  </Dialog.Title>

                  {/* Empty space for balance */}
                  <div className="w-10"></div>
                </div>

                {/* Navigation Links */}
                <nav
                  data-lenis-prevent
                  className="flex-1 px-4 py-6 overflow-y-auto"
                >
                  <ul className="space-y-2">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        {link.hasDropdown ? (
                          <div>
                            {/* Services with Plus Icon */}
                            <button
                              onClick={() =>
                                setIsServicesExpanded(!isServicesExpanded)
                              }
                              className="flex items-center justify-between w-full px-4 py-3 text-base font-bold uppercase tracking-wider text-gray-900 hover:text-[#F16D34] transition-colors duration-200"
                            >
                              <span>{link.name}</span>
                              {/* Plus/Minus Icon */}
                              <svg
                                className="w-5 h-5 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                              >
                                {isServicesExpanded ? (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14"
                                  />
                                ) : (
                                  <>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 5v14M5 12h14"
                                    />
                                  </>
                                )}
                              </svg>
                            </button>

                            {/* Expandable Services List - Using CMS data */}
                            {isServicesExpanded && (
                              <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-100 pl-4 animate-in slide-in-from-top-2 duration-200">
                                {servicesData.map((service) => (
                                  <LocalizedClientLink
                                    key={service.id}
                                    href={`/services/${service.slug}`}
                                    onClick={closeMenu}
                                    className="block px-3 py-2 text-sm text-gray-700 hover:text-[#F16D34] hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                  >
                                    {service.title}
                                  </LocalizedClientLink>
                                ))}
                                {/* View All Services Button */}
                                <LocalizedClientLink
                                  href="/services"
                                  onClick={closeMenu}
                                  className="flex items-center justify-center gap-2 mt-3 px-4 py-2.5 text-sm font-bold text-white bg-[#F16D34] hover:bg-[#fca311] rounded-lg transition-colors duration-200"
                                >
                                  <span>VIEW ALL SERVICES</span>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                  </svg>
                                </LocalizedClientLink>
                                <CalBookingTrigger
                                  beforeOpen={closeMenu}
                                  className="mt-2 flex items-center justify-center rounded-lg border border-[#F16D34] px-4 py-2.5 text-sm font-bold text-[#F16D34] transition-colors duration-200 hover:bg-[#F16D34] hover:text-white"
                                >
                                  Book Service
                                </CalBookingTrigger>
                              </div>
                            )}
                          </div>
                        ) : (
                          <LocalizedClientLink
                            href={link.href}
                            onClick={closeMenu}
                            className="flex items-center px-4 py-3 text-base font-bold uppercase tracking-wider text-gray-900 hover:text-[#F16D34] transition-colors duration-200"
                          >
                            {link.name}
                          </LocalizedClientLink>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="space-y-2">
                      <LocalizedClientLink
                        href="/wishlist"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-900 hover:text-[#F16D34] transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                        <span>Wishlist</span>
                      </LocalizedClientLink>

                      <LocalizedClientLink
                        href="/track-order"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-900 hover:text-[#F16D34] transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                          />
                        </svg>
                        <span>Track Order</span>
                      </LocalizedClientLink>
                    </div>
                  </div>
                </nav>

                {/* Footer - Optional */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    © {new Date().getFullYear()} Sixthgear
                  </p>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
