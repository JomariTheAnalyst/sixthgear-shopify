"use client"

import Image from "next/image"

import type { SanityBlogPostListItem } from "@lib/cms/types"
import {
  cleanSanityString,
  createSanityDataAttribute,
} from "@lib/cms/visual-editing"
import { outfit } from "@lib/fonts"
import { CLIENT_STORIES_FALLBACKS } from "@lib/strapi/client-stories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useSanityVisualEditingEnabled } from "components/sanity/visual-editing-provider"

type Story = Partial<Pick<
  SanityBlogPostListItem,
  | "_id"
  | "title"
  | "slug"
  | "excerpt"
  | "readingText"
  | "publishedAt"
  | "featuredImageUrl"
  | "featuredImageAlt"
>> & {
  id?: number
  date?: string | null
  image?: string | null
}

type DisplayStory = {
  key: string
  documentId: string | null
  title: string
  slug: string
  excerpt: string
  publishedLabel: string
  publishedTimestamp: number
  featuredImageUrl: string | null
  featuredImageAlt: string
  readTimeLabel: string
}

interface ClientStoriesProps {
  stories?: Story[]
}

const WORDS_PER_MINUTE = 200

const createStorySlug = (title: string) =>
  cleanSanityString(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const parsePublishedTimestamp = (value?: string | null) => {
  if (!value) return 0

  const timestamp = new Date(cleanSanityString(value)).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const formatPublishedDate = (value?: string | null) => {
  const timestamp = parsePublishedTimestamp(value)
  if (!timestamp) return ""

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(timestamp)
}

const estimateReadTime = (text?: string | null) => {
  const cleanedText = cleanSanityString(text || "").trim()
  const wordCount = cleanedText ? cleanedText.split(/\s+/).length : 0
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))

  return `${minutes} min read`
}

const normalizeStories = (stories: Story[]): DisplayStory[] =>
  stories
    .map((story, index) => {
      const title = cleanSanityString(story.title || "Rider Story")
      const slug = cleanSanityString(story.slug || createStorySlug(title))
      const publishedSource = story.publishedAt || story.date || null
      const documentId = story._id || null

      return {
        key: documentId || String(story.id || `${slug}-${index}`),
        documentId,
        title,
        slug,
        excerpt: cleanSanityString(story.excerpt || ""),
        publishedLabel: formatPublishedDate(publishedSource),
        publishedTimestamp: parsePublishedTimestamp(publishedSource),
        featuredImageUrl: story.featuredImageUrl || story.image || null,
        featuredImageAlt: cleanSanityString(story.featuredImageAlt || title),
        readTimeLabel: estimateReadTime(story.readingText || story.excerpt),
      }
    })
    .filter((story) => story.slug && story.title)
    .sort((a, b) => b.publishedTimestamp - a.publishedTimestamp)

const getStoryHref = (slug: string) =>
  `/rider-stories/${encodeURIComponent(cleanSanityString(slug))}`

