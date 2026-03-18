import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'serviceItem',
  title: 'Service Card',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Service title',
      type: 'string',
      description:
        'The name shown on the service card. Keep it short enough to fit on two lines.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Extra notes about this service',
      type: 'text',
      rows: 4,
      description:
        'This is not shown on the current homepage card design. You can use it as internal notes or future supporting copy if needed.',
    }),
    defineField({
      name: 'image',
      title: 'Service photo',
      type: 'image',
      options: { hotspot: true },
      description:
        'Main image shown on the service card. Use a clear service-related photo that looks good in a tall card layout.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Service page name',
      type: 'string',
      description:
        'Used to build the service page link automatically. Example: preventive-maintenance. Use lowercase letters and hyphens only.',
    }),
    defineField({
      name: 'link',
      title: 'Custom button link',
      type: 'string',
      description:
        'Optional. Add a full destination here if you want the Learn More button to go somewhere specific. If left empty, the website will automatically use the Service page name above.',
    }),
  ],
})
