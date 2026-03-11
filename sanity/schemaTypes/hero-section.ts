import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomHero',
      title: 'Use CMS Hero',
      type: 'boolean',
      description: 'If disabled, the site must render FALLBACK_HERO entirely',
      initialValue: true,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'primaryLabel',
      title: 'Primary Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryLink',
      title: 'Primary Link',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryLabel',
      title: 'Secondary Label',
      type: 'string',
    }),
    defineField({
      name: 'secondaryLink',
      title: 'Secondary Link',
      type: 'string',
    }),
    defineField({
      name: 'slides',
      title: 'Slideshow Images',
      type: 'array',
      of: [{ type: 'heroSlide' }],
      description: 'Add background slides for the hero section. Drag to reorder. If 0 slides, the fallback slideshow is used.',
    }),
  ],
})
