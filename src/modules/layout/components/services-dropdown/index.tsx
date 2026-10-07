"use client"

import Image from "next/image"

import type { SanityBlogPostListItem } from "@lib/cms/types"
import { cleanSanityString } from "@lib/cms/visual-editing"
import type { ServiceCategory } from "@lib/services-data"
import CalBookingTrigger from "@modules/booking/components/cal-booking-trigger"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ServicesDropdownProps {
  servicesData: ServiceCategory[]
  clientStories: SanityBlogPostListItem[]
  /** False until the dropdown first opens, so its images don't load while hidden. */
  showImages: boolean
}

const ServicesDropdown = ({
  servicesData,
  clientStories,
  showImages,
}: ServicesDropdownProps) => {
  const categories = servicesData

  return (
    <div className="bg-white w-full">
      <div className="mx-auto w-[90%] py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 border-r border-gray-100 pr-6 lg:col-span-3">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-900">
              Services Category
            </h3>
              <div className="flex flex-col gap-0.5">
                {categories.map((service) => (
                  <LocalizedClientLink
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="text-left px-3 py-2 text-sm font-semibold text-gray-500 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-900 focus-visible:bg-gray-50 focus-visible:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#F16D34]"
                  >
                    {service.title}
                  </LocalizedClientLink>
                ))}
              </div>
              <div className="mt-6 px-3">
                <CalBookingTrigger
                  className="block w-full py-3 text-center bg-[#1a1a1a] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#F16D34] transition-colors rounded-md"
                >
                  Book Now
                </CalBookingTrigger>
              </div>
          </div>

          <div className="col-span-12 pl-4 lg:col-span-9">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
                  Client Stories
                </h2>
                <LocalizedClientLink
                  href="/rider-stories"
                  className="text-xs font-bold text-[#F16D34] hover:text-[#d95a2b] transition-colors uppercase tracking-wider"
                >
                  View All →
                </LocalizedClientLink>
              </div>

              {clientStories.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {clientStories.map((story) => {
                    const title = cleanSanityString(story.title || "Client Story")
                    const slug = cleanSanityString(story.slug || "")

                    return (
                      <article key={story._id} className="group min-w-0">
                        <LocalizedClientLink
                          href={`/rider-stories/${encodeURIComponent(slug)}`}
                          aria-label={`Read ${title}`}
                          className="relative block aspect-video overflow-hidden rounded-md bg-[#1a1a1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]"
                        >
                          {showImages && story.featuredImageUrl ? (
                            <Image
                              src={cleanSanityString(story.featuredImageUrl)}
                              alt={cleanSanityString(
                                story.featuredImageAlt || title
                              )}
                              fill
                              sizes="(min-width: 1024px) 36vw, 90vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                          <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 p-4 text-base font-bold leading-tight text-white sm:text-lg">
                            {title}
                          </h3>
                        </LocalizedClientLink>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <p className="py-8 text-sm font-medium text-gray-500">
                  No client stories are published yet.
                </p>
              )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesDropdown
