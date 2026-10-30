import type { ComponentType } from 'react';
import { CogIcon, DocumentTextIcon, DocumentsIcon, HomeIcon, PinIcon, ThListIcon } from '@sanity/icons';
import type { StructureBuilder } from 'sanity/structure';

const SINGLETONS: Record<string, string> = {
  siteNavigation: 'singleton-navigation',
  siteFooter: 'singleton-footer',
  homepageContent: 'singleton-homepage',
  aboutContent: 'singleton-about',
  cateringContent: 'singleton-catering',
  locationsContent: 'singleton-locations',
  eventsContent: 'singleton-events',
  reviewsContent: 'singleton-reviews',
  blogIndexContent: 'singleton-blog-index',
  contactPageContent: 'singleton-contact',
  orderOnlineContent: 'singleton-order-online',
  menuPagesContent: 'singleton-menu-pages',
  menuHubContent: 'singleton-menu-hub',
};

/** Menu sub-pages in the same order as the menu hub's category cards. */
const MENU_SUBPAGES: Array<[slug: string, title: string]> = [
  ['breakfast', 'Breakfast'],
  ['burritos', 'Burritos'],
  ['tacos', 'Tacos & Birria'],
  ['entrees', 'Entrees & Fajitas'],
  ['quesadillas-nachos', 'Quesadillas & Nachos'],
  ['specials', 'Specials'],
  ['appetizers-sides', 'Appetizers & Sides'],
  ['kids', 'Kids Menu'],
  ['drinks', 'Drinks & Margaritas'],
];

/** Catering sub-pages in the same order as the catering hub's option list. */
const CATERING_SUBPAGES: Array<[slug: string, title: string]> = [
  ['taco-bar', 'Taco Bar Catering'],
  ['corporate', 'Corporate & Office Catering'],
  ['parties', 'Party Catering'],
  ['large-groups', 'Large Group Catering'],
];

/** Events sub-pages in the same order as the events list on the hub. */
const EVENTS_SUBPAGES: Array<[slug: string, title: string]> = [
  ['taco-tuesday', 'Taco Tuesday'],
  ['karaoke-wednesday', 'Karaoke Wednesday'],
  ['latin-night', 'Saturday Latin Night'],
  ['concerts', 'Live Concerts'],
  ['event-space-rental', 'Event Space Rental'],
];

/** Restaurant pages under /locations. */
const LOCATIONS_SUBPAGES: Array<[slug: string, title: string]> = [
  ['wahiawa', 'Wahiawa'],
  ['kapolei', 'Kapolei'],
];

/** Legal pages (slug = page address). */
const LEGAL_PAGES: Array<[slug: string, title: string]> = [
  ['privacy-policy', 'Privacy Policy'],
  ['terms', 'Terms of Service'],
  ['accessibility', 'Accessibility Statement'],
];

