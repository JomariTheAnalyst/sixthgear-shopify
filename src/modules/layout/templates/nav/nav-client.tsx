"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { StoreRegion, HttpTypes } from "@medusajs/types"
import { ShopifyCustomer } from "@lib/shopify/types"
import { ServiceCategory } from "@lib/services-data"
import type { SanityBlogPostListItem } from "@lib/cms/types"
import { useWishlistStore } from "@lib/wishlist-store"
import { outfit } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLenis } from "@modules/common/components/lenis-provider"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import Logo from "@modules/layout/components/brand-logo"
import SearchBar from "@modules/layout/components/search-bar"
import ShopMegaMenu from "@modules/layout/components/shop-mega-menu"
import ServicesDropdown from "@modules/layout/components/services-dropdown"
import MobileSearchButton from "@modules/search/components/mobile-search-button"
import MobileMenu from "./mobile-menu"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Shop", href: "/store", hasShopMenu: true },
  { name: "Services", href: "/services", hasDropdown: true },
  { name: "Contact Us", href: "/contact" }
]

interface NavClientProps {
  regions: StoreRegion[]
  cart: HttpTypes.StoreCart | null
  servicesData: ServiceCategory[]
  clientStories: SanityBlogPostListItem[]
  customer: ShopifyCustomer | null
  wishlistCount: number
}

