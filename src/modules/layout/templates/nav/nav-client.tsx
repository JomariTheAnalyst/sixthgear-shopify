"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { StoreRegion, HttpTypes } from "@medusajs/types"
import { ShopifyCustomer } from "@lib/shopify/types"
import { ServiceCategory } from "@lib/services-data"
import { useWishlistStore } from "@lib/wishlist-store"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import Logo from "@modules/layout/components/brand-logo"
import SearchBar from "@modules/layout/components/search-bar"
import ServicesDropdown from "@modules/layout/components/services-dropdown"
import MobileSearchButton from "@modules/search/components/mobile-search-button"
import MobileMenu from "./mobile-menu"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Shop", href: "/store" },
  { name: "Services", href: "/services", hasDropdown: true },
  { name: "First Gear Coffee", href: "/first-gear" },
  { name: "Contact", href: "/contact" },
]

interface NavClientProps {
  regions: StoreRegion[]
  cart: HttpTypes.StoreCart | null
  servicesData: ServiceCategory[]
  customer: ShopifyCustomer | null
  wishlistCount: number
}

const NavClient = ({
  regions,
  cart,
  servicesData,
  customer,
  wishlistCount,
}: NavClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const wishlistItems = useWishlistStore((state) => state.items)
  const wishlistHydrated = useWishlistStore((state) => state.hydrated)
  const hydrateWishlist = useWishlistStore((state) => state.hydrate)

  useEffect(() => {
    if (!wishlistHydrated) {
      hydrateWishlist()
    }
  }, [hydrateWishlist, wishlistHydrated])

  const displayWishlistCount = wishlistHydrated
    ? wishlistItems.length
    : wishlistCount

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsServicesOpen(false)
  }, [pathname])

  const getInitials = () => {
    if (!customer) return ""
    const first = customer.firstName?.charAt(0) || ""
    const last = customer.lastName?.charAt(0) || ""
    const initials = (first + last).toUpperCase()
    return initials || customer.email?.charAt(0).toUpperCase() || "U"
  }

  const textClasses = "text-gray-900 hover:text-[#F16D34]"

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
    setIsServicesOpen(true)
  }

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setIsServicesOpen(false), 200)
  }

  const handleDropdownClick = () => {
    setIsServicesOpen(false)
  }

  return (
    <>
        <header
          ref={headerRef}
          className={`relative mx-auto w-full border-b border-gray-100 bg-white transition-shadow duration-300 ${
            isScrolled ? "shadow-md" : ""
          }`}
        >
          <nav className="flex h-full w-full flex-col px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
            <div className="flex md:hidden items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <MobileMenu
                  regions={regions}
                  navLinks={navLinks}
                  servicesData={servicesData}
                />
                <MobileSearchButton />
              </div>

              <div className="flex-none justify-center px-1 z-10 transition-transform scale-90 sm:scale-100">
                <LocalizedClientLink
                  href="/"
                  className="flex items-center justify-center whitespace-nowrap"
                >
                  <Logo />
                </LocalizedClientLink>
              </div>

              <div className="flex items-center gap-2">
                <LocalizedClientLink
                  href={customer ? "/account" : "/login"}
                  className="hover:text-[#F16D34] transition-colors text-gray-900 p-1 sm:p-1.5 md:p-0 flex items-center"
                >
                  {customer ? (
                    <div className="w-[26px] h-[26px] md:w-8 md:h-8 rounded-full bg-[#F16D34] flex items-center justify-center text-white font-bold text-[10px] md:text-xs tracking-widest">
                      {getInitials()}
                    </div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-[22px] h-[22px] md:w-6 md:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  )}
                </LocalizedClientLink>

                <div className="hover:text-[#F16D34] transition-colors text-gray-900 p-1 sm:p-1.5 md:p-0 flex items-center">
                  <CartDropdown cart={cart} />
                </div>
              </div>
            </div>

            <div className="relative hidden md:grid grid-cols-[minmax(220px,1fr)_auto_minmax(220px,1fr)] items-center gap-6 py-4 border-b border-gray-100/50">
              <div className="justify-self-start">
                <SearchBar />
              </div>

              <div className="justify-self-center px-1 md:px-2 z-10 transition-transform scale-90 sm:scale-100">
                <LocalizedClientLink
                  href="/"
                  className="flex items-center justify-center whitespace-nowrap"
                >
                  <Logo />
                </LocalizedClientLink>
              </div>

              <div className="justify-self-end">
                <div className="flex items-center gap-4">
                  <LocalizedClientLink
                    href="/wishlist"
                    className="hover:text-[#F16D34] transition-colors text-gray-900 p-1 sm:p-1.5 md:p-0 relative flex items-center"
                    title="Wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-[22px] h-[22px] md:w-6 md:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                    {displayWishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-[18px] h-[18px] md:w-5 md:h-5 bg-[#F16D34] text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center">
                        {displayWishlistCount > 9 ? "9+" : displayWishlistCount}
                      </span>
                    )}
                  </LocalizedClientLink>

                  <LocalizedClientLink
                    href="/track-order"
                    className="hover:text-[#F16D34] transition-colors text-gray-900 p-1 sm:p-1.5 md:p-0 flex items-center"
                    title="Track Order"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-[22px] h-[22px] md:w-6 md:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                  </LocalizedClientLink>

                  <LocalizedClientLink
                    href={customer ? "/account" : "/login"}
                    className="hover:text-[#F16D34] transition-colors text-gray-900 p-1 sm:p-1.5 md:p-0 flex items-center"
                  >
                    {customer ? (
                      <div className="w-[26px] h-[26px] md:w-8 md:h-8 rounded-full bg-[#F16D34] flex items-center justify-center text-white font-bold text-[10px] md:text-xs tracking-widest">
                        {getInitials()}
                      </div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[22px] h-[22px] md:w-6 md:h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    )}
                  </LocalizedClientLink>

                  <div className="hover:text-[#F16D34] transition-colors text-gray-900 p-1 sm:p-1.5 md:p-0 flex items-center">
                    <CartDropdown cart={cart} />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center py-3">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li
                    key={link.name}
                    className="relative"
                    onMouseEnter={() =>
                      link.hasDropdown && handleServicesEnter()
                    }
                    onMouseLeave={() =>
                      link.hasDropdown && handleServicesLeave()
                    }
                  >
                    <LocalizedClientLink
                      href={link.href}
                      className={`relative px-2 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 group flex items-center gap-1 ${
                        link.hasDropdown && isServicesOpen
                          ? "text-[#F16D34]"
                          : textClasses
                      }`}
                    >
                      {link.name}
                      {link.hasDropdown && (
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isServicesOpen ? "rotate-180" : ""
                          }`}
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
                      )}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#F16D34] transition-all duration-300 group-hover:w-full`}
                      />
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>

      <div
        className={`fixed inset-x-0 z-[100] bg-white shadow-2xl border-t border-gray-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] transform ${
          isServicesOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
        style={{ top: headerRef.current?.getBoundingClientRect().bottom || 0 }}
        onMouseEnter={handleServicesEnter}
        onMouseLeave={handleServicesLeave}
        onClick={handleDropdownClick}
      >
        <ServicesDropdown servicesData={servicesData} />
      </div>
    </>
  )
}

export default NavClient
