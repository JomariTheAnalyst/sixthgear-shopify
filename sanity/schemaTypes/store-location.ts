import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'storeLocation',
  title: 'Store Location and Contact Details',
  type: 'object',
  fields: [
    defineField({
      name: 'storeName',
      title: 'Store name',
      type: 'string',
      description: 'Store name shown in the location section on the homepage.',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description:
        'Address shown to customers in the homepage location section. This updates the text only, not the map pin location.',
    }),
    defineField({
      name: 'phone',
      title: 'Phone number',
      type: 'string',
      description: 'Contact number with spaces for readability. Example: 0995 093 0157',
    }),
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'string',
      description: 'Opening hours display text. Example: Monday - Friday | 9:00 AM - 8:00 PM',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Directions button link',
      type: 'url',
      description: 'Google Maps link used for the Get Directions button.',
    }),
  ],
})
