import { at, defineMigration, setIfMissing } from 'sanity/migrate'

type SanityDocument = Record<string, unknown> & {
  _id: string
}

function hasPopulatedObject(value: unknown) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value as Record<string, unknown>).length > 0
  )
}

export default defineMigration({
  title: 'Move What We Offer to Homepage and Our Space to About Page',
  documentTypes: ['homepage', 'aboutPage'],
  filter: '_id in ["homepage", "aboutPage"]',
  migrate: {
    async document(document, context) {
    const doc = document as SanityDocument

    if (doc._id === 'homepage') {
      const source = await context.client.fetch<unknown>(
        '*[_type == "aboutPage" && _id == "aboutPage"][0].whatWeOffer'
      )

      if (!hasPopulatedObject(source)) {
        console.warn(
          '[migration] No populated aboutPage.whatWeOffer source was found. Homepage fallback content will remain active.'
        )
        return []
      }

      if (hasPopulatedObject(doc.whatWeOffer)) {
        console.warn(
          '[migration] Conflict: homepage.whatWeOffer is already populated. The migration will not overwrite it.'
        )
        return []
      }

      return at('whatWeOffer', setIfMissing(source))
    }

    const homepage = await context.client.fetch<{
      spaceExperiences?: unknown
      spaceExperience?: unknown
      ourSpaceExperience?: unknown
    } | null>(
      '*[_type == "homepage" && _id == "homepage"][0]{spaceExperiences, spaceExperience, ourSpaceExperience}'
    )

    const legacySource =
      homepage?.ourSpaceExperience ??
      homepage?.spaceExperiences ??
      homepage?.spaceExperience

    if (!hasPopulatedObject(legacySource)) {
      console.warn(
        '[migration] No legacy Homepage space-experience data was found. The About-page fallback will remain active.'
      )
      return []
    }

    if (hasPopulatedObject(doc.ourSpaceExperience)) {
      console.warn(
        '[migration] Conflict: aboutPage.ourSpaceExperience is already populated. The migration will not overwrite it.'
      )
      return []
    }

    const sourceObject = legacySource as Record<string, unknown>
    const migratedSource = {
      ...sourceObject,
      useSanityContent: false,
    }

    return at('ourSpaceExperience', setIfMissing(migratedSource))
    },
  },
})
