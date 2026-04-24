export type RiderStoryPreview = {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
}

export type RiderStorySection = {
  title: string
  paragraphs: string[]
}

export type RiderStoryArticle = RiderStoryPreview & {
  slug: string
  readTime: string
  kicker: string
  heroImage: string
  heroCaption: string
  intro: string[]
  sections: RiderStorySection[]
  pullQuote: {
    quote: string
    attribution: string
  }
  takeaway: string
}

type PlaceholderBlueprint = {
  readTime: string
  kicker?: string
  heroImage?: string
  heroCaption: string
  intro: string[]
  sections: RiderStorySection[]
  pullQuote: {
    quote: string
    attribution: string
  }
  takeaway: string
}

export function createRiderStorySlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const PLACEHOLDER_BLUEPRINTS: Record<string, PlaceholderBlueprint> = {
  "first-long-ride-after-engine-rebuild": {
    readTime: "6 min read",
    
    heroCaption:
      "Placeholder editorial image for a long-form rider feature. Final photography can be swapped in once CMS media is ready.",
    intro: [
      "The article layout is intentionally structured like a modern editorial page: a quiet opening, a strong headline, a wide lead image, and a clean reading column that keeps the focus on the story itself.",
      "For now, this entry uses placeholder body copy to prove the design system. Later, your boss can replace the headline, dek, image, and article body from the CMS without changing the layout.",
    ],
    sections: [
      {
        title: "Why This Story Format Works",
        paragraphs: [
          "A good rider story does not need heavy UI. It needs a clear title, enough breathing room around the opening paragraphs, and a content width that makes long-form reading feel calm instead of dense.",
          "This structure is designed to support workshop updates, ride recaps, owner features, and editorial notes from the team without looking like a generic blog template."
        ],
      },
      {
        title: "Built For Real Editorial Use",
        paragraphs: [
          "The page is split into a restrained metadata rail and a primary reading column so the article feels premium on desktop while remaining straightforward on mobile.",
          "That means you can later plug in real author data, publish dates, categories, and related stories without redesigning the page each time a new article goes live."
        ],
      },
      {
        title: "Placeholder Today, CMS Tomorrow",
        paragraphs: [
          "The copy here is temporary by design. The important part is that the presentation layer is now defined: image-led, minimal, readable, and easy to wire to Sanity later.",
          "Once the CMS work starts, the same layout can render rich content blocks such as headings, paragraphs, quotes, inline images, and simple callouts."
        ],
      },
    ],
    pullQuote: {
      quote:
        "The strongest article pages get out of the way and let the story carry the page.",
      attribution: "Editorial direction for Rider Stories",
    },
    takeaway:
      "This page is the presentation shell. The content can be replaced later without rebuilding the design.",
  },
  "why-regular-pms-matters": {
    readTime: "5 min read",
    heroCaption:
      "Placeholder service-oriented cover image for a practical garage note or workshop insight.",
    intro: [
      "This version demonstrates how your rider stories section can also support service education content, not just ride diaries or founder-style essays.",
      "A strong editorial layout should be flexible enough to handle practical information while still feeling premium and brand-consistent."
  ], 
    sections: [
      {
        title: "Editorial Without Looking Corporate",
        paragraphs: [
          "The reference here is not a newspaper template and not a typical ecommerce blog. The aim is a cleaner product-editorial aesthetic similar to high-end company blogs where typography and spacing do most of the work.",
          "That is why the article uses a large heading block, low-noise metadata, and a clear reading rhythm instead of stacked cards and boxed content panels."
        ],
      },
      {
        title: "A Better Foundation For Future CMS Content",
        paragraphs: [
          "When the CMS is connected, an article like this can carry service notes, maintenance explainers, ride prep guides, and product knowledge without the design changing from post to post.",
          "That consistency matters because it makes the entire rider stories system feel intentional rather than like a collection of unrelated blog pages."
        ],
      },
      {
        title: "Reading Experience First",
        paragraphs: [
          "Long-form pages fail when they overload the reader with accents, dividers, or gadget-like UI. This one keeps the content surface quiet and uses contrast only where hierarchy needs to be obvious.",
          "The result is easier scanning, better mobile readability, and a design that is strong enough to hold real editorial content once the placeholders are replaced."
        ],
      },
    ],
    pullQuote: {
      quote:
        "",
      attribution: "",
    },
    takeaway:
      "",
  },
  "weekend-ride-to-tagaytay": {
    readTime: "7 min read",
    kicker: "Rider Feature",
    heroCaption:
      "Placeholder lifestyle image for a route story, ride diary, or community feature.",
    intro: [
      "This article variant shows how the same system can support a more atmospheric, narrative-driven story while preserving the same disciplined visual language.",
      "The page uses one dominant image, a compact metadata layer, and a reading column that feels spacious enough for longer storytelling."
    ],
    sections: [
      {
        title: "Designed To Scale With Content",
        paragraphs: [
          "The current version uses placeholder copy, but the composition is already stable: lead image, introduction, structured sections, a pull quote, and a closing takeaway.",
          "That means the frontend can be approved now before the CMS schema is finalized, which is the right sequence if the visual standard matters."
        ],
      },
      {
        title: "Clean Enough For Strong Photography",
        paragraphs: [
          "Corporate editorial sites work because the visual system gives real images and strong headlines enough space. They do not rely on decorative components to simulate sophistication.",
          "This approach fits your brand better than a traditional blog card stack because it feels closer to a modern journal or design-led publication."
        ],
      },
      {
        title: "Ready For Content Editing Later",
        paragraphs: [
          "Once Sanity is wired in, your boss should only need to update the story data and body content. The layout itself should remain fixed so every article inherits the same quality level.",
          "That gives you faster publishing, easier QA, and fewer chances for inconsistent article pages."
        ],
      },
    ],
    pullQuote: {
      quote:
        "If the structure is right, each new story inherits polish instead of needing a redesign.",
      attribution: "Editorial system principle",
    },
    takeaway:
      "The page is intentionally system-driven: one layout, many stories, consistent presentation.",
  },
}

