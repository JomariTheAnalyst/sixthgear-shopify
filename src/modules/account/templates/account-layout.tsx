"use client"

import React, { useState, useEffect } from "react"
import { ShopifyCustomer } from "@lib/shopify/types"
import AccountNav from "../components/account-nav"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { useParams } from "next/navigation"
import { EllipsisVertical, Headphones, MapPin, Package, User } from "lucide-react"

interface AccountLayoutProps {
  customer: ShopifyCustomer | null
  children: React.ReactNode
}

export default function AccountLayout({ customer, children }: AccountLayoutProps) {
  const [greeting, setGreeting] = useState("")
  const [isMobileAccountNavOpen, setIsMobileAccountNavOpen] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    if      (hour >= 5  && hour < 12) setGreeting("Good morning")
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon")
    else if (hour >= 17 && hour < 22) setGreeting("Good evening")
    else                               setGreeting("Good night")
  }, [])

  useEffect(() => {
    document.body.dataset.accountMobileNav = "true"

    return () => {
      delete document.body.dataset.accountMobileNav
    }
  }, [])

  const pathname    = usePathname()
  const params      = useParams()

  if (!customer) {
    return <>{children}</>
  }

  const bottomNavItems = [
    { label: "Orders",    href: "/account/orders",    icon: Package },
    { label: "Profile",   href: "/account/profile",   icon: User },
    { label: "Addresses", href: "/account/addresses", icon: MapPin },
    { label: "Support",   href: "mailto:support@sixthgearmoto.com", icon: Headphones, isExternal: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50" data-testid="account-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pb-10">

        {/* ── Page grid: sidebar + content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
          <AccountNav
            customer={customer}
            isMobileOpen={isMobileAccountNavOpen}
            onMobileOpenChange={setIsMobileAccountNavOpen}
            hideMobileTrigger
          />

          {/* ── Main content panel ── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 min-h-[520px]">
            {/* Greeting strip */}
            <div className="mb-6 border-b border-gray-100 pb-5">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileAccountNavOpen(true)}
                  className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center text-gray-500 transition-colors hover:text-gray-900 lg:hidden"
                  aria-label="Open account menu"
                >
                  <EllipsisVertical className="h-5 w-5" />
                </button>

                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {greeting}, {customer.firstName || "there"}!
                  </h1>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Welcome back to your account
                  </p>
                </div>
              </div>
            </div>

            {children}
          </section>
        </div>
      </div>

      {/* ── Mobile bottom nav (lg: hidden) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex items-stretch h-16 pb-[env(safe-area-inset-bottom,0px)]">
        {bottomNavItems.map(item => {
          const Icon   = item.icon
          const active = !item.isExternal && pathname.includes(item.href)

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-gray-400"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            )
          }

          return (
            <LocalizedClientLink
              key={item.label}
              href={item.href}
              className={[
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-gray-900" : "text-gray-400",
              ].join(" ")}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </LocalizedClientLink>
          )
        })}
      </nav>
    </div>
  )
}
