import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomAbout',
      title: 'Use CMS About Section',
      type: 'boolean',
      description: 'If disabled, the site must render the FALLBACK data entirely.',
      initialValue: true,
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker / Tagline',
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
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Text', type: 'string' }),
        defineField({ name: 'link', title: 'Link', type: 'string' }),
      ],
    }),
    defineField({
      name: 'imageTop',
      title: 'Top Image (Workshop)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageBottom',
      title: 'Bottom Image (Mechanic)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    }),
  ],
})
