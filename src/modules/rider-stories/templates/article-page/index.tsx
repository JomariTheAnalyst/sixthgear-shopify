import Image from "next/image"

import { inter, montserrat } from "@lib/fonts"
import type { SanityBlogPost, SanityBlogPostListItem } from "@lib/cms/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RiderStoryPortableText from "@modules/rider-stories/components/portable-text"

type RiderStoryArticlePageProps = {
  article: SanityBlogPost
  relatedStories: SanityBlogPostListItem[]
}

export default function RiderStoryArticlePage({
  article,
  relatedStories,
}: RiderStoryArticlePageProps) {
  return (
    <main className="bg-white text-black">
      <section>
        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-14 lg:pt-10">
          <LocalizedClientLink
            href="/rider-stories"
            className={`${inter.className} inline-flex items-center gap-2 text-sm font-medium text-black/40 transition-colors hover:text-black`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Rider Stories
          </LocalizedClientLink>

          <div className="mx-auto mt-10 max-w-[1320px] text-center">
            <div className={`${inter.className} flex flex-wrap items-center justify-center gap-3 text-sm text-black/42`}>
              {article.category?.title ? (
                <>
                  <span className="font-medium text-[#F16D34]">
                    {article.category.title}
                  </span>
                  <span>/</span>
                </>
              ) : null}
              <span>Article</span>
            </div>

            <h1
              className={`${montserrat.className} mx-auto mt-10 max-w-[1320px] text-[3.35rem] font-extrabold uppercase leading-[0.86] tracking-[-0.075em] text-[#191b22] sm:text-[5.5rem] lg:text-[8.85rem]`}
            >
              {article.title || "Rider Story"}
            </h1>

            <p className={`${inter.className} mx-auto mt-10 text-[15px] font-medium text-black/78 sm:text-[16px]`}>
              Published:{" "}
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unpublished"}
            </p>
          </div>

          {article.featuredImageUrl ? (
          <div className="mx-auto mt-14 max-w-[1080px]">
            <div className="relative overflow-hidden rounded-[22px] bg-black/[0.03]">
              <div className="relative aspect-[16/11] sm:aspect-[16/9.2]">
                <Image
                  src={article.featuredImageUrl}
                  alt={article.title || "Rider Story"}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 1080px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-14 pt-2 sm:px-6 lg:px-10 lg:pb-20">
        <article className="mx-auto max-w-[860px]">
          <div className={`${inter.className} space-y-10 text-[1.02rem] leading-[1.78] text-[#252525] sm:text-[1.06rem]`}>
            {article.excerpt ? <p>{article.excerpt}</p> : null}
          </div>

          <div className="mt-10">
            <RiderStoryPortableText value={article.body} />
          </div>

          <div className={`${inter.className} mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-black/10 pt-6 text-[13px] text-black/65`}>
            {article.authorName ? (
              <div>
                <span className="uppercase tracking-[0.16em] text-black/30">Author</span>
                <p className="mt-1 text-black/88">{article.authorName}</p>
              </div>
            ) : null}
            <div>
              <span className="uppercase tracking-[0.16em] text-black/30">Published</span>
              <p className="mt-1 text-black/88">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unpublished"}
              </p>
            </div>
            {article.category?.title ? (
              <div>
                <span className="uppercase tracking-[0.16em] text-black/30">Category</span>
                <p className="mt-1 text-black/88">{article.category.title}</p>
              </div>
            ) : null}
          </div>
        </article>
      </section>

      {relatedStories.length > 0 && (
        <section>
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-[860px]">
              <p className={`${inter.className} text-[11px] font-semibold uppercase tracking-[0.16em] text-black/35`}>
                More Articles
              </p>
              <h2
                className={`${montserrat.className} mt-3 text-[2.4rem] font-extrabold tracking-[-0.065em] text-[#191b22] sm:text-[3.25rem]`}
              >
                Continue reading
              </h2>
              <p className={`${inter.className} mt-4 text-base leading-7 text-black/55`}>
                More rider stories, garage notes, and editorial features from
                the road, the workshop, and the Sixthgear community.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-[860px] gap-8 lg:grid-cols-2">
              {relatedStories.map((story) => (
                <LocalizedClientLink
                  key={story._id}
                  href={`/rider-stories/${story.slug || ""}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-[20px] bg-white">
                    {story.featuredImageUrl ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-black/[0.03]">
                        <Image
                          src={story.featuredImageUrl}
                          alt={story.title || "Rider story"}
                          fill
                          sizes="(max-width: 1023px) 100vw, 560px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}

                    <div className="px-5 py-5 sm:px-6 sm:py-6">
                      <div className={`${inter.className} flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/38`}>
                        {story.category?.title ? <span>{story.category.title}</span> : null}
                        {story.category?.title && story.publishedAt ? (
                          <span className="h-1 w-1 rounded-full bg-[#F16D34]" />
                        ) : null}
                        {story.publishedAt ? (
                          <span>
                            {new Date(story.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        ) : null}
                      </div>

                      <h3
                        className={`${montserrat.className} mt-4 text-[1.55rem] font-extrabold leading-[1] tracking-[-0.05em] text-[#191b22] transition-colors group-hover:text-black/80`}
                      >
                        {story.title || "Rider Story"}
                      </h3>

                      <p className={`${inter.className} mt-3 text-sm leading-7 text-black/58`}>
                        {story.excerpt || ""}
                      </p>

                      <div className={`${inter.className} mt-6 inline-flex items-center gap-2 text-sm font-medium text-black`}>
                        <span>Read article</span>
                        <svg
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h14m-7-7l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
