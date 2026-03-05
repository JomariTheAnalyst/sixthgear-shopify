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
  { label: "My Orders",        icon: Package,    href: "/account/orders" },
  { label: "Profile",          icon: User,       href: "/account/profile" },
  { label: "Addresses",        icon: MapPin,     href: "/account/addresses" },
  { label: "Wishlist",         icon: Heart,      href: "/wishlist" },
  { label: "Payments",         icon: CreditCard, comingSoon: true },
  {
    label: "Customer Support",
    icon: Headphones,
    href: "/account/support",
  },
]

export default function AccountNav({ customer }: AccountNavProps) {
  const pathname  = usePathname()
  const params    = useParams()
  const countryCode = (params?.countryCode as string) ?? "ph"
  const [isLoggingOut, setIsLoggingOut]   = useState(false)
  const [isMobileOpen, setIsMobileOpen]   = useState(false)

  const isActive = (href: string) => {
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

  const initials =
    ((customer.firstName?.[0] ?? "") + (customer.lastName?.[0] ?? "")) || "U"

  const renderNavItem = (item: NavItem, onItemClick?: () => void) => {
    const Icon   = item.icon
    const active = item.href ? isActive(item.href) : false

    const baseClasses = [
      "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors duration-150",
      active
        ? "bg-gray-100 text-gray-900"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    ].join(" ")

    const content = (
      <>
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        <span className="flex-1">{item.label}</span>
        {item.comingSoon && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
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

  /* ------------------------------------------------------------------ */
  /* Shared sidebar body                                                  */
  /* ------------------------------------------------------------------ */
  const SidebarBody = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {/* User card */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-700 text-sm font-bold">
              {initials.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-gray-500 text-xs truncate mt-0.5">
              {customer.email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(item => renderNavItem(item, onItemClick))}
      </div>

      {/* Sign out */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50"
        >
          {isLoggingOut
            ? <Loader2 className="w-[18px] h-[18px] flex-shrink-0 animate-spin" />
            : <LogOut  className="w-[18px] h-[18px] flex-shrink-0" />
          }
          <span>{isLoggingOut ? "Signing out…" : "Sign Out"}</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex lg:flex-col w-[260px] flex-shrink-0 bg-white rounded-2xl border border-gray-200 sticky top-24 self-start overflow-hidden"
        style={{ maxHeight: "calc(100vh - 7rem)" }}
      >
        <SidebarBody />
      </aside>

      {/* ── Mobile: hamburger trigger ── */}
      <button
        className="lg:hidden fixed top-[5.5rem] right-4 z-50 w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open account menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile drawer ── */}
      {isMobileOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col border-r border-gray-200">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <span className="text-gray-900 text-sm font-semibold">My Account</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarBody onItemClick={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