function buildGenericBlueprint(story: RiderStoryPreview): PlaceholderBlueprint {
  return {
    readTime: "6 min read",
    kicker: story.category || "Rider Story",
    heroCaption:
      "Placeholder editorial image used to validate the article layout before the CMS content model is connected.",
    intro: [
      `This article page is a placeholder presentation for "${story.title}" and is meant to validate the frontend direction before the content workflow is connected to the CMS.`,
      "The layout is built to support clean editorial storytelling: one strong headline, one lead image, a disciplined reading column, and a structure that can scale as more rider stories are published.",
    ],
    sections: [
      {
        title: "A Clear Editorial Hierarchy",
        paragraphs: [
          "The design reduces chrome and lets typography, spacing, and imagery do the heavy lifting. That keeps the page modern and professional instead of over-designed.",
          "This also makes the template easier to reuse, because new articles can drop into the same system without requiring custom layout work."
        ],
      },
      {
        title: "Prepared For CMS Integration",
        paragraphs: [
          "Everything here is intentionally structured so the content can later come from Sanity with minimal template changes.",
          "Headline, date, author, image, body sections, and related stories can all be mapped cleanly once the schema is ready."
        ],
      },
      {
        title: "Placeholder Content With Real Intent",
        paragraphs: [
          "The body copy is temporary, but the reading experience is the real deliverable in this phase.",
          "This lets you approve the visual direction first and handle the authoring workflow separately, which is the correct order for a quality editorial system."
        ],
      },
    ],
    pullQuote: {
      quote:
        "Front-end structure first, CMS wiring second. That keeps the editorial system deliberate instead of improvised.",
      attribution: "Rider Stories implementation approach",
    },
    takeaway:
      "This article template is designed to stay fixed while the content changes per story.",
  }
}

export function buildRiderStoryArticle(
  story: RiderStoryPreview
): RiderStoryArticle {
  const slug = createRiderStorySlug(story.title)
  const blueprint = PLACEHOLDER_BLUEPRINTS[slug] || buildGenericBlueprint(story)

  return {
    ...story,
    slug,
    readTime: blueprint.readTime,
    kicker: blueprint.kicker ?? story.category,
    heroImage: blueprint.heroImage || story.image,
    heroCaption: blueprint.heroCaption,
    intro: blueprint.intro,
    sections: blueprint.sections,
    pullQuote: blueprint.pullQuote,
    takeaway: blueprint.takeaway,
  }
}
