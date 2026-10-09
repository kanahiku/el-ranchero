import type { StructureBuilder } from 'sanity/structure';

const SINGLETONS: Record<string, string> = {
  siteNavigation: 'singleton-navigation',
  siteFooter: 'singleton-footer',
  homepageContent: 'singleton-homepage',
  aboutContent: 'singleton-about',
  cateringContent: 'singleton-catering',
  locationsContent: 'singleton-locations',
  ingredientsContent: 'singleton-ingredients',
  menuPagesContent: 'singleton-menu-pages',
};

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Navigation')
        .child(S.document().schemaType('siteNavigation').documentId('singleton-navigation').title('Navigation')),

      S.listItem()
        .title('Footer')
        .child(S.document().schemaType('siteFooter').documentId('singleton-footer').title('Footer')),

      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homepageContent').documentId('singleton-homepage').title('Homepage')),

      S.listItem()
        .title('About')
        .child(S.document().schemaType('aboutContent').documentId('singleton-about').title('About')),

      S.listItem()
        .title('Catering')
        .child(S.document().schemaType('cateringContent').documentId('singleton-catering').title('Catering')),

      S.listItem()
        .title('Locations')
        .child(S.document().schemaType('locationsContent').documentId('singleton-locations').title('Locations')),

      S.listItem()
        .title('Ingredients')
        .child(S.document().schemaType('ingredientsContent').documentId('singleton-ingredients').title('Ingredients')),

      S.listItem()
        .title('Menu Pages')
        .child(S.document().schemaType('menuPagesContent').documentId('singleton-menu-pages').title('Menu Pages')),

      S.divider(),

      S.listItem()
        .title('Menu')
        .child(
          S.list()
            .title('Menu')
            .items([
              S.listItem()
                .title('Categories')
                .schemaType('menuCategory')
                .child(
                  S.documentTypeList('menuCategory')
                    .title('Menu categories')
                    .defaultOrdering([
                      { field: 'order', direction: 'asc' },
                      { field: 'title', direction: 'asc' },
                    ])
                ),
              S.listItem()
                .title('Items')
                .schemaType('menuItem')
                .child(
                  S.documentTypeList('menuItem')
                    .title('Menu items')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Blog')
        .schemaType('blogPost')
        .child(
          S.documentTypeList('blogPost')
            .title('Blog posts')
            .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
        ),

      S.listItem()
        .title('Testimonials')
        .schemaType('testimonial')
        .child(
          S.documentTypeList('testimonial')
            .title('Testimonials')
            .defaultOrdering([
              { field: 'order', direction: 'asc' },
              { field: 'name', direction: 'asc' },
            ])
        ),
    ]);

export const singletonTypes = new Set(Object.keys(SINGLETONS));
