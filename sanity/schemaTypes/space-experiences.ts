import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'spaceExperiences',
  title: 'Our Space and Experience Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section heading',
      type: 'string',
      description:
        'Main title shown above this section on the homepage. Example: Our Space & Experiences',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Short supporting text',
      type: 'string',
      description:
        'Short line shown under the title. Example: Great Coffee, Good Rides, Better Conversations',
    }),
    defineField({
      name: 'items',
      title: 'Cards in this section',
      type: 'array',
      of: [{ type: 'experienceItem' }],
      description:
        'Add the cards shown in this section. Leave empty if you want the website to use its built-in default items.',
      validation: (Rule) => Rule.max(8),
    }),
  ],
})
