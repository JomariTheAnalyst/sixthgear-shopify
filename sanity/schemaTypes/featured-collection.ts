import { defineField, defineType } from 'sanity'

type FeaturedCollectionParent = {
  isActive?: boolean
  startDate?: string
  layout?: string
  mediaType?: string
  videoSource?: string
}

// Uploaded banner videos autoplay on loop, so keep them small.
const MAX_VIDEO_UPLOAD_MB = 10

function getParent(parent: unknown): FeaturedCollectionParent {
  return (parent as FeaturedCollectionParent | undefined) ?? {}
}

function campaignIsActive(parent: unknown) {
  return getParent(parent).isActive === true
}

function isFullWidth(parent: unknown) {
  return getParent(parent).layout === 'full_width'
}

function usesVideo(parent: unknown) {
  return isFullWidth(parent) && getParent(parent).mediaType === 'video'
}

function isCloudinaryUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' && url.hostname.toLowerCase() === 'res.cloudinary.com'
  } catch {
    return false
  }
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
      description:
        'Only 3 campaigns can be active at once. Turn one off before turning on another.',
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
          { title: 'Full width — banner with product row below', value: 'full_width' },
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
      name: 'mediaType',
      title: 'Banner media',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
      initialValue: 'image',
      description: 'Full width only. Phones and reduced-motion visitors always see the banner image.',
      hidden: ({ parent }) => !isFullWidth(parent),
    }),
    defineField({
      name: 'videoSource',
      title: 'Video source',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Cloudinary URL (recommended)', value: 'url' },
          { title: 'Upload to Sanity', value: 'upload' },
        ],
      },
      initialValue: 'url',
      hidden: ({ parent }) => !usesVideo(parent),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Cloudinary video URL',
      type: 'url',
      description: 'Paste a res.cloudinary.com video link. The video plays muted on loop.',
      hidden: ({ parent }) => !usesVideo(parent) || getParent(parent).videoSource === 'upload',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent
          if (!usesVideo(parent) || getParent(parent).videoSource === 'upload') return true
          if (typeof value !== 'string' || !value.trim()) {
            return campaignIsActive(parent)
              ? 'Cloudinary video URL is required while the campaign is active.'
              : true
          }
          return isCloudinaryUrl(value) || 'Only https://res.cloudinary.com video URLs are supported.'
        }),
    }),
    defineField({
      name: 'videoUpload',
      title: 'Video upload',
      type: 'file',
      options: { accept: 'video/mp4,video/webm' },
      description: `MP4 or WebM, ${MAX_VIDEO_UPLOAD_MB} MB or smaller. The video plays muted on loop.`,
      hidden: ({ parent }) => !usesVideo(parent) || getParent(parent).videoSource !== 'upload',
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const parent = context.parent
          if (!usesVideo(parent) || getParent(parent).videoSource !== 'upload') return true

          const ref = (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref
          if (!ref) {
            return campaignIsActive(parent)
              ? 'Upload a video while the campaign is active.'
              : true
          }

          const size = await context
            .getClient({ apiVersion: '2024-01-01' })
            .fetch<number | null>('*[_id == $ref][0].size', { ref })
          return (
            typeof size !== 'number' ||
            size <= MAX_VIDEO_UPLOAD_MB * 1024 * 1024 ||
            `Video must be ${MAX_VIDEO_UPLOAD_MB} MB or smaller. Compress it or use a Cloudinary URL.`
          )
        }),
    }),
    defineField({
      name: 'darkOverlay',
      title: 'Dark overlay',
      type: 'boolean',
      initialValue: true,
      description: 'Darkens the banner so the text stays readable. Full width only.',
      hidden: ({ parent }) => !isFullWidth(parent),
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Use the hotspot to set the focal point. For a video banner this is the poster, shown before the video plays and on phones.',
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
      const direction =
        layout === 'full_width'
          ? 'Full width'
          : layout === 'image_right'
            ? 'Image right'
            : 'Image left'
      return {
        title: title || 'Untitled campaign',
        subtitle: `${active ? 'Active' : 'Inactive'} · ${position ?? 'No position'} · ${direction}`,
      }
    },
  },
})
