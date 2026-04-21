import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'clientTestimonials',
  title: 'Customer Reviews Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Main heading',
      type: 'string',
      description:
        'The large title shown at the top of this section. Example: What Clients Say',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Short supporting text',
      type: 'string',
      description:
        'A short supporting line shown below the main heading. Keep this short and easy to read.',
    }),
    defineField({
      name: 'testimonials',
      title: 'Review cards',
      type: 'array',
      of: [{ type: 'testimonialItem' }],
      description:
        'Add the customer reviews shown in the slider here. You can drag items to change their order. If left empty, the website will use its built-in default reviews.',
    }),
  ],
})