export default function ClientStories({ stories = [] }: ClientStoriesProps) {
  const visualEditingEnabled = useSanityVisualEditingEnabled()
  const fallbackStories: Story[] = CLIENT_STORIES_FALLBACKS.stories.map(
    (story) => ({
      id: story.id,
      title: story.title,
      slug: createStorySlug(story.title),
      excerpt: story.excerpt,
      readingText: story.excerpt,
      date: story.date,
      image: story.image,
    })
  )
  const displayStories = normalizeStories(
    stories.length > 0 ? stories : fallbackStories
  ).slice(0, 4)
  const featuredStory = displayStories[0]
  const secondaryStories = displayStories.slice(1, 4)

  if (!featuredStory) return null

  return (
    <section
      id="rider-stories"
      aria-labelledby="rider-stories-heading"
      className={`${outfit.className} overflow-hidden bg-white px-4 py-14 text-[#111111] sm:px-6 md:py-18 lg:px-10 lg:py-24 xl:px-[233px]`}
    >
      <h2 id="rider-stories-heading" className="sr-only">
        Rider Stories
      </h2>

      <div className="grid items-stretch gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] xl:gap-4">
        <article
          data-sanity={
            featuredStory.documentId
              ? createSanityDataAttribute(visualEditingEnabled, {
                  documentId: featuredStory.documentId,
                  documentType: "blogPost",
                  path: "title",
                })
              : undefined
          }
          className="group min-w-0"
        >
          <LocalizedClientLink
            href={getStoryHref(featuredStory.slug)}
            aria-label={`Read ${featuredStory.title}`}
            className="flex h-full flex-col rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[#f1f1ef]">
              {featuredStory.featuredImageUrl ? (
                <Image
                  src={cleanSanityString(featuredStory.featuredImageUrl)}
                  alt={featuredStory.featuredImageAlt}
                  data-sanity={
                    featuredStory.documentId
                      ? createSanityDataAttribute(visualEditingEnabled, {
                          documentId: featuredStory.documentId,
                          documentType: "blogPost",
                          path: "featuredImage",
                        })
                      : undefined
                  }
                  fill
                  sizes="(max-width: 1279px) calc(100vw - 48px), calc((100vw - 482px) * 0.51)"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              ) : null}
            </div>

            <div className="flex flex-1 flex-col pt-5 sm:pt-6">
              <h3 className="max-w-[18ch] text-[clamp(2rem,3vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.045em]">
                {featuredStory.title}
              </h3>

              {featuredStory.excerpt ? (
                <p className="mt-4 max-w-[66ch] text-sm leading-6 text-black/58 sm:text-[15px] sm:leading-7">
                  {featuredStory.excerpt}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/45 sm:text-[13px]">
                <span>{featuredStory.readTimeLabel}</span>
                {featuredStory.publishedLabel ? (
                  <time
                    dateTime={new Date(
                      featuredStory.publishedTimestamp
                    ).toISOString()}
                  >
                    {featuredStory.publishedLabel}
                  </time>
                ) : null}
              </div>

              <div className="mt-5">
                <span className="inline-flex min-h-10 items-center justify-center rounded-full bg-black px-6 py-2.5 text-xs font-medium text-white transition-colors duration-300 group-hover:bg-[#F16D34]">
                  Learn More
                </span>
              </div>
            </div>
          </LocalizedClientLink>
        </article>

        {secondaryStories.length > 0 ? (
          <div className="grid gap-4 xl:grid-rows-3">
            {secondaryStories.map((story) => (
              <article
                key={story.key}
                data-sanity={
                  story.documentId
                    ? createSanityDataAttribute(visualEditingEnabled, {
                        documentId: story.documentId,
                        documentType: "blogPost",
                        path: "title",
                      })
                    : undefined
                }
                className="group min-w-0"
              >
                <LocalizedClientLink
                  href={getStoryHref(story.slug)}
                  aria-label={`Read ${story.title}`}
                  className="grid h-full min-w-0 grid-cols-[minmax(112px,40%)_minmax(0,1fr)] gap-4 rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:grid-cols-[minmax(180px,42%)_minmax(0,1fr)]"
                >
                  <div className="relative aspect-[4/3] min-h-[112px] overflow-hidden rounded-[16px] bg-[#f1f1ef] xl:h-full xl:min-h-0 xl:aspect-auto">
                    {story.featuredImageUrl ? (
                      <Image
                        src={cleanSanityString(story.featuredImageUrl)}
                        alt={story.featuredImageAlt}
                        data-sanity={
                          story.documentId
                            ? createSanityDataAttribute(
                                visualEditingEnabled,
                                {
                                  documentId: story.documentId,
                                  documentType: "blogPost",
                                  path: "featuredImage",
                                }
                              )
                            : undefined
                        }
                        fill
                        sizes="(max-width: 639px) 40vw, (max-width: 1279px) 42vw, calc((100vw - 482px) * 0.2)"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                      />
                    ) : null}
                  </div>

                  <div className="flex min-w-0 flex-col py-1 sm:py-2">
                    <h3 className="line-clamp-3 text-[15px] font-semibold leading-[1.2] tracking-[-0.02em] transition-colors duration-300 group-hover:text-[#F16D34] sm:text-lg xl:text-[clamp(1rem,1.15vw,1.35rem)]">
                      {story.title}
                    </h3>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-1 pt-4 text-[11px] text-black/42 sm:text-xs">
                      <span>{story.readTimeLabel}</span>
                      {story.publishedLabel ? (
                        <time
                          dateTime={new Date(
                            story.publishedTimestamp
                          ).toISOString()}
                        >
                          {story.publishedLabel}
                        </time>
                      ) : null}
                    </div>
                  </div>
                </LocalizedClientLink>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
