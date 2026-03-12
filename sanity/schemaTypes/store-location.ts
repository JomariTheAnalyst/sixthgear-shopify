import { defineField, defineType } from 'sanity'

// Business information for the store location section. The Google Maps embed and coordinates are hardcoded in the frontend — only update the display text and directions URL here.
// WARNING: Do not add coordinate fields. The map iframe is separate from this data and must be updated in code.

export default defineType({
  name: 'storeLocation',
  title: 'Store Location',
  type: 'object',
  fields: [
    defineField({
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      description: 'Full store name shown in the info card. Default: Sixth Gear Moto Supply Café + Lounge',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Display address shown to customers. Default: 3610 Bautista St, Makati City, Metro Manila. NOTE: Changing this does NOT move the map pin — contact your developer to update the map coordinates.',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Contact number with spaces for readability. Example: 0995 093 0157',
    }),
    defineField({
      name: 'hours',
      title: 'Store Hours',
      type: 'string',
      description: 'Opening hours display text. Example: Monday - Friday | 9:00 AM - 8:00 PM',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
      description: 'The Google Maps short link for the Get Directions button. Get this from Google Maps by clicking Share and copying the short link. Current: https://maps.app.goo.gl/MAiATmPJ3BmQYXoH7',
    }),
  ],
})
