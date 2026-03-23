import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      description:
        'This controls the large banner at the top of the About page. Use it to update the main heading, supporting text, and background image visitors see first.',
      fields: [
        defineField({
          name: 'title',
          title: 'Page Heading',
          type: 'string',
          description:
            'This is the main headline shown in large text on the About page hero. Keep it short and clear so it stays readable over the image.',
        }),
        defineField({
          name: 'description',
          title: 'Short Description',
          type: 'text',
          rows: 3,
          description:
            'This short paragraph appears below the page heading in the hero banner. Keep it concise so it remains easy to read on mobile and desktop.',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          description:
            'This image fills the hero banner behind the text on the About page. Use a wide landscape image, ideally at least 2000 x 1200 pixels, and leave enough darker space for the text to stay readable. If you leave this empty, the website will use its built-in fallback image.',
        }),
      ],
    }),
    defineField({
      name: 'story',
      title: 'Our Story',
      type: 'array',
      description:
        'The story cards shown in the Our Story section. Each card has a heading, text, and photo. Drag to reorder.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'The bold title for this story card.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body Text',
              type: 'text',
              rows: 4,
              description: 'The main paragraph. 2-3 sentences works best.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              description:
                'The image shown beside the text. Landscape format recommended.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imageAlt',
              title: 'Image Description',
              type: 'string',
              description:
                'A short description of the photo for accessibility. Example: Sixthgear workshop with mechanics working on a motorcycle.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'body',
              media: 'image',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'whatWeOffer',
      title: 'What We Offer',
      type: 'object',
      description:
        'The section showing the four main things SixthGearMoto offers — services, parts, gear, and café.',
      fields: [
        defineField({
          name: 'sectionName',
          title: 'Section Label',
          type: 'string',
          description:
            'The small text above the heading. Example: What We Offer',
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'text',
          rows: 2,
          description:
            'The large bold heading for this section. Example: Complete Care for Your Ride',
        }),
        defineField({
          name: 'cards',
          title: 'Offer Cards',
          type: 'array',
          description:
            'The cards shown in this section. Each card has a title, photo, and a button linking to a page. Drag to reorder.',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Card Title',
                  type: 'string',
                  description:
                    'The title shown on the card. Example: Motorcycle Service & Diagnostics',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'backgroundImage',
                  title: 'Background Photo',
                  type: 'image',
                  options: { hotspot: true },
                  description:
                    'The photo behind the card title. Landscape format works best. Minimum 800px wide.',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'buttonText',
                  title: 'Button Text',
                  type: 'string',
                  description:
                    'The text on the card button. Example: DISCOVER, SHOP',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'linkUrl',
                  title: 'Button Link',
                  type: 'string',
                  description:
                    'Where the button goes when clicked. Example: /services, /store, /first-gear',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'linkUrl',
                  media: 'backgroundImage',
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'ourValues',
      title: 'Our Values',
      type: 'object',
      description:
        'The values section on the About page showing what SixthGearMoto stands for.',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          description:
            'The bold heading above the value cards. Example: Our Values',
        }),
        defineField({
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 3,
          description:
            'The short paragraph below the heading. 1-2 sentences that summarize your values.',
        }),
        defineField({
          name: 'cards',
          title: 'Value Cards',
          type: 'array',
          description:
            'The individual value cards shown in this section. Each card has a title, description, and icon. Drag to reorder.',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  description:
                    'The name of this value. Example: Precision & Expertise',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 4,
                  description:
                    'A short explanation of this value. 2-3 sentences works best.',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Tools & Craftsmanship', value: 'wrench' },
                      { title: 'Community & People', value: 'users' },
                      { title: 'Quality & Protection', value: 'shield' },
                      { title: 'Coffee & Experience', value: 'coffee' },
                      { title: 'Energy & Passion', value: 'energy' },
                      { title: 'Award & Trust', value: 'award' },
                    ],
                  },
                  description:
                    'Pick the icon that best represents this value. This icon appears on the card in the website.',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'icon',
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'whyChooseUs',
      title: 'Why Choose Us',
      type: 'object',
      description:
        'The section explaining why riders trust SixthGearMoto. Shows a list of reasons on the left and two overlapping photos on the right.',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          description:
            'The small text above the main heading. Example: Why Sixth Gear',
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description:
            'The main section title. Example: Why Choose Us?',
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          description:
            'The paragraph below the heading. 2-3 sentences.',
        }),
        defineField({
          name: 'items',
          title: 'Feature List',
          type: 'array',
          description:
            'The list of reasons with icons. Drag to reorder.',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  description:
                    'The name of this reason. Example: Expert Workshop',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                  description:
                    'Short explanation. 1 sentence works best.',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Expert Workshop', value: 'wrench' },
                      { title: 'Quality Gear', value: 'shield' },
                      { title: 'Rider Community', value: 'users' },
                      { title: 'Coffee & Lounge', value: 'coffee' },
                    ],
                  },
                  description:
                    'Pick the icon shown next to this reason.',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'icon',
                },
              },
            },
          ],
        }),
        defineField({
          name: 'topImage',
          title: 'Top Photo',
          type: 'image',
          options: { hotspot: true },
          description:
            'The upper photo shown on the right side (desktop only). Landscape format works best.',
        }),
        defineField({
          name: 'topImageAlt',
          title: 'Top Photo Description',
          type: 'string',
          description:
            "Accessibility text for the top photo. Describe what's in the image.",
        }),
        defineField({
          name: 'bottomImage',
          title: 'Bottom Photo',
          type: 'image',
          options: { hotspot: true },
          description:
            'The lower overlapping photo shown on the right side. Landscape format works best.',
        }),
        defineField({
          name: 'bottomImageAlt',
          title: 'Bottom Photo Description',
          type: 'string',
          description:
            'Accessibility text for the bottom photo.',
        }),
      ],
    }),
    defineField({
      name: 'ceoQuote',
      title: 'CEO Quote',
      type: 'object',
      description:
        'The quote section near the bottom of the About page featuring a message from the founder.',
      fields: [
        defineField({
          name: 'quoteText',
          title: 'Quote',
          type: 'text',
          rows: 4,
          description:
            'The full quote text. This is the main message shown in large text. 2-3 sentences works best.',
        }),
        defineField({
          name: 'highlightedPhrase',
          title: 'Highlighted Words',
          type: 'string',
          description:
            'The exact words from the quote that should be highlighted in orange. Must match the quote text exactly — copy and paste from the quote to be safe. If left empty, no words are highlighted.',
        }),
        defineField({
          name: 'ceoName',
          title: 'Name',
          type: 'string',
          description:
            "The person's name shown below the quote. Example: John Doe",
        }),
        defineField({
          name: 'ceoTitle',
          title: 'Title',
          type: 'string',
          description:
            'Their role or position. Example: Founder & CEO, SixthGearMoto',
        }),
        defineField({
          name: 'ceoPhoto',
          title: 'Photo',
          type: 'image',
          options: { hotspot: true },
          description:
            'A portrait photo of the person. Square format works best.',
        }),
        defineField({
          name: 'ceoPhotoDescription',
          title: 'Photo Description',
          type: 'string',
          description:
            'A short description of the photo for accessibility. Example: Portrait of John Doe, founder of SixthGearMoto, standing in the workshop.',
        }),
      ],
    }),
  ],
})
