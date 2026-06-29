import { Metadata } from "next"
import { notFound } from "next/navigation"

import type {
  SanityBlogPost,
  SanityBlogPostListItem,
  SanityPortableTextBlock,
} from "@lib/cms/types"
import { getBlogPostBySlug, getLatestBlogPosts } from "@lib/cms/client"
import {
  buildRiderStoryArticle,
  createRiderStorySlug,
  type RiderStoryPreview,
} from "@lib/rider-stories"
import {
  getLocalizedCanonicalPath,
  getNoindexFollowRobots,
  hasNonCanonicalSearchParams,
} from "@lib/seo"
import { getClientStoriesWithFallbacks } from "@lib/strapi/client-stories"
import { fetchHomeContent } from "@lib/strapi/home"
import RiderStoryArticlePage from "@modules/rider-stories/templates/article-page"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function parseLegacyPublishedDate(date: string): string | null {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function pushParagraphBlock(
  blocks: SanityPortableTextBlock[],
  text: string,
  key: string
) {
  blocks.push({
    _type: "block",
    _key: key,
    style: "normal",
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks: [],
      },
    ],
    markDefs: [],
  })
}

function pushHeadingBlock(
  blocks: SanityPortableTextBlock[],
  text: string,
  key: string
) {
  blocks.push({
    _type: "block",
    _key: key,
    style: "h2",
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks: [],
      },
    ],
    markDefs: [],
  })
}

function mapLegacyStoryToBlogPost(
  story: RiderStoryPreview
): SanityBlogPost {
  const article = buildRiderStoryArticle(story)
  const body: SanityPortableTextBlock[] = []

  article.intro.forEach((paragraph, index) => {
    pushParagraphBlock(body, paragraph, `intro-${index}`)
  })

  article.sections.forEach((section, sectionIndex) => {
    pushHeadingBlock(body, section.title, `section-${sectionIndex}-title`)
    section.paragraphs.forEach((paragraph, paragraphIndex) => {
      pushParagraphBlock(
        body,
        paragraph,
        `section-${sectionIndex}-paragraph-${paragraphIndex}`
      )
    })
  })

  if (article.pullQuote.quote) {
    pushParagraphBlock(body, article.pullQuote.quote, "pull-quote")
  }

  if (article.takeaway) {
    pushParagraphBlock(body, article.takeaway, "takeaway")
  }

  return {
    _id: `legacy-${article.slug}`,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    publishedAt: parseLegacyPublishedDate(article.date),
    authorName: article.author,
    featured: false,
    featuredImageUrl: article.heroImage,
    featuredImageAlt: article.title,
    socialImageUrl: article.heroImage,
    category: {
      title: article.category,
      slug: createRiderStorySlug(article.category),
      description: null,
    },
    tags: [],
    seoTitle: null,
    seoDescription: null,
    body,
  }
}

function mapLegacyStoryToListItem(
  story: RiderStoryPreview
): SanityBlogPostListItem {
  const slug = createRiderStorySlug(story.title)

  return {
    _id: `legacy-${slug}`,
    title: story.title,
    slug,
    excerpt: story.excerpt,
    publishedAt: parseLegacyPublishedDate(story.date),
    authorName: story.author,
    featured: false,
    featuredImageUrl: story.image,
    featuredImageAlt: story.title,
    socialImageUrl: story.image,
    category: {
      title: story.category,
      slug: createRiderStorySlug(story.category),
      description: null,
    },
    tags: [],
  }
}

async function getFallbackStories(): Promise<RiderStoryPreview[]> {
  const homeContent = await fetchHomeContent()
  const content = getClientStoriesWithFallbacks(homeContent)
  return content.stories
}

async function getStoryWithFallback(slug: string): Promise<SanityBlogPost | null> {
  const story = await getBlogPostBySlug(slug)

  if (story) {
    return story
  }

  const fallbackStories = await getFallbackStories()
  const fallbackStory = fallbackStories.find(
    (entry) => createRiderStorySlug(entry.title) === slug
  )

  return fallbackStory ? mapLegacyStoryToBlogPost(fallbackStory) : null
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode, slug } = await props.params
  const searchParams = (await props.searchParams) ?? {}
  const shouldNoindex = hasNonCanonicalSearchParams(searchParams, {
    allowPaginationParams: true,
  })
  const story = await getStoryWithFallback(slug)

  if (!story) {
    return {
      title: "Rider Story",
    }
  }

  return {
    title: `${story.seoTitle || story.title} | Rider Stories`,
    description: story.seoDescription || story.excerpt || undefined,
    alternates: {
      canonical: getLocalizedCanonicalPath(
        countryCode,
        `/rider-stories/${slug}`
      ),
    },
    openGraph: {
      title: story.seoTitle || story.title || "Rider Story",
      description: story.seoDescription || story.excerpt || undefined,
      images:
        story.socialImageUrl || story.featuredImageUrl
          ? [{ url: story.socialImageUrl || story.featuredImageUrl || "" }]
          : [],
    },
    twitter: {
      card:
        story.socialImageUrl || story.featuredImageUrl
          ? "summary_large_image"
          : "summary",
      title: story.seoTitle || story.title || "Rider Story",
      description: story.seoDescription || story.excerpt || undefined,
      images:
        story.socialImageUrl || story.featuredImageUrl
          ? [story.socialImageUrl || story.featuredImageUrl || ""]
          : [],
    },
    ...(shouldNoindex ? { robots: getNoindexFollowRobots() } : {}),
  }
}

export default async function RiderStoryPage(props: Props) {
  const { slug } = await props.params
  const [story, allStories, fallbackStories] = await Promise.all([
    getStoryWithFallback(slug),
    getLatestBlogPosts(),
    getFallbackStories(),
  ])

  if (!story) {
    notFound()
  }

  const relatedStories =
    allStories.length > 0
      ? allStories.filter((entry) => entry.slug && entry.slug !== slug).slice(0, 2)
      : fallbackStories
          .filter((entry) => createRiderStorySlug(entry.title) !== slug)
          .slice(0, 2)
          .map(mapLegacyStoryToListItem)

  return (
    <RiderStoryArticlePage
      article={story}
      relatedStories={relatedStories}
    />
  )
}
