import { defineType, defineField } from 'sanity'

type ServiceBrandsSectionParent = {
  useSanityContent?: boolean
}

function sanityContentIsEnabled(parent: unknown) {
  return (parent as ServiceBrandsSectionParent | undefined)?.useSanityContent === true
}

export default defineType({
  name: 'serviceBrandsSection',
  title: 'Motorcycle Brands We Service',
  type: 'object',
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Use Sanity content',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to use this complete section. Turn off to use the website’s built-in brand content.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section heading',
      type: 'string',
      description:
        'Main heading shown above the brand accordion. Example: Motorcycle Brands We Service & Support',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Section heading is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Short supporting text',
      type: 'text',
      rows: 2,
      description:
        'Short paragraph shown under the title. Keep this easy to read and focused on customer trust.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Supporting text is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'brands',
      title: 'Supported brands',
      type: 'array',
      of: [{ type: 'serviceBrandItem' }],
      description: 'Brands shown in the homepage accordion. Drag items to change their order.',
      validation: (Rule) =>
        Rule.max(12).custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (Array.isArray(value) && value.length > 0) ||
          'Add at least one brand when Sanity content is enabled.'
        ),
    }),
  ],
})
