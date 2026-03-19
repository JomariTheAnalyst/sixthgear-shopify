import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  description:
    'Each document is one service. The page URL uses the slug field. Generate the slug from the title and do not change it after publishing — existing links break.',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Name',
      type: 'string',
      validation: (rule) => rule.required(),
      description:
        'Example: General PMS, Engine Diagnostics, Brake Service',
    }),
    defineField({
      name: 'slug',
      title: 'Page URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      description:
        'Click Generate to create automatically from the service name. Do not change after publishing — it will break links.',
    }),
    defineField({
      name: 'icon',
      title: 'Service Icon',
      type: 'string',
      initialValue: 'wrench',
      options: {
        layout: 'radio',
        list: [
          { title: 'Wrench & Tools', value: 'wrench' },
          { title: 'Engine & Diagnostics', value: 'engine' },
          { title: 'Tire & Wheels', value: 'tire' },
          { title: 'Chain & Drive', value: 'chain' },
          { title: 'Brake System', value: 'brake' },
          { title: 'Electrical', value: 'electrical' },
          { title: 'Body & Paint', value: 'body' },
          { title: 'Oil & Fluids', value: 'oil' },
          { title: 'Safety Check', value: 'safety' },
          { title: 'Custom Build', value: 'custom' },
        ],
      },
      description:
        'Icon shown on the service card on the main services page.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description:
        'Shown on the service card. Keep under 120 characters. Example: Complete preventive maintenance for your motorcycle.',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'text',
      rows: 6,
      description:
        'Full text shown on the service detail page. You can write multiple paragraphs — press Enter twice between paragraphs. This replaces the short description on the detail page.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Service Page Photo',
      type: 'image',
      options: { hotspot: true },
      description:
        "Photo shown at the top of this service's page. Wide landscape. Min 1200px wide.",
    }),
    defineField({
      name: 'features',
      title: 'What This Service Includes',
      type: 'array',
      description:
        'Bullet points on the detail page. Each item is one line. Example: Oil and filter change, Chain cleaning and lubrication, Tire pressure check',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Item',
              type: 'string',
              description: 'One short item. Example: Oil and filter change',
            }),
          ],
          preview: {
            select: {
              title: 'text',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button Label',
      type: 'string',
      description:
        'Button on the detail page. Example: Book This Service, Contact Us, Get a Quote. Leave empty to use the default.',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button Link',
      type: 'string',
      description: 'Where button goes. Example: /contact',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
      description:
        'Controls position in the services grid. Lower numbers appear first. 1 appears before 2.',
    }),
  ],
})
