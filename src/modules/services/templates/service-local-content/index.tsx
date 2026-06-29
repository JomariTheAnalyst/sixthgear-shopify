"use client"

import { inter, poppins } from "@lib/fonts"
import { ServiceCategory } from "@lib/services-data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ServiceLocalContentProps = {
  service: ServiceCategory
}

function hasVisibleLocalContent(service: ServiceCategory) {
  return Boolean(
    service.localContent?.length ||
      service.internalLinks?.length ||
      service.faqItems?.length
  )
}

export default function ServiceLocalContent({
  service,
}: ServiceLocalContentProps) {
  if (!hasVisibleLocalContent(service)) {
    return null
  }

  return (
    <section className="bg-[#f7f7f4] py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div>
            <p
              className={`${inter.className} mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500 md:text-xs`}
            >
              Makati Service Center
            </p>
            <h2
              className={`${poppins.className} max-w-4xl text-3xl font-bold leading-tight tracking-[-0.04em] text-black md:text-5xl`}
            >
              Local service support for {service.shortTitle || service.title}
            </h2>

            {service.localContent && service.localContent.length > 0 && (
              <div className="mt-8 grid gap-5">
                {service.localContent.map((section) => (
                  <article
                    key={section.heading}
                    className="border-t border-black/10 pt-5"
                  >
                    <h3 className="text-lg font-bold text-gray-950 md:text-xl">
                      {section.heading}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-700 md:text-base">
                      {section.body}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {service.internalLinks && service.internalLinks.length > 0 && (
              <div className="bg-white p-6">
                <h3 className="text-base font-bold text-gray-950">
                  Helpful links
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  {service.internalLinks.map((link) => (
                    <LocalizedClientLink
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      className="text-sm font-semibold text-[#FF5000] underline-offset-4 transition-colors hover:text-black hover:underline"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  ))}
                </div>
              </div>
            )}

            {service.faqItems && service.faqItems.length > 0 && (
              <div className="bg-white p-6">
                <h3 className="text-base font-bold text-gray-950">
                  Frequently asked questions
                </h3>
                <div className="mt-4 divide-y divide-gray-100">
                  {service.faqItems.map((item) => (
                    <article key={item.question} className="py-4 first:pt-0">
                      <h4 className="text-sm font-bold text-gray-950">
                        {item.question}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {item.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
