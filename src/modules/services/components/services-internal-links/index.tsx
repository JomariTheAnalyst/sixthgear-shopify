"use client"

import Link from "next/link"

type ServicesInternalLinksProps = {
  countryCode: string
}

const links = [
  {
    href: "/services/preventive-maintenance",
    label: "Motorcycle PMS Makati",
    description:
      "Book preventive maintenance, oil change, and inspection at the Makati service center.",
  },
  {
    href: "/services/accessories-installation",
    label: "Big bike service center in Makati",
    description:
      "Explore accessories, fitment checks, and motorcycle exhaust installation in Makati.",
  },
]

export default function ServicesInternalLinks({
  countryCode,
}: ServicesInternalLinksProps) {
  return (
    <section className="bg-white pb-20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950 md:text-3xl">
            Popular Makati motorcycle services
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-gray-200 bg-gray-50 p-5 transition-colors hover:border-gray-900 hover:bg-white"
              >
                <h3 className="text-base font-bold text-gray-950">
                  {link.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
