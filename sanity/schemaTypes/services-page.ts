import { defineArrayMember, defineField, defineType } from 'sanity'

type SourceSection = { useSanityContent?: boolean }

function sourceEnabled(parent: unknown) {
  return (parent as SourceSection | undefined)?.useSanityContent === true
}

function requiredWhenEnabled(message: string) {
  return (Rule: any) =>
    Rule.custom((value: unknown, context: { parent?: unknown }) =>
      !sourceEnabled(context.parent) ||
      (typeof value === 'string' && value.trim().length > 0) ||
      message
    )
}

function assetRequiredWhenEnabled(message: string) {
  return (Rule: any) =>
    Rule.custom((value: unknown, context: { parent?: unknown }) =>
      !sourceEnabled(context.parent) || Boolean(value) || message
    )
}

function hasText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function sectionToggle(fallbackName: string) {
  return defineField({
    name: 'useSanityContent',
    title: 'Use Sanity content',
    type: 'boolean',
    initialValue: false,
    description: `Turn on only when this complete section is ready. Turn off to use the complete existing ${fallbackName} fallback. Incomplete enabled content also falls back safely.`,
    validation: (Rule) => Rule.required(),
  })
}

export default defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: '1. Hero',
      type: 'object',
      description:
        'Top Services banner. Disabled or incomplete content uses the existing Hero unchanged.',
      fields: [
        sectionToggle('Services Hero'),
        defineField({
          name: 'title',
          title: 'Main heading',
          type: 'string',
          validation: requiredWhenEnabled(
            'Main heading is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'shortTitle',
          title: 'Short breadcrumb title',
          type: 'string',
          validation: requiredWhenEnabled(
            'Short title is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          validation: requiredWhenEnabled(
            'Description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'heroImage',
          title: 'Background image',
          type: 'image',
          options: { hotspot: true },
          description:
            'Wide landscape image behind the Hero content; at least 2000 × 1200 px is recommended.',
          validation: assetRequiredWhenEnabled(
            'Background image is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'heroImageAlt',
          title: 'Background image description',
          type: 'string',
          validation: requiredWhenEnabled(
            'Image description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'image',
          title: 'Legacy fallback image',
          type: 'image',
          hidden: true,
          readOnly: true,
          description: 'Retained for compatibility; the Hero uses heroImage.',
        }),
      ],
    }),
    defineField({
      name: 'expertiseStats',
      title: '2. Expertise & Assistance',
      type: 'object',
      description:
        'Expertise copy, highlights, and roadside-assistance card below the Hero. Disabled or incomplete content uses the existing section.',
      fields: [
        sectionToggle('Expertise & Assistance'),
        defineField({
          name: 'sectionHeading',
          title: 'Section heading',
          type: 'string',
          validation: requiredWhenEnabled(
            'Section heading is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'sectionDescription',
          title: 'Section description',
          type: 'text',
          rows: 4,
          validation: requiredWhenEnabled(
            'Section description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'highlights',
          title: 'Expertise highlights',
          type: 'array',
          description: 'Text blocks shown beneath the section introduction.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                }),
              ],
              preview: { select: { title: 'title', subtitle: 'description' } },
            }),
          ],
          validation: (Rule) =>
            Rule.custom((value, context) =>
              !sourceEnabled(context.parent) ||
              (Array.isArray(value) &&
                value.length > 0 &&
                value.every(
                  (item: any) =>
                    hasText(item?.title) && hasText(item?.description)
                )) ||
              'Add at least one expertise highlight when Sanity content is enabled.'
            ),
        }),
        defineField({
          name: 'assistance',
          title: 'Assistance card',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({ name: 'buttonText', title: 'Button text', type: 'string' }),
            defineField({ name: 'buttonLink', title: 'Button link', type: 'string' }),
          ],
          validation: (Rule) =>
            Rule.custom((value: any, context) => {
              if (!sourceEnabled(context.parent)) return true
              return (
                Boolean(
                  value?.heading?.trim() &&
                    value?.description?.trim() &&
                    value?.buttonText?.trim() &&
                    value?.buttonLink?.trim()
                ) ||
                'Complete every assistance-card field when Sanity content is enabled.'
              )
            }),
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Assistance card image',
          type: 'image',
          options: { hotspot: true },
          description: 'Portrait or landscape workshop image behind the assistance card.',
          validation: assetRequiredWhenEnabled(
            'Assistance image is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'backgroundImageAlt',
          title: 'Assistance image description',
          type: 'string',
          validation: requiredWhenEnabled(
            'Assistance image description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'stats',
          title: 'Legacy stat cards (deprecated)',
          type: 'array',
          hidden: true,
          readOnly: true,
          description:
            'Retained for compatibility with the earlier schema; the current design renders expertise highlights.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'number', title: 'Number', type: 'string' }),
                defineField({ name: 'label', title: 'Label', type: 'string' }),
              ],
            }),
          ],
        }),
        defineField({
          name: 'buttonText',
          title: 'Legacy button text',
          type: 'string',
          hidden: true,
          readOnly: true,
        }),
        defineField({
          name: 'buttonLink',
          title: 'Legacy button link',
          type: 'string',
          hidden: true,
          readOnly: true,
        }),
      ],
    }),
    defineField({
      name: 'brandsWeService',
      title: '3. Brands We Service',
      type: 'object',
      description:
        'Brand-logo row. Disabled or incomplete content uses the complete existing brand list.',
      fields: [
        sectionToggle('Brands We Service'),
        defineField({
          name: 'sectionHeading',
          title: 'Section heading',
          type: 'string',
          validation: requiredWhenEnabled(
            'Section heading is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'brands',
          title: 'Brand items',
          type: 'array',
          description: 'Transparent logo artwork is recommended. Drag to reorder.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'name',
                  title: 'Brand name',
                  type: 'string',
                }),
                defineField({
                  name: 'logo',
                  title: 'Brand logo',
                  type: 'image',
                }),
                defineField({
                  name: 'logoAlt',
                  title: 'Logo description',
                  type: 'string',
                }),
              ],
              preview: { select: { title: 'name', media: 'logo' } },
            }),
          ],
          validation: (Rule) =>
            Rule.custom((value, context) =>
              !sourceEnabled(context.parent) ||
              (Array.isArray(value) &&
                value.length > 0 &&
                value.every(
                  (item: any) =>
                    hasText(item?.name) &&
                    Boolean(item?.logo?.asset) &&
                    hasText(item?.logoAlt)
                )) ||
              'Add at least one complete brand when Sanity content is enabled.'
            ),
        }),
      ],
    }),
    defineField({
      name: 'servicesGrid',
      title: '4. Services Grid',
      type: 'object',
      description:
        'Landing-page service cards. The source toggle and custom ordering setting are separate.',
      fields: [
        sectionToggle('Services Grid'),
        defineField({
          name: 'sectionHeading',
          title: 'Section heading',
          type: 'string',
          validation: requiredWhenEnabled(
            'Section heading is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'useCustomServices',
          title: 'Customize service selection and order',
          type: 'boolean',
          initialValue: false,
          description:
            'This does not enable the section. When Sanity content above is enabled, turn this on to use only the referenced services below in their chosen order; otherwise all published service documents are used.',
          validation: (Rule) =>
            Rule.custom((value, context) =>
              !sourceEnabled(context.parent) ||
              typeof value === 'boolean' ||
              'Choose whether to customize service selection when Sanity content is enabled.'
            ),
        }),
        defineField({
          name: 'featuredServices',
          title: 'Custom ordered services',
          type: 'array',
          description:
            'Used only when “Customize service selection and order” is on. Drag references to reorder.',
          of: [
            defineArrayMember({
              type: 'reference',
              to: [{ type: 'service' }],
            }),
          ],
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as
                | { useSanityContent?: boolean; useCustomServices?: boolean }
                | undefined
              return (
                parent?.useSanityContent !== true ||
                parent?.useCustomServices !== true ||
                (Array.isArray(value) && value.length > 0) ||
                'Select at least one service when custom ordering is enabled.'
              )
            }),
        }),
      ],
    }),
    defineField({
      name: 'processOfWork',
      title: '5. Process of Work',
      type: 'object',
      description:
        'Numbered workshop-process cards. Disabled or incomplete content uses all existing process steps.',
      fields: [
        sectionToggle('Process of Work'),
        defineField({
          name: 'sectionHeading',
          title: 'Section heading',
          type: 'string',
          validation: requiredWhenEnabled(
            'Section heading is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'steps',
          title: 'Process steps',
          type: 'array',
          description: 'Numbered process cards shown in this order.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'number',
                  title: 'Step number',
                  type: 'string',
                }),
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 4,
                }),
              ],
              preview: { select: { title: 'title', subtitle: 'number' } },
            }),
          ],
          validation: (Rule) =>
            Rule.custom((value, context) =>
              !sourceEnabled(context.parent) ||
              (Array.isArray(value) &&
                value.length > 0 &&
                value.every(
                  (item: any) =>
                    hasText(item?.number) &&
                    hasText(item?.title) &&
                    hasText(item?.description)
                )) ||
              'Add at least one process step when Sanity content is enabled.'
            ),
        }),
      ],
    }),
    defineField({
      name: 'servicesGallery',
      title: '6. Services Gallery',
      type: 'object',
      description:
        'Workshop-story media carousel and booking copy. Supports Sanity-hosted video, images, or an approved external media URL.',
      fields: [
        sectionToggle('Services Gallery'),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: requiredWhenEnabled(
            'Heading is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
          validation: requiredWhenEnabled(
            'Description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'profileName',
          title: 'Story profile name',
          type: 'string',
          validation: requiredWhenEnabled(
            'Profile name is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'profileSubtitle',
          title: 'Story profile subtitle',
          type: 'string',
          validation: requiredWhenEnabled(
            'Profile subtitle is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'profileLogo',
          title: 'Story profile logo',
          type: 'image',
          description: 'Square transparent logo recommended.',
          validation: assetRequiredWhenEnabled(
            'Profile logo is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'profileLogoAlt',
          title: 'Profile logo description',
          type: 'string',
          validation: requiredWhenEnabled(
            'Profile logo description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'buttonText',
          title: 'Booking button text',
          type: 'string',
          validation: requiredWhenEnabled(
            'Booking button text is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'items',
          title: 'Gallery media',
          type: 'array',
          description:
            'Choose video or image for each item. Portrait media works best in the current story frame.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'mediaType',
                  title: 'Media type',
                  type: 'string',
                  initialValue: 'video',
                  options: {
                    list: [
                      { title: 'Video', value: 'video' },
                      { title: 'Image', value: 'image' },
                    ],
                    layout: 'radio',
                  },
                }),
                defineField({
                  name: 'video',
                  title: 'Video file',
                  type: 'file',
                  options: { accept: 'video/*' },
                  hidden: ({ parent }) => parent?.mediaType !== 'video',
                }),
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  hidden: ({ parent }) => parent?.mediaType !== 'image',
                }),
                defineField({
                  name: 'externalUrl',
                  title: 'External media URL',
                  type: 'url',
                  description:
                    'Optional fallback for existing Cloudinary video or image URLs.',
                }),
                defineField({
                  name: 'label',
                  title: 'Accessible media description',
                  type: 'string',
                }),
              ],
              preview: { select: { title: 'label', media: 'image' } },
            }),
          ],
          validation: (Rule) =>
            Rule.custom((value: any, context) => {
              if (!sourceEnabled(context.parent)) return true
              if (!Array.isArray(value) || value.length === 0) {
                return 'Add at least one gallery item when Sanity content is enabled.'
              }
              return (
                value.every(
                  (item) =>
                    item?.label?.trim() &&
                    ((item.mediaType === 'video' &&
                      (item.video?.asset || item.externalUrl)) ||
                      (item.mediaType === 'image' &&
                        (item.image?.asset || item.externalUrl)))
                ) ||
                'Every gallery item needs a matching video/image asset (or external URL) and description.'
              )
            }),
        }),
      ],
    }),
    defineField({
      name: 'ctaBanner',
      title: '7. CTA Banner',
      type: 'ctaBanner',
      description:
        'Final dark CTA banner. Its source toggle controls only this Services-page section.',
    }),
  ],
})
