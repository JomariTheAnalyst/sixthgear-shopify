import { defineArrayMember, defineField, defineType } from 'sanity'

type SourceSection = {
  useSanityContent?: boolean
}

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
    description: `Turn on only when this entire section is ready. Turn off to keep the complete existing ${fallbackName} fallback visible. If enabled content is incomplete, the website safely uses that same fallback.`,
    validation: (Rule) => Rule.required(),
  })
}

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Legacy main-content toggle (deprecated)',
      type: 'boolean',
      readOnly: true,
      initialValue: false,
      description:
        'Deprecated compatibility field. It no longer controls the website; each section below has its own source toggle.',
    }),
    defineField({
      name: 'hero',
      title: '1. Hero',
      type: 'object',
      description:
        'Top About-page banner. A disabled or incomplete section uses the complete existing Hero fallback.',
      fields: [
        sectionToggle('About Hero'),
        defineField({
          name: 'title',
          title: 'Page heading',
          type: 'string',
          description: 'Large heading shown over the Hero image.',
          validation: requiredWhenEnabled(
            'Page heading is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'description',
          title: 'Short description',
          type: 'text',
          rows: 3,
          description: 'Supporting paragraph below the Hero heading.',
          validation: requiredWhenEnabled(
            'Description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background image',
          type: 'image',
          options: { hotspot: true },
          description:
            'Wide landscape image behind the Hero copy; approximately 2000 × 1200 px or larger is recommended.',
          validation: assetRequiredWhenEnabled(
            'Background image is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'backgroundImageAlt',
          title: 'Background image description',
          type: 'string',
          description: 'Accessible description of the Hero image.',
          validation: requiredWhenEnabled(
            'Image description is required when Sanity content is enabled.'
          ),
        }),
      ],
    }),
    defineField({
      name: 'whyChooseUs',
      title: '2. Why Choose Us',
      type: 'object',
      description:
        'Reasons and overlapping workshop photos shown below the Hero. Disabled or incomplete content uses the full local section.',
      fields: [
        sectionToggle('Why Choose Us'),
        defineField({
          name: 'sectionLabel',
          title: 'Section label',
          type: 'string',
          description: 'Small orange label above the heading.',
          validation: requiredWhenEnabled(
            'Section label is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description: 'Main heading for this section.',
          validation: requiredWhenEnabled(
            'Heading is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          description: 'Supporting text below the heading.',
          validation: requiredWhenEnabled(
            'Subtitle is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'items',
          title: 'Reasons',
          type: 'array',
          description: 'Reason cards shown in this order.',
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
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Expert Workshop', value: 'wrench' },
                      { title: 'Quality Gear', value: 'shield' },
                      { title: 'Rider Community', value: 'users' },
                      { title: 'Coffee & Lounge', value: 'coffee' },
                    ],
                  },
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
                    hasText(item?.title) &&
                    hasText(item?.description) &&
                    hasText(item?.icon)
                )) ||
              'Add at least one complete reason when Sanity content is enabled.'
            ),
        }),
        defineField({
          name: 'topImage',
          title: 'Top photo',
          type: 'image',
          options: { hotspot: true },
          description: 'Upper portrait-oriented overlapping workshop photo.',
          validation: assetRequiredWhenEnabled(
            'Top photo is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'topImageAlt',
          title: 'Top photo description',
          type: 'string',
          validation: requiredWhenEnabled(
            'Top photo description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'bottomImage',
          title: 'Bottom photo',
          type: 'image',
          options: { hotspot: true },
          description: 'Lower portrait-oriented overlapping workshop photo.',
          validation: assetRequiredWhenEnabled(
            'Bottom photo is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'bottomImageAlt',
          title: 'Bottom photo description',
          type: 'string',
          validation: requiredWhenEnabled(
            'Bottom photo description is required when Sanity content is enabled.'
          ),
        }),
      ],
    }),
    defineField({
      name: 'ourStory',
      title: '3. Our Story',
      type: 'object',
      description:
        'Alternating story rows on the About page. Disabled or incomplete content uses all existing local story rows.',
      fields: [
        sectionToggle('Our Story'),
        defineField({
          name: 'items',
          title: 'Story rows',
          type: 'array',
          description:
            'Each row needs complete copy, a landscape image, and accessible image text. Drag to reorder.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'heading',
                  title: 'Heading',
                  type: 'string',
                }),
                defineField({
                  name: 'body',
                  title: 'Body text',
                  type: 'text',
                  rows: 4,
                }),
                defineField({
                  name: 'image',
                  title: 'Landscape photo',
                  type: 'image',
                  options: { hotspot: true },
                }),
                defineField({
                  name: 'imageAlt',
                  title: 'Photo description',
                  type: 'string',
                }),
              ],
              preview: {
                select: { title: 'heading', subtitle: 'body', media: 'image' },
              },
            }),
          ],
          validation: (Rule) =>
            Rule.custom((value, context) =>
              !sourceEnabled(context.parent) ||
              (Array.isArray(value) &&
                value.length > 0 &&
                value.every(
                  (item: any) =>
                    hasText(item?.heading) &&
                    hasText(item?.body) &&
                    Boolean(item?.image?.asset) &&
                    hasText(item?.imageAlt)
                )) ||
              'Add at least one complete story row when Sanity content is enabled.'
            ),
        }),
      ],
    }),
    defineField({
      name: 'story',
      title: 'Legacy Our Story rows (deprecated)',
      type: 'array',
      hidden: true,
      readOnly: true,
      description:
        'Retained for compatibility with the old schema. The website now reads ourStory.items.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
            defineField({ name: 'image', title: 'Image', type: 'image' }),
            defineField({ name: 'imageAlt', title: 'Image description', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'whatWeOffer',
      title: 'What We Offer (deprecated)',
      type: 'whatWeOfferSection',
      hidden: true,
      readOnly: true,
      description:
        'Legacy field retained for compatibility. It is not rendered on the About page and is not restored by this repair.',
    }),
    defineField({
      name: 'ourSpaceExperience',
      title: '4. Our Space & Experience',
      type: 'ourSpaceExperienceSection',
      description:
        'Coffee, rider lounge, and community cards. Its own toggle controls only this section.',
    }),
    defineField({
      name: 'ourValues',
      title: '5. Our Values',
      type: 'object',
      description:
        'Value cards shown below Our Space. Disabled or incomplete content uses the complete local Values section.',
      fields: [
        sectionToggle('Our Values'),
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
          rows: 3,
          validation: requiredWhenEnabled(
            'Description is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'cards',
          title: 'Value cards',
          type: 'array',
          description: 'Complete value cards shown in this order.',
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
                  rows: 4,
                }),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Tools & Craftsmanship', value: 'wrench' },
                      { title: 'Community & People', value: 'users' },
                      { title: 'Quality & Protection', value: 'shield' },
                      { title: 'Coffee & Experience', value: 'coffee' },
                      { title: 'Energy & Passion', value: 'energy' },
                      { title: 'Award & Trust', value: 'award' },
                    ],
                  },
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
                    hasText(item?.title) &&
                    hasText(item?.description) &&
                    hasText(item?.icon)
                )) ||
              'Add at least one complete value card when Sanity content is enabled.'
            ),
        }),
      ],
    }),
    defineField({
      name: 'ceoQuote',
      title: '6. CEO Quote',
      type: 'object',
      description:
        'Founder quote and portrait near the page bottom. Disabled or incomplete content uses the complete local quote.',
      fields: [
        sectionToggle('CEO Quote'),
        defineField({
          name: 'quoteText',
          title: 'Quote',
          type: 'text',
          rows: 4,
          validation: requiredWhenEnabled(
            'Quote is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'highlightedPhrase',
          title: 'Highlighted phrase',
          type: 'string',
          description:
            'Optional exact phrase from the quote that should appear in orange.',
        }),
        defineField({
          name: 'ceoName',
          title: 'Name',
          type: 'string',
          validation: requiredWhenEnabled(
            'Name is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'ceoTitle',
          title: 'Role',
          type: 'string',
          validation: requiredWhenEnabled(
            'Role is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'ceoPhoto',
          title: 'Portrait',
          type: 'image',
          options: { hotspot: true },
          description: 'Square or portrait photo used in the circular profile image.',
          validation: assetRequiredWhenEnabled(
            'Portrait is required when Sanity content is enabled.'
          ),
        }),
        defineField({
          name: 'ceoPhotoDescription',
          title: 'Portrait description',
          type: 'string',
          validation: requiredWhenEnabled(
            'Portrait description is required when Sanity content is enabled.'
          ),
        }),
      ],
    }),
    defineField({
      name: 'ctaBanner',
      title: '7. CTA Banner',
      type: 'ctaBanner',
      description:
        'Final dark CTA banner. Its source toggle is independent from every other About section.',
    }),
  ],
})
