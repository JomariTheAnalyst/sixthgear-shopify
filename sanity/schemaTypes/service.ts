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
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (rule) => rule.max(70),
      description:
        'Optional search result title. Leave empty to use the service title.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160),
      description:
        'Optional search result description. Leave empty to use the service description.',
    }),
    defineField({
      name: 'socialImage',
      title: 'Social Share Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional OpenGraph/Twitter image for this service page.',
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
      name: 'localContent',
      title: 'Page Content Sections',
      type: 'array',
      description:
        'Main body sections shown on the service detail page. Each section has a heading and a paragraph of body text. Add 2-4 sections per service for best SEO results.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              description:
                'H2 heading for this section. Include the service name and location for SEO. Example: Akrapovic Exhaust Installation in Makati Philippines',
            }),
            defineField({
              name: 'body',
              title: 'Section Body',
              type: 'text',
              rows: 6,
              description:
                'Body text for this section. Write 100-200 words. Include relevant keywords naturally - service name, location (Makati, Philippines, Metro Manila), and bike brands where relevant.',
            }),
          ],
          preview: {
            select: { title: 'heading' },
          },
        }),
      ],
    }),
    defineField({
      name: 'internalLinks',
      title: 'Related Page Links',
      type: 'array',
      description:
        'Internal links shown at the bottom of the service page. Link to related collections, other services, or the contact page. Use keyword-rich link labels.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Link Label',
              type: 'string',
              description:
                'The clickable text. Use descriptive keywords. Example: Akrapovic exhaust Philippines, Preventive maintenance Makati',
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              description:
                'The page path this links to. Example: /collections/akrapovic-exhaust or /services/preventive-maintenance',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        }),
      ],
    }),
    defineField({
      name: 'faqItems',
      title: 'Frequently Asked Questions',
      type: 'array',
      description:
        'FAQ shown on the service detail page and used for FAQ schema (rich results in Google). Add 4-6 questions per service. Write questions exactly as riders would search them.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              description:
                'Write as a real search query. Example: How long does an Akrapovic exhaust installation take in Makati?',
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              description:
                'Direct, helpful answer. 2-4 sentences. Include location and service name where natural.',
            }),
          ],
          preview: {
            select: { title: 'question' },
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
