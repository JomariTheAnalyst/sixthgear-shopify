import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'categoriesSection',
  title: 'Categories Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomCategories',
      title: 'Enable Custom Categories section',
      type: 'boolean',
      description: 'Toggle OFF to show the default hardcoded static section instead.',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'e.g., "Product Categories"',
    }),
    defineField({
      name: 'watermarkText',
      title: 'Background Watermark Text',
      type: 'string',
      description: 'The large faded text in the background (e.g., "ACCESSORIES")',
    }),
    defineField({
      name: 'viewAllLabel',
      title: 'View All Button Label',
      type: 'string',
      description: 'e.g., "VIEW ALL"',
    }),
    defineField({
      name: 'viewAllLink',
      title: 'View All Button Link',
      type: 'string',
      description: 'e.g., "/store"',
    }),
    defineField({
      name: 'items',
      title: 'Category Items',
      type: 'array',
      of: [{ type: 'categoryItem' }],
      description: 'The grid of category links',
    }),
  ],
})
