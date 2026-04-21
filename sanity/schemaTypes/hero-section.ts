import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Main Banner Content',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomHero',
      title: 'Use this banner content on the homepage',
      type: 'boolean',
      description:
        'Turn this on to use the content below for the first homepage banner. Turn it off if you want the website to use its built-in default banner instead.',
      initialValue: true,
    }),
    defineField({
      name: 'heading',
      title: 'Main banner title',
      type: 'string',
      description:
        'Large headline shown in the first homepage banner. Keep it short, clear, and easy to scan.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short supporting text',
      type: 'text',
      rows: 3,
      description:
        'Short paragraph shown under the main banner title. This can explain the brand or current homepage focus.',
    }),
    defineField({
      name: 'primaryLabel',
      title: 'Main button text',
      type: 'string',
      description:
        'Text shown on the main button in the first homepage banner. Example: Shop Now',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryLink',
      title: 'Main button link',
      type: 'string',
      description:
        'Where the main button should go when clicked. Example: /store',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryLabel',
      title: 'Second button text',
      type: 'string',
      description: 'Optional second button shown beside the main button.',
    }),
    defineField({
      name: 'secondaryLink',
      title: 'Second button link',
      type: 'string',
      description: 'Optional link for the second button.',
    }),
    defineField({
      name: 'slides',
      title: 'Banner background images',
      type: 'array',
      of: [{ type: 'heroSlide' }],
      description:
        'Add the background images used in the homepage banner slideshow. Drag to reorder them. If you leave this empty, the website will use its built-in default banner images.',
    }),
  ],
})