const singleton = (S: StructureBuilder, type: string, id: string, title: string, icon?: ComponentType) =>
  S.listItem()
    .title(title)
    .id(id)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(id).title(title));

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Pages — in the same order as the site navigation.
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              singleton(S, 'homepageContent', 'singleton-homepage', 'Homepage', HomeIcon),
              singleton(S, 'aboutContent', 'singleton-about', 'About'),
              S.listItem()
                .title('Catering')
                .icon(DocumentsIcon)
                .child(
                  S.list()
                    .title('Catering pages')
                    .items([
                      singleton(S, 'cateringContent', 'singleton-catering', 'Catering hub page (/catering)'),
                      ...CATERING_SUBPAGES.map(([slug, title]) =>
                        S.listItem()
                          .title(`↳ ${title}`)
                          .id(`catering-page-${slug}`)
                          .icon(DocumentTextIcon)
                          .child(
                            S.document()
                              .schemaType('cateringSubPage')
                              .documentId(`catering-page-${slug}`)
                              .title(title)
                          )
                      ),
                    ])
                ),
              S.listItem()
                .title('Locations')
                .icon(PinIcon)
                .child(
                  S.list()
                    .title('Locations pages')
                    .items([
                      singleton(S, 'locationsContent', 'singleton-locations', 'Locations hub page (/locations)'),
                      ...LOCATIONS_SUBPAGES.map(([slug, title]) =>
                        S.listItem()
                          .title(`↳ ${title}`)
                          .id(`locations-page-${slug}`)
                          .icon(DocumentTextIcon)
                          .child(
                            S.document()
                              .schemaType('locationsSubPage')
                              .documentId(`locations-page-${slug}`)
                              .title(title)
                          )
                      ),
                    ])
                ),
              S.listItem()
                .title('Events')
                .icon(DocumentsIcon)
                .child(
                  S.list()
                    .title('Events pages')
                    .items([
                      singleton(S, 'eventsContent', 'singleton-events', 'Events hub page (/events)'),
                      ...EVENTS_SUBPAGES.map(([slug, title]) =>
                        S.listItem()
                          .title(`↳ ${title}`)
                          .id(`events-page-${slug}`)
                          .icon(DocumentTextIcon)
                          .child(
                            S.document()
                              .schemaType('eventsSubPage')
                              .documentId(`events-page-${slug}`)
                              .title(title)
                          )
                      ),
                    ])
                ),
              singleton(S, 'reviewsContent', 'singleton-reviews', 'Reviews'),
              singleton(S, 'orderOnlineContent', 'singleton-order-online', 'Order Online'),
              singleton(S, 'contactPageContent', 'singleton-contact', 'Contact'),
              S.listItem()
                .title('Legal pages')
                .icon(DocumentsIcon)
                .child(
                  S.list()
                    .title('Legal pages')
                    .items(
                      LEGAL_PAGES.map(([slug, title]) =>
                        S.listItem()
                          .title(title)
                          .id(`legal-page-${slug}`)
                          .icon(DocumentTextIcon)
                          .child(
                            S.document()
                              .schemaType('legalPage')
                              .documentId(`legal-page-${slug}`)
                              .title(title)
                          )
                      )
                    )
                ),
              S.listItem()
                .title('Menu')
                .icon(ThListIcon)
                .child(
                  S.list()
                    .title('Menu pages')
                    .items([
                      singleton(S, 'menuHubContent', 'singleton-menu-hub', 'Menu hub page (/menu)'),
                      ...MENU_SUBPAGES.map(([slug, title]) =>
                        S.listItem()
                          .title(`↳ ${title}`)
                          .id(`menu-page-${slug}`)
                          .icon(DocumentTextIcon)
                          .child(
                            S.document()
                              .schemaType('menuCategoryPage')
                              .documentId(`menu-page-${slug}`)
                              .title(title)
                          )
                      ),
                      S.divider(),
                      singleton(S, 'menuPagesContent', 'singleton-menu-pages', 'Shared sections (order cards, allergy)'),
                    ])
                ),
            ])
        ),

      // Site-wide chrome shown on every page.
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site settings')
            .items([
              singleton(S, 'siteNavigation', 'singleton-navigation', 'Navigation'),
              singleton(S, 'siteFooter', 'singleton-footer', 'Footer'),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Menu data (dishes & categories)')
        .child(
          S.list()
            .title('Menu data')
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
              S.listItem()
                .title('Meat options ("Choose Your Meat")')
                .schemaType('meatOption')
                .child(
                  S.documentTypeList('meatOption')
                    .title('Meat options')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              singleton(S, 'blogIndexContent', 'singleton-blog-index', 'Blog page (/blog)'),
              S.listItem()
                .title('Blog posts')
                .schemaType('blogPost')
                .child(
                  S.documentTypeList('blogPost')
                    .title('Blog posts')
                    .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
                ),
            ])
        ),

      S.listItem()
        .title('Testimonials (shown on Reviews page & homepage)')
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
