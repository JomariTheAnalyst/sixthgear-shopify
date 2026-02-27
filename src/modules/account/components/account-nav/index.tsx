"use client"

import { usePathname } from "next/navigation"
import { useParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  Package, User, MapPin, Heart, CreditCard,
  Headphones, LogOut, Loader2, X, Menu
} from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signout } from "@lib/data/customer"
import { ShopifyCustomer } from "@lib/shopify/types"

interface AccountNavProps {
  customer: ShopifyCustomer
}

type NavItem = {
  label: string
  icon: React.ElementType
  href?: string
  comingSoon?: boolean
  isExternal?: boolean
  externalHref?: string
}

const navItems: NavItem[] = [
  {
    label: "My Orders",
    icon: Package,
    href: "/account/orders",
  },
  {
    label: "Profile",
    icon: User,
    href: "/account/profile",
  },
  {
    label: "Addresses",
    icon: MapPin,
    href: "/account/addresses",
  },
  {
    label: "Wishlist",
    icon: Heart,
    comingSoon: true,
  },
  {
    label: "Payments",
    icon: CreditCard,
    comingSoon: true,
  },
  {
    label: "Customer Support",
    icon: Headphones,
    isExternal: true,
    externalHref: "mailto:support@sixthgearmoto.com",
  },
]

export default function AccountNav({ customer }: AccountNavProps) {
  const pathname = usePathname()
  const params = useParams()
  const countryCode = (params?.countryCode as string) ?? "ph"
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href: string) => {
    // Dashboard root: exact match only
    if (href === "/account" || href === "/account/") {
      return pathname.endsWith("/account") || pathname.endsWith("/account/")
    }
    return pathname.includes(href)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signout(countryCode)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const renderNavItem = (item: NavItem, onItemClick?: () => void) => {
    const Icon = item.icon
    const active = item.href ? isActive(item.href) : false

    const baseClasses = [
      "flex items-center gap-3 w-full px-3 py-2.5",
      "rounded-lg text-sm font-medium transition-colors duration-150",
      "text-left cursor-pointer",
      active
        ? "bg-orange-500/10 text-orange-500"
        : "text-gray-400 hover:bg-white/5 hover:text-white",
    ].join(" ")

    const content = (
      <>
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1">{item.label}</span>
        {item.comingSoon && (
          <span className={[
            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
            "bg-orange-500/10 text-orange-500 border border-orange-500/20",
          ].join(" ")!}>
            Soon
          </span>
        )}
      </>
    )

    if (item.comingSoon) {
      return (
        <button
          key={item.label}
          className={baseClasses}
          onClick={() => {
            toast(`${item.label} coming soon!`, {
              description: "We're working on it. Stay tuned.",
            })
            onItemClick?.()
          }}
        >
          {content}
        </button>
      )
    }

    if (item.isExternal) {
      return (
        <a
          key={item.label}
          href={item.externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          onClick={() => onItemClick?.()}
        >
          {content}
        </a>
      )
    }

    return (
      <LocalizedClientLink
        key={item.label}
        href={item.href!}
        className={baseClasses}
        onClick={() => onItemClick?.()}
      >
        {content}
      </LocalizedClientLink>
    )
  }

  const initials = ((customer.firstName?.[0] ?? "") + (customer.lastName?.[0] ?? "")) || "U"

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 bg-[#0a0a0a] rounded-xl sticky top-24 self-start overflow-hidden border border-white/5" style={{ maxHeight: "calc(100vh - 7rem)" }}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {initials.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-gray-400 text-xs truncate mt-0.5">
                {customer.email}
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase px-3 mb-2 mt-4">
          Account
        </p>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map(item => renderNavItem(item))}
        </div>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors duration-150 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile trigger button */}
      <button
        className="lg:hidden fixed top-[5.5rem] right-4 z-50 w-10 h-10 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] flex flex-col overflow-y-auto border-r border-white/5">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white text-sm font-semibold">
                My Account
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {initials.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-gray-400 text-xs truncate mt-0.5">
                    {customer.email}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase px-3 mb-2 mt-4">
              Account
            </p>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
              {navItems.map(item => renderNavItem(item, () => setIsMobileOpen(false)))}
            </div>

            <div className="p-3 border-t border-white/10">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors duration-150 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
