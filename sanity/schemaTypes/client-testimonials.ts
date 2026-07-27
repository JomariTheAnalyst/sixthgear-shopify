import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'clientTestimonials',
  title: 'Customer Reviews Section',
  type: 'object',
  validation: (Rule) =>
    Rule.custom((value: any) => {
      if (value?.useSanityContent !== true) return true
      const complete =
        typeof value.sectionTitle === 'string' && value.sectionTitle.trim() &&
        typeof value.sectionDescription === 'string' && value.sectionDescription.trim() &&
        Array.isArray(value.testimonials) && value.testimonials.length > 0 &&
        value.testimonials.every((item: any) =>
          typeof item?.name === 'string' && item.name.trim() &&
          typeof item?.role === 'string' && item.role.trim() &&
          typeof item?.quote === 'string' && item.quote.trim()
        )
      return Boolean(complete) || 'Complete every testimonial field before enabling Sanity content.'
    }),
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Use Sanity content',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
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
