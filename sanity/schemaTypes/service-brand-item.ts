import { defineField, defineType } from 'sanity'

type HomepageDocument = {
  serviceBrandsSection?: {
    useSanityContent?: boolean
  }
}

type ServiceBrandParent = {
  link?: string
  linkLabel?: string
}

function sanityServiceBrandsIsEnabled(document: unknown) {
  return (
    (document as HomepageDocument | undefined)?.serviceBrandsSection?.useSanityContent === true
  )
}

function isValidEditorialLink(value: string) {
  if (value.startsWith('/')) return true

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default defineType({
  name: 'serviceBrandItem',
  title: 'Brand',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Brand name',
      type: 'string',
      description: 'Brand name shown in the accordion. Example: Suzuki or Yamaha.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityServiceBrandsIsEnabled(context.document) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Brand name is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'logo',
      title: 'Brand logo',
      type: 'image',
      description: 'Logo shown before hover. Use a transparent PNG or SVG when possible.',
      options: { hotspot: false },
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityServiceBrandsIsEnabled(context.document) ||
          Boolean(value) ||
          'Brand logo is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'logoAlt',
      title: 'Logo description',
      type: 'string',
      description: 'Accessible description of the logo. Example: Suzuki logo.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityServiceBrandsIsEnabled(context.document) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Logo description is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'motorcycleImage',
      title: 'Motorcycle image',
      type: 'image',
      options: { hotspot: true },
      description: 'Motorcycle image revealed when visitors hover over the brand logo.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityServiceBrandsIsEnabled(context.document) ||
          Boolean(value) ||
          'Motorcycle image is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'motorcycleImageAlt',
      title: 'Motorcycle image description',
      type: 'string',
      description: 'Accessible description of the motorcycle image.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityServiceBrandsIsEnabled(context.document) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Motorcycle image description is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'overview',
      title: 'Brand overview',
      type: 'text',
      rows: 4,
      description: 'Editorial paragraph shown when this brand accordion item is open.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityServiceBrandsIsEnabled(context.document) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Brand overview is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'keySentences',
      title: 'Supporting points',
      type: 'array',
      of: [
        defineField({
          name: 'supportingPoint',
          title: 'Supporting point',
          type: 'string',
          validation: (Rule) => Rule.required().max(180),
        }),
      ],
      description: 'Bullet points shown below the brand overview.',
      validation: (Rule) =>
        Rule.max(4).custom((value, context) =>
          !sanityServiceBrandsIsEnabled(context.document) ||
          (Array.isArray(value) && value.length > 0) ||
          'Add at least one supporting point when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'link',
      title: 'Editorial link',
      type: 'string',
      description: 'Optional internal or external destination for this brand.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!sanityServiceBrandsIsEnabled(context.document)) return true

          const parent = context.parent as ServiceBrandParent | undefined
          const hasLink = typeof value === 'string' && value.trim().length > 0
          const hasLabel =
            typeof parent?.linkLabel === 'string' && parent.linkLabel.trim().length > 0

          if (hasLink !== hasLabel) {
            return 'Editorial link and link label must be filled in together.'
          }

          return (
            !hasLink ||
            isValidEditorialLink(value) ||
            'Enter an internal path beginning with / or a complete http(s) URL.'
          )
        }),
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link label',
      type: 'string',
      description: 'Label shown for the optional brand link. Example: Explore Brand.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!sanityServiceBrandsIsEnabled(context.document)) return true

          const parent = context.parent as ServiceBrandParent | undefined
          const hasLabel = typeof value === 'string' && value.trim().length > 0
          const hasLink = typeof parent?.link === 'string' && parent.link.trim().length > 0

          return hasLabel === hasLink || 'Editorial link and link label must be filled in together.'
        }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Untitled brand',
        media,
      }
    },
  },
})
