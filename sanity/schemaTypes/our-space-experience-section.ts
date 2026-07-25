import { defineField, defineType } from 'sanity'

type AboutPageDocument = {
  ourSpaceExperience?: {
    useSanityContent?: boolean
  }
}

type OurSpaceParent = {
  useSanityContent?: boolean
}

function isEnabledFromDocument(document: unknown) {
  return (
    (document as AboutPageDocument | undefined)?.ourSpaceExperience
      ?.useSanityContent === true
  )
}

function isEnabledFromParent(parent: unknown) {
  return (parent as OurSpaceParent | undefined)?.useSanityContent === true
}

export default defineType({
  name: 'ourSpaceExperienceSection',
  title: 'Our Space & Experience',
  type: 'object',
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Use Sanity content',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to use this complete section. Turn off to use the website’s built-in space and experience content.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section heading',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isEnabledFromParent(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Section heading is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section description',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isEnabledFromParent(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Section description is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'items',
      title: 'Experience cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  !isEnabledFromDocument(context.document) ||
                  (typeof value === 'string' && value.trim().length > 0) ||
                  'Card title is required when Sanity content is enabled.'
                ),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  !isEnabledFromDocument(context.document) ||
                  (typeof value === 'string' && value.trim().length > 0) ||
                  'Card description is required when Sanity content is enabled.'
                ),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  !isEnabledFromDocument(context.document) ||
                  Boolean(value) ||
                  'Card image is required when Sanity content is enabled.'
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
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.max(8).custom((value, context) =>
          !isEnabledFromParent(context.parent) ||
          (Array.isArray(value) && value.length > 0) ||
          'Add at least one complete experience card when Sanity content is enabled.'
        ),
    }),
  ],
})
