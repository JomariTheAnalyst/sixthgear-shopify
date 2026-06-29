import type {
  ShopifyCollectionFaqItem,
  ShopifyCollectionSeoLanding,
} from "@lib/shopify/types"

type RelatedCollection = {
  handle: string
  title: string
}

type ServiceLink = {
  href: string
  label: string
  description?: string
}

type CollectionSeoContentProps = {
  countryCode: string
  seoLanding?: ShopifyCollectionSeoLanding
  relatedCollections?: RelatedCollection[]
  serviceLinks?: ServiceLink[]
  placement: "primary" | "secondary"
}

function hasText(value?: string) {
  return Boolean(value?.trim())
}

function TextBlock({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className="space-y-4 text-sm leading-7 text-gray-700 md:text-base">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}

function ContentSection({
  heading,
  body,
}: {
  heading?: string
  body?: string
}) {
  if (!hasText(heading) && !hasText(body)) {
    return null
  }

  return (
    <section className="border-t border-gray-100 py-8 first:border-t-0 first:pt-0">
      {hasText(heading) && (
        <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-950 md:text-2xl">
          {heading}
        </h2>
      )}
      {hasText(body) && <TextBlock text={body!} />}
    </section>
  )
}

function RelatedCollections({
  countryCode,
  collections,
}: {
  countryCode: string
  collections: RelatedCollection[]
}) {
  if (collections.length === 0) {
    return null
  }

  return (
    <section className="border-t border-gray-100 py-8">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-950 md:text-2xl">
        Related Collections
      </h2>
      <div className="flex flex-wrap gap-2">
        {collections.map((collection) => (
          <a
            key={collection.handle}
            href={`/${countryCode}/collections/${collection.handle}`}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-900 hover:text-gray-950"
          >
            {collection.title}
          </a>
        ))}
      </div>
    </section>
  )
}

function RelatedServices({
  countryCode,
  services,
}: {
  countryCode: string
  services: ServiceLink[]
}) {
  if (services.length === 0) {
    return null
  }

  return (
    <section className="border-t border-gray-100 py-8">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-950 md:text-2xl">
        Related Services
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {services.map((service) => (
          <a
            key={service.href}
            href={`/${countryCode}${service.href}`}
            className="border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-gray-900 hover:bg-white"
          >
            <span className="text-sm font-bold text-gray-950">
              {service.label}
            </span>
            {service.description && (
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {service.description}
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}

function FaqSection({ items }: { items: ShopifyCollectionFaqItem[] }) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="border-t border-gray-100 py-8">
      <h2 className="mb-5 text-xl font-bold tracking-tight text-gray-950 md:text-2xl">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-gray-100 border-y border-gray-100">
        {items.map((item) => (
          <article key={item.question} className="py-5">
            <h3 className="text-base font-bold text-gray-950">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-7 text-gray-700 md:text-base">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function CollectionSeoContent({
  countryCode,
  seoLanding,
  relatedCollections = [],
  serviceLinks = [],
  placement,
}: CollectionSeoContentProps) {
  if (!seoLanding && serviceLinks.length === 0) {
    return null
  }

  const hasPrimaryContent =
    hasText(seoLanding?.introHeading) ||
    hasText(seoLanding?.introBody) ||
    hasText(seoLanding?.buyingGuideHeading) ||
    hasText(seoLanding?.buyingGuideBody) ||
    hasText(seoLanding?.fitmentHeading) ||
    hasText(seoLanding?.fitmentBody)

  const hasSecondaryContent =
    relatedCollections.length > 0 ||
    serviceLinks.length > 0 ||
    (seoLanding?.faqItems?.length ?? 0) > 0 ||
    hasText(seoLanding?.bottomContent)

  if (
    (placement === "primary" && !hasPrimaryContent) ||
    (placement === "secondary" && !hasSecondaryContent)
  ) {
    return null
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12">
        {placement === "primary" ? (
          <>
            <ContentSection
              heading={seoLanding?.introHeading}
              body={seoLanding?.introBody}
            />
            <ContentSection
              heading={seoLanding?.buyingGuideHeading}
              body={seoLanding?.buyingGuideBody}
            />
            <ContentSection
              heading={seoLanding?.fitmentHeading}
              body={seoLanding?.fitmentBody}
            />
          </>
        ) : (
          <>
            <RelatedCollections
              countryCode={countryCode}
              collections={relatedCollections}
            />
            <RelatedServices
              countryCode={countryCode}
              services={serviceLinks}
            />
            <FaqSection items={seoLanding?.faqItems ?? []} />
            <ContentSection body={seoLanding?.bottomContent} />
          </>
        )}
      </div>
    </div>
  )
}
