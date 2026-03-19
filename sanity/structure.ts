import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
        ),
      S.listItem()
        .title('Marketing')
        .id('marketing')
        .child(
          S.document()
            .schemaType('marketing')
            .documentId('marketing')
        ),
      S.listItem()
        .title('Services Page')
        .id('servicesPage')
        .child(
          S.document()
            .schemaType('servicesPage')
            .documentId('servicesPage')
        ),
      S.listItem()
        .title('About Page')
        .id('aboutPage')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
        ),
      S.documentTypeListItem('service').title('Services'),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((item: any) =>
          !['homepage', 'marketing', 'servicesPage', 'aboutPage', 'service'].includes(item.getId())
        ),
    ])
