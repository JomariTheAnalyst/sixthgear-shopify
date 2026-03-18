import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'categoriesSection',
  title: 'Homepage Categories Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomCategories',
      title: 'Use this Categories section',
      type: 'boolean',
      description:
        'Turn this on to use the content below on the website. Turn it off if you want the website to use its built-in default version instead.',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      title: 'Section heading',
      type: 'string',
      description:
        'Main title shown above the category cards. Example: Product Categories',
    }),
    defineField({
      name: 'watermarkText',
      title: 'Large background word',
      type: 'string',
      description:
        'Large faded word shown behind the section heading on desktop screens. Example: CATEGORIES',
    }),
    defineField({
      name: 'viewAllLabel',
      title: 'Bottom button text',
      type: 'string',
      description:
        'Text shown on the button at the bottom of this section. Example: View All',
    }),
    defineField({
      name: 'viewAllLink',
      title: 'Bottom button link',
      type: 'string',
      description:
        'Where the bottom button should go when clicked. Example: /store',
    }),
    defineField({
      name: 'items',
      title: 'Category cards',
      type: 'array',
      of: [{ type: 'categoryItem' }],
      description:
        'These are the cards shown in the Categories section. Add one card for each product group you want to highlight.',
    }),
  ],
})
