import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'servicesSection',
  title: 'Homepage Services Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomServices',
      title: 'Use this Services section',
      type: 'boolean',
      description:
        'Turn this on to use the content below on the homepage. Turn it off if you want the website to use its built-in default Services section instead.',
      initialValue: true,
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Main heading',
      type: 'string',
      description:
        'The large title shown at the top of the Services section. Example: Motorcycle Services',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Small heading under the title',
      type: 'string',
      description:
        'A short supporting line shown under the main heading. Keep this short and easy to read.',
    }),
    defineField({
      name: 'services',
      title: 'Service cards',
      type: 'array',
      of: [{ type: 'serviceItem' }],
      description:
        'Add the service cards shown in the homepage carousel here. You can drag items to change their order.',
    }),
  ],
})
