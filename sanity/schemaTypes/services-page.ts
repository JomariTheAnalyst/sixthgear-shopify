import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero section',
      type: 'object',
      description:
        'This controls the large banner at the top of the Services page.',
      fields: [
        defineField({
          name: 'title',
          title: 'Main heading',
          type: 'string',
          description:
            'The large title shown on the banner. Example: Our Services',
        }),
        defineField({
          name: 'shortTitle',
          title: 'Short title for breadcrumb',
          type: 'string',
          description:
            'A shorter version of the title used in page navigation when needed. Example: Services',
        }),
        defineField({
          name: 'description',
          title: 'Short description',
          type: 'text',
          rows: 3,
          description:
            'A short paragraph shown under the title on the banner. Keep this concise so it stays easy to read.',
        }),
        defineField({
          name: 'heroImage',
          title: 'Background image',
          type: 'image',
          options: { hotspot: true },
          description:
            'Main banner image shown behind the text. Use a wide landscape image. Recommended size: at least 2000 x 1200 pixels.',
        }),
        defineField({
          name: 'image',
          title: 'Fallback image',
          type: 'image',
          options: { hotspot: true },
          description:
            'Backup image used if the main background image is missing. You can upload the same image here as a safety fallback.',
        }),
      ],
    }),
    defineField({
      name: 'expertiseStats',
      title: 'Expertise stats section',
      type: 'object',
      description:
        'This controls the section below the hero with the main text, button, and the stat cards on the right.',
      fields: [
        defineField({
          name: 'sectionHeading',
          title: 'Section heading',
          type: 'text',
          rows: 2,
          description:
            'The large heading shown on the left side of this section. You can press Enter if you want the heading to break into two lines.',
        }),
        defineField({
          name: 'sectionDescription',
          title: 'Section description',
          type: 'text',
          rows: 4,
          description:
            'The short paragraph shown under the heading. Keep it clear and easy to scan.',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button text',
          type: 'string',
          description:
            'Text shown on the button in this section. Example: Book a Service',
        }),
        defineField({
          name: 'buttonLink',
          title: 'Button link',
          type: 'string',
          description:
            'Where the button should go when clicked. Example: /contact. Use a website path that starts with a forward slash.',
        }),
        defineField({
          name: 'stats',
          title: 'Stat cards',
          type: 'array',
          description:
            'Add the stat cards shown on the right side of this section. You can drag them to change the order.',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'number',
                  title: 'Stat number',
                  type: 'string',
                  description:
                    'The large number or value shown on the card. Examples: 8, 45+, 100%, 24/7',
                }),
                defineField({
                  name: 'label',
                  title: 'Stat label',
                  type: 'string',
                  description:
                    'The short label shown below the number. Keep it short so it fits nicely on the card.',
                }),
              ],
              preview: {
                select: {
                  title: 'number',
                  subtitle: 'label',
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'brandsWeService',
      title: 'Brands we service section',
      type: 'object',
      description:
        'This controls the section that shows the motorcycle brands your workshop services. You can update the heading and manage the logos shown in the row below it.',
      fields: [
        defineField({
          name: 'sectionHeading',
          title: 'Section heading',
          type: 'string',
          description:
            'The main title shown above the brand logos. Example: Brands We Service',
        }),
        defineField({
          name: 'brands',
          title: 'Brand items',
          type: 'array',
          description:
            'Add the brand logos shown in this section. You can drag items to change the order, add new ones, or remove brands you no longer want to show.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'name',
                  title: 'Brand name',
                  type: 'string',
                  description:
                    'The brand name used for the logo label and image description. Example: BMW',
                }),
                defineField({
                  name: 'logo',
                  title: 'Brand logo',
                  type: 'image',
                  options: { hotspot: false },
                  description:
                    'Upload the logo image shown in the Brands We Service section on the Services page. Use a clean logo with a transparent background when possible.',
                }),
              ],
              preview: {
                select: {
                  title: 'name',
                  media: 'logo',
                },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'servicesGrid',
      title: 'Services grid section',
      type: 'object',
      description:
        'This controls the heading shown above the service cards on the Services page. The service cards themselves still come from the existing service data.',
      fields: [
        defineField({
          name: 'sectionHeading',
          title: 'Section heading',
          type: 'string',
          description:
            'The main title shown above the service card grid. Keep it short so it stays strong and readable on all screen sizes.',
        }),
        defineField({
          name: 'useCustomServices',
          title: 'Use Custom Service Order',
          type: 'boolean',
          initialValue: false,
          description:
            'Turn ON to hand-pick which services appear and in what order using the list below. Turn OFF to automatically show all published services sorted by their Display Order number.',
        }),
        defineField({
          name: 'featuredServices',
          title: 'Featured Services',
          type: 'array',
          description:
            'Only active when Use Custom Service Order is ON. Click Add to select a service. Drag items to change their order. Only these services will appear in the grid.',
          of: [
            defineArrayMember({
              type: 'reference',
              to: [{ type: 'service' }],
            }),
          ],
        }),
      ],
    }),
  ],
})
