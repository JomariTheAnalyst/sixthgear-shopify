import type { Metadata } from "next"
import Image from "next/image"

import { getLatestBlogPosts } from "@lib/cms/client"
import { inter, montserrat } from "@lib/fonts"
import { getLocalizedCanonicalPath } from "@lib/seo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return {
    title: "Rider Stories",
    description:
      "Read rider stories, garage notes, and workshop articles from the SixthgearMoto team and community.",
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/rider-stories"),
    },
  }
}

export default async function RiderStoriesListingPage() {
  const posts = await getLatestBlogPosts()

  return (
    <main className="bg-white text-black">
      <section className="mx-auto max-w-[1440px] px-4 pb-14 pt-10 sm:px-6 lg:px-10 lg:pb-20 lg:pt-14">
        <div className="mx-auto max-w-[980px] text-center">
          <p
            className={`${inter.className} text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F16D34]`}
          >
            Rider Stories
          </p>
          <h1
            className={`${montserrat.className} mt-5 text-[2.9rem] font-extrabold uppercase leading-[0.9] tracking-[-0.07em] text-[#191b22] sm:text-[4.8rem] lg:text-[6.2rem]`}
          >
            Stories, garage notes, and rider-led articles.
          </h1>
          <p
            className={`${inter.className} mx-auto mt-6 max-w-[680px] text-base leading-7 text-black/58 sm:text-[1.02rem]`}
          >
            Practical stories from the road, the workshop, and the SixthgearMoto
            community.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mx-auto mt-16 max-w-[760px] rounded-[24px] border border-black/10 px-6 py-16 text-center sm:px-10">
            <p className={`${inter.className} text-base leading-7 text-black/68`}>
              No rider stories have been published yet. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-[1240px] gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group flex flex-col border border-gray-200 bg-white p-3 md:p-4"
              >
                {post.featuredImageUrl ? (
                  <div className="relative aspect-[4/5] overflow-hidden border border-gray-200 bg-[#f3efe8]">
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.title || "Rider story"}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col pt-4 md:pt-5">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    {post.publishedAt ? (
                      <span
                        className={`${inter.className} text-xs font-semibold uppercase tracking-[0.06em] text-[#ff5000] md:text-sm`}
                      >
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    ) : null}
                    {post.category?.title ? (
                      <span
                        className={`${inter.className} text-[11px] font-semibold uppercase tracking-[0.14em] text-black/38`}
                      >
                        {post.category.title}
                      </span>
                    ) : null}
                  </div>

                  <h2
                    className={`${montserrat.className} text-xl font-bold leading-[1.12] tracking-[0.005em] text-[#111111] md:text-2xl lg:text-[24px]`}
                  >
                    {post.title || "Rider Story"}
                  </h2>

                  {post.excerpt ? (
                    <p
                      className={`${inter.className} mt-3 text-sm leading-relaxed text-gray-600 md:text-[15px]`}
                    >
                      {post.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-end justify-end pt-6">
                    <LocalizedClientLink
                      href={`/rider-stories/${post.slug || ""}`}
                      className={`${inter.className} inline-flex items-center text-sm font-medium uppercase tracking-[0.12em] text-black`}
                    >
                      Read article
                    </LocalizedClientLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
