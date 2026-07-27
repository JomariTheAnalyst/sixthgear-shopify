import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'storeLocation',
  title: 'Store Location and Contact Details',
  type: 'object',
  validation: (Rule) =>
    Rule.custom((value: any) => {
      if (value?.useSanityContent !== true) return true
      const requiredStrings = ['storeName', 'address', 'phone', 'hours', 'googleMapsUrl']
      return requiredStrings.every(
        (field) => typeof value[field] === 'string' && value[field].trim()
      ) || 'Complete every Store Location field before enabling Sanity content.'
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
