import { defineField, defineType } from 'sanity'

type FeaturedCollectionParent = {
  isActive?: boolean
  startDate?: string
}

function campaignIsActive(parent: unknown) {
  return (parent as FeaturedCollectionParent | undefined)?.isActive === true
}

function requiredWhenActive(value: unknown, parent: unknown, label: string) {
  return (
    !campaignIsActive(parent) ||
    (typeof value === 'string' && value.trim().length > 0) ||
    `${label} is required while the campaign is active.`
  )
}

function isValidLink(value: string) {
  if (value.startsWith('/')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default defineType({
  name: 'featuredCollection',
  title: 'Featured Collection Item',
  type: 'object',
  fields: [
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: false,
      description: 'Turn on to make this campaign eligible for its configured schedule.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      description: 'Not shown to visitors.',
    }),
    defineField({
      name: 'position',
      title: 'Homepage position',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'After Hero', value: 'after_hero' },
          { title: 'After About', value: 'after_about' },
          { title: 'After Categories', value: 'after_categories' },
          { title: 'After Coffee Showcase', value: 'after_coffee' },
          { title: 'After Our Services', value: 'after_services' },
          { title: 'After Brands Section', value: 'after_brands' },
          { title: 'After Satisfied Customers', value: 'after_satisfied' },
          { title: 'After Franchise', value: 'after_franchise' },
          { title: 'After Our Team', value: 'after_team' },
          { title: 'After Testimonials', value: 'after_testimonials' },
        ],
      },
      initialValue: 'after_brands',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'datetime',
      description: 'Optional. Leave empty to make an active campaign eligible immediately.',
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'datetime',
      description: 'Optional. Leave empty to prevent automatic expiry.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const startDate = (context.parent as FeaturedCollectionParent | undefined)
            ?.startDate
          if (!value || !startDate) return true
          return (
            Date.parse(value as string) >= Date.parse(startDate) ||
            'End date must be on or after the start date.'
          )
        }),
    }),
    defineField({
      name: 'layout',
      title: 'Image position',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Image Left — Products Right', value: 'image_left' },
          { title: 'Image Right — Products Left', value: 'image_right' },
        ],
      },
      initialValue: 'image_left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentPosition',
      title: 'Text and button position',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Bottom Left', value: 'bottom-left' },
          { title: 'Bottom Center', value: 'bottom-center' },
          { title: 'Bottom Right', value: 'bottom-right' },
        ],
      },
      initialValue: 'bottom-left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !campaignIsActive(context.parent) ||
          Boolean(value) ||
          'Banner image is required while the campaign is active.'
        ),
    }),
    defineField({
      name: 'bannerImageAlt',
      title: 'Banner image description',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          requiredWhenActive(value, context.parent, 'Banner image description')
        ),
    }),
    defineField({
      name: 'collectionHandle',
      title: 'Shopify collection handle',
      type: 'string',
      description: 'Enter the exact collection handle from Shopify.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          requiredWhenActive(value, context.parent, 'Shopify collection handle')
        ),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          requiredWhenActive(value, context.parent, 'Heading')
        ),
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'string',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          requiredWhenActive(value, context.parent, 'Button label')
        ),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button destination',
      type: 'string',
      description: 'Use an internal path beginning with / or a complete HTTP(S) URL.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const required = requiredWhenActive(
            value,
            context.parent,
            'Button destination'
          )
          if (required !== true) return required
          if (!value) return true
          return (
            isValidLink(value as string) ||
            'Enter an internal path beginning with / or a complete HTTP(S) URL.'
          )
        }),
    }),
  ],
  preview: {
    select: {
      title: 'internalName',
      active: 'isActive',
      position: 'position',
      layout: 'layout',
    },
    prepare({ title, active, position, layout }) {
      const direction = layout === 'image_right' ? 'Image right' : 'Image left'
      return {
        title: title || 'Untitled campaign',
        subtitle: `${active ? 'Active' : 'Inactive'} · ${position ?? 'No position'} · ${direction}`,
      }
    },
  },
})
