import { defineField, defineType } from 'sanity'

type DocumentWithWhatWeOffer = {
  whatWeOffer?: {
    useSanityContent?: boolean
  }
}

type WhatWeOfferParent = {
  useSanityContent?: boolean
}

function isEnabledFromDocument(document: unknown) {
  return (
    (document as DocumentWithWhatWeOffer | undefined)?.whatWeOffer
      ?.useSanityContent === true
  )
}

function isEnabledFromParent(parent: unknown) {
  return (parent as WhatWeOfferParent | undefined)?.useSanityContent === true
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
  name: 'whatWeOfferSection',
  title: 'What We Offer',
  type: 'object',
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Use Sanity content',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to use this complete section. Turn off to use the website’s built-in What We Offer content.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionName',
      title: 'Section label',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isEnabledFromParent(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Section label is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isEnabledFromParent(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Heading is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'cards',
      title: 'Offer cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Card title',
              type: 'string',
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  !isEnabledFromDocument(context.document) ||
                  (typeof value === 'string' && value.trim().length > 0) ||
                  'Card title is required when Sanity content is enabled.'
                ),
            }),
            defineField({
              name: 'backgroundImage',
              title: 'Background photo',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  !isEnabledFromDocument(context.document) ||
                  Boolean(value) ||
                  'Background photo is required when Sanity content is enabled.'
                ),
            }),
            defineField({
              name: 'imageAlt',
              title: 'Image description',
              type: 'string',
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  !isEnabledFromDocument(context.document) ||
                  (typeof value === 'string' && value.trim().length > 0) ||
                  'Image description is required when Sanity content is enabled.'
                ),
            }),
            defineField({
              name: 'buttonText',
              title: 'Button text',
              type: 'string',
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  !isEnabledFromDocument(context.document) ||
                  (typeof value === 'string' && value.trim().length > 0) ||
                  'Button text is required when Sanity content is enabled.'
                ),
            }),
            defineField({
              name: 'linkUrl',
              title: 'Button link',
              type: 'string',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  if (!isEnabledFromDocument(context.document)) return true
                  if (typeof value !== 'string' || value.trim().length === 0) {
                    return 'Button link is required when Sanity content is enabled.'
                  }

                  return (
                    isValidEditorialLink(value) ||
                    'Enter an internal path beginning with / or a complete http(s) URL.'
                  )
                }),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'linkUrl',
              media: 'backgroundImage',
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isEnabledFromParent(context.parent) ||
          (Array.isArray(value) && value.length > 0) ||
          'Add at least one complete offer card when Sanity content is enabled.'
        ),
    }),
  ],
})
