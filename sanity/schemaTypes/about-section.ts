import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomAbout',
      title: 'Use this About section on the homepage',
      type: 'boolean',
      description:
        'Turn this on to use the content below in the homepage About section. Turn it off if you want the website to use its built-in default version instead.',
      initialValue: true,
    }),
    defineField({
      name: 'kicker',
      title: 'Small label above the title',
      type: 'string',
      description:
        'Optional short label shown above the main About heading.',
    }),
    defineField({
      name: 'title',
      title: 'Main heading',
      type: 'string',
      description: 'Main title shown in the homepage About section.',
    }),
    defineField({
      name: 'description',
      title: 'About text',
      type: 'text',
      description:
        'Main paragraph shown in the About section. Keep this clear and easy to read.',
    }),
    defineField({
      name: 'highlights',
      title: 'Short highlight points',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Add short bullet-style points that quickly explain key strengths or offerings.',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Main button',
      type: 'object',
      description: 'Optional button shown in the About section.',
      fields: [
        defineField({ name: 'text', title: 'Button text', type: 'string' }),
        defineField({ name: 'link', title: 'Button link', type: 'string' }),
      ],
    }),
    defineField({
      name: 'imageTop',
      title: 'Top photo',
      type: 'image',
      description:
        'Upper image shown in the About section. A workshop or brand-related photo works best.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageBottom',
      title: 'Bottom photo',
      type: 'image',
      description:
        'Lower image shown in the About section. A mechanic, rider, or store photo works best.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Optional video link',
      type: 'url',
      description:
        'Optional video link related to the brand or store. Leave empty if you do not need a video here.',
    }),
  ],
})
