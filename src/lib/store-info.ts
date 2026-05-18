export const storeInfo = {
  name: "Sixth Gear Moto Supply Cafe + Lounge",
  shortName: "Sixth Gear Moto Supply",
  address: "3610 Bautista St, Makati City, Metro Manila",
  phone: "0995 093 0157",
  hours: "Monday - Sunday | 10:00 AM - 7:00 PM",
  coordinates: {
    lat: 14.554651468423817,
    lng: 121.00262199651827,
  },
  googleMapsUrl: "https://maps.app.goo.gl/qbVoZTzCk7sBENrN7",
} as const

export const storeMapEmbedUrl = `https://maps.google.com/maps?q=${storeInfo.coordinates.lat},${storeInfo.coordinates.lng}&z=15&output=embed`

export const storeDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${storeInfo.coordinates.lat},${storeInfo.coordinates.lng}`
