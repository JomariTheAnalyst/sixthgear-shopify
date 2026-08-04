import { defineField, defineType } from 'sanity'

type VideoFeatureParent = {
  useSanityContent?: boolean
  sourceType?: 'upload' | 'url'
}

function getParent(parent: unknown): VideoFeatureParent {
  return (parent as VideoFeatureParent | undefined) ?? {}
}

function isAllowedVideoUrl(value: string) {
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false

    const hostname = url.hostname.toLowerCase()
    return (
      hostname === 'res.cloudinary.com' ||
      hostname === 'youtu.be' ||
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com') ||
      hostname === 'youtube-nocookie.com' ||
      hostname.endsWith('.youtube-nocookie.com')
    )
  } catch {
    return false
  }
}

function isValidEditorialLink(value: string) {
  if (value.startsWith('/') && !value.startsWith('//')) return true

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export default defineType({
  name: 'videoFeatureSection',
  title: 'Featured Video',
  type: 'object',
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Use Sanity content',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to publish the settings below. When off, the built-in SixthGear trailer remains visible.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enabled',
      title: 'Show this section',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
    }),
    defineField({
      name: 'sourceType',
      title: 'Video source',
      type: 'string',
      initialValue: 'url',
      options: {
        layout: 'radio',
        list: [
          { title: 'Upload to Sanity', value: 'upload' },
          { title: 'Cloudinary or YouTube URL', value: 'url' },
        ],
      },
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !getParent(context.parent).useSanityContent ||
          value === 'upload' ||
          value === 'url' ||
          'Choose a video source.'
        ),
    }),
    defineField({
      name: 'videoUpload',
      title: 'Video upload',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => {
        const section = getParent(parent)
        return !section.useSanityContent || section.sourceType !== 'upload'
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const section = getParent(context.parent)
          return (
            !section.useSanityContent ||
            section.sourceType !== 'upload' ||
            Boolean(value) ||
            'Upload a video when the upload source is selected.'
          )
        }),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Cloudinary or YouTube URL',
      type: 'url',
      description:
        'Paste a Cloudinary video URL, a YouTube watch/share URL, or a YouTube privacy-enhanced URL.',
      hidden: ({ parent }) => {
        const section = getParent(parent)
        return !section.useSanityContent || section.sourceType !== 'url'
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const section = getParent(context.parent)
          if (!section.useSanityContent || section.sourceType !== 'url') return true
          if (typeof value !== 'string' || !value.trim()) {
            return 'Enter a Cloudinary or YouTube video URL.'
          }
          return (
            isAllowedVideoUrl(value) ||
            'Only Cloudinary and YouTube video URLs are supported.'
          )
        }),
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional preview image shown before playback. YouTube uses its thumbnail when this is empty.',
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
    }),
    defineField({
      name: 'title',
      title: 'Video title',
      type: 'string',
      initialValue: 'The SixthGear Experience',
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
    }),
    defineField({
      name: 'description',
      title: 'Video description',
      type: 'string',
      initialValue: 'Built for riders, from the workshop to the road.',
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
    }),
    defineField({
      name: 'videoLabel',
      title: 'Accessible video label',
      type: 'string',
      initialValue: 'SixthGear Moto workshop and rider experience',
      description: 'Briefly describe the video for assistive technology.',
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
    }),
    defineField({
      name: 'startMuted',
      title: 'Start muted',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
    }),
    defineField({
      name: 'loop',
      title: 'Loop video',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Explore our services',
      description: 'Leave both button fields empty to hide the button.',
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'string',
      initialValue: '/services',
      hidden: ({ parent }) => !getParent(parent).useSanityContent,
      validation: (Rule) =>
        Rule.custom((value) =>
          value == null ||
          value === '' ||
          (typeof value === 'string' && isValidEditorialLink(value.trim())) ||
          'Enter an internal path beginning with / or a complete http(s) URL.'
        ),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'videoUrl', media: 'poster' },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Featured video',
        subtitle: subtitle || 'Sanity video upload',
        media,
      }
    },
  },
})
