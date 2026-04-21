import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shopByBrandsSection',
  title: 'Brands Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomShopByBrands',
      title: 'Use this brands section on the homepage',
      type: 'boolean',
      description:
        'Turn this on to use the content below in the homepage brands section. Turn it off if you want the website to use its built-in default version instead.',
      initialValue: true,
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section heading',
      type: 'string',
      description:
        'Main title shown above the brand cards. Example: Shop by Brands',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showNavDesktop',
      title: 'Show arrow buttons on desktop',
      type: 'boolean',
      description:
        'Turn this on if you want arrow buttons to appear on desktop screens for this section.',
      initialValue: false,
    }),
    defineField({
      name: 'brands',
      title: 'Brand cards',
      type: 'array',
      of: [{ type: 'brandItem' }],
      description:
        'Add the brand cards shown in this homepage section. Drag items to change their order.',
    }),
    defineField({
      name: 'stats',
      title: 'Small highlight items under the brands',
      type: 'array',
      of: [{ type: 'statItem' }],
      description:
        'Add the small highlight items shown below the brands section.',
    }),
  ],
})