const NavClient = ({
  regions,
  cart,
  servicesData,
  clientStories,
  customer,
  wishlistCount,
}: NavClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  // The dropdown stays mounted while closed. Its story images load on the first
  // hover, focus or touchstart of the Services button, never on page load.
  const [loadServicesImages, setLoadServicesImages] = useState(false)
  const [dropdownTop, setDropdownTop] = useState(0)
  const shopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const shopTriggerRef = useRef<HTMLAnchorElement>(null)
  const pathname = usePathname()
  const wishlistItems = useWishlistStore((state) => state.items)
  const wishlistHydrated = useWishlistStore((state) => state.hydrated)
  const hydrateWishlist = useWishlistStore((state) => state.hydrate)
  const lenis = useLenis()

  useEffect(() => {
    if (!wishlistHydrated) {
      hydrateWishlist()
    }
  }, [hydrateWishlist, wishlistHydrated])

  const displayWishlistCount = wishlistHydrated
    ? wishlistItems.length
    : wishlistCount

  useEffect(() => {
    const updateScrolledState = (scrollPosition: number) => {
      setIsScrolled(scrollPosition > 50)
    }

    if (lenis) {
      updateScrolledState(lenis.scroll)

      const handleLenisScroll = (instance: typeof lenis) => {
        updateScrolledState(instance.scroll)
      }

      lenis.on("scroll", handleLenisScroll)
      return () => lenis.off("scroll", handleLenisScroll)
    }

    const handleNativeScroll = () => {
      updateScrolledState(window.scrollY)
    }

    handleNativeScroll()
    window.addEventListener("scroll", handleNativeScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleNativeScroll)
  }, [lenis])

  useEffect(() => {
    setIsShopOpen(false)
    setIsServicesOpen(false)
  }, [pathname])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const updateDropdownTop = () => {
      setDropdownTop(header.getBoundingClientRect().bottom)
    }

    updateDropdownTop()

    const resizeObserver = new ResizeObserver(updateDropdownTop)
    resizeObserver.observe(header)
    if (header.parentElement) resizeObserver.observe(header.parentElement)
    window.addEventListener("resize", updateDropdownTop)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateDropdownTop)
    }
  }, [])

  useEffect(() => {
    if (!isShopOpen && !isServicesOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return

      setIsShopOpen(false)
      setIsServicesOpen(false)
      if (isShopOpen) shopTriggerRef.current?.focus()
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isServicesOpen, isShopOpen])

  useEffect(
    () => () => {
      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current)
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
    },
    []
  )

  const getInitials = () => {
    if (!customer) return ""
    const first = customer.firstName?.charAt(0) || ""
    const last = customer.lastName?.charAt(0) || ""
    const initials = (first + last).toUpperCase()
    return initials || customer.email?.charAt(0).toUpperCase() || "U"
  }

  const textClasses = "text-gray-900 hover:text-[#F16D34]"

  const handleShopEnter = () => {
    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current)
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
    setIsServicesOpen(false)
    setIsShopOpen(true)
  }

  const handleShopLeave = () => {
    shopTimeoutRef.current = setTimeout(() => setIsShopOpen(false), 200)
  }

  const handleServicesEnter = () => {
    setLoadServicesImages(true)
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current)
    setIsShopOpen(false)
    setIsServicesOpen(true)
  }

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setIsServicesOpen(false), 200)
  }

  const handleDropdownClick = () => {
    setIsServicesOpen(false)
  }

  const handleShopNavigate = () => {
    setIsShopOpen(false)
  }

  return (
    <>
        <header
          ref={headerRef}
          className={`${outfit.className} relative mx-auto w-full border-b border-gray-200 bg-white transition-shadow duration-300 ${
            isScrolled ? "shadow-md" : ""
          }`}
        >
          <nav className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
            <div className="flex min-h-[68px] items-center justify-between lg:hidden">
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
                  <Logo variant="navbar" />
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

            <div className="relative hidden min-h-[74px] items-center justify-between lg:flex xl:min-h-[78px]">
              <ul className="flex min-w-0 items-center gap-3 xl:gap-5 2xl:gap-7">
                {navLinks.map((link) => {
                  const hasMenu = link.hasShopMenu || link.hasDropdown
                  const menuIsOpen = link.hasShopMenu
                    ? isShopOpen
                    : link.hasDropdown
                      ? isServicesOpen
                      : false

                  return (
                    <li
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => {
                        if (link.hasShopMenu) handleShopEnter()
                        else if (link.hasDropdown) handleServicesEnter()
                      }}
                      onMouseLeave={() => {
                        if (link.hasShopMenu) handleShopLeave()
                        else if (link.hasDropdown) handleServicesLeave()
                      }}
                    >
                      <LocalizedClientLink
                        ref={link.hasShopMenu ? shopTriggerRef : undefined}
                        href={link.href}
                        className={`group relative flex items-center gap-1 whitespace-nowrap py-3 text-[11px] font-semibold uppercase tracking-[0.055em] transition-colors duration-200 xl:text-xs 2xl:text-[13px] ${
                          menuIsOpen ? "text-[#F16D34]" : textClasses
                        }`}
                        onFocus={() => {
                          if (link.hasShopMenu) handleShopEnter()
                          else if (link.hasDropdown) handleServicesEnter()
                          else {
                            setIsShopOpen(false)
                            setIsServicesOpen(false)
                          }
                        }}
                        onTouchStart={
                          link.hasDropdown
                            ? () => setLoadServicesImages(true)
                            : undefined
                        }
                        onKeyDown={(event) => {
                          if (!link.hasShopMenu || event.key !== "ArrowDown") {
                            return
                          }

                          event.preventDefault()
                          handleShopEnter()
                          requestAnimationFrame(() => {
                            document
                              .querySelector<HTMLAnchorElement>(
                                "[data-shop-menu-card]"
                              )
                              ?.focus()
                          })
                        }}
                        aria-expanded={hasMenu ? menuIsOpen : undefined}
                        aria-controls={
                          link.hasShopMenu
                            ? "desktop-shop-menu"
                            : link.hasDropdown
                              ? "desktop-services-menu"
                              : undefined
                        }
                      >
                        {link.name}
                        {hasMenu ? (
                          <svg
                            className={`h-3 w-3 transition-transform duration-200 ${
                              menuIsOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        ) : null}
                        <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-[#F16D34] transition-all duration-300 group-hover:w-full" />
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <LocalizedClientLink
                  href="/"
                  className="pointer-events-auto flex items-center justify-center whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F16D34]"
                  aria-label="Sixthgear Moto home"
                >
                  <Logo variant="navbarCompact" />
                </LocalizedClientLink>
              </div>

              <div className="ml-6 flex shrink-0 items-center gap-0.5 xl:gap-1.5">
                <SearchBar />

                <LocalizedClientLink
                  href="/wishlist"
                  className="relative inline-flex h-10 w-10 items-center justify-center text-gray-900 transition-colors hover:text-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]"
                  title="Wishlist"
                  aria-label={`Wishlist${displayWishlistCount > 0 ? `, ${displayWishlistCount} items` : ""}`}
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
                  className="inline-flex h-10 w-10 items-center justify-center text-gray-900 transition-colors hover:text-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]"
                  title="Track Order"
                  aria-label="Track order"
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

                <div className="flex items-center">
                  <CartDropdown cart={cart} />
                </div>

                <LocalizedClientLink
                  href={customer ? "/account" : "/login"}
                  className="ml-1 inline-flex min-h-10 items-center justify-center bg-black px-4 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34] xl:ml-2 xl:px-5 xl:text-[13px]"
                >
                  {customer ? "Account" : "Login"}
                </LocalizedClientLink>
              </div>
            </div>
          </nav>
        </header>

      <div
        id="desktop-shop-menu"
        className={`fixed inset-x-0 z-[100] hidden overflow-y-auto border-y border-black/10 bg-white transition-[opacity,transform,visibility] duration-200 ease-out lg:block ${
          isShopOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0"
        }`}
        style={{
          top: dropdownTop,
          maxHeight: `calc(100vh - ${dropdownTop}px)`,
        }}
        onMouseEnter={handleShopEnter}
        onMouseLeave={handleShopLeave}
        onFocusCapture={handleShopEnter}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            handleShopLeave()
          }
        }}
      >
        <ShopMegaMenu onNavigate={handleShopNavigate} />
      </div>

      <div
        id="desktop-services-menu"
        className={`fixed inset-x-0 z-[100] bg-white shadow-2xl border-t border-gray-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] transform ${
          isServicesOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
        style={{ top: dropdownTop }}
        onMouseEnter={handleServicesEnter}
        onMouseLeave={handleServicesLeave}
        onClick={handleDropdownClick}
      >
        <ServicesDropdown
          servicesData={servicesData}
          clientStories={clientStories}
          showImages={loadServicesImages}
        />
      </div>
    </>
  )
}

export default NavClient
