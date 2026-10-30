import { HomeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { buttons, linkField, paragraphs, str, txt } from '../lib/fields';
import { hrefField } from '../objects/links';

/**
 * Homepage — every editable piece of copy, link and photo on `/`.
 * Tabs follow the page from top to bottom, and fields inside a tab follow the
 * order they appear on the page.
 */
const G = {
  seo: 'seo',
  hero: 'hero',
  breakfast: 'breakfast',
  favorites: 'favorites',
  events: 'events',
  locations: 'locations',
  catering: 'catering',
  privateEvents: 'privateEvents',
  reviews: 'reviews',
  closing: 'closing',
} as const;

export const homepageContent = defineType({
  name: 'homepageContent',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: G.hero, title: '1 · Hero', default: true },
    { name: G.breakfast, title: '2 · Breakfast' },
    { name: G.favorites, title: '3 · Menu favorites' },
    { name: G.events, title: '4 · Weekly events' },
    { name: G.locations, title: '5 · Locations' },
    { name: G.catering, title: '6 · Catering' },
    { name: G.privateEvents, title: '7 · Private events' },
    { name: G.reviews, title: '8 · Reviews' },
    { name: G.closing, title: '9 · Closing banner' },
    { name: G.seo, title: 'SEO' },
  ],
  fields: [
    // ── SEO ────────────────────────────────────────────────────────────
    str('seoTitle', 'Page title', G.seo, 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', G.seo, 'Google result snippet. ~155 characters.', 3),

    // ── 1 · Hero ───────────────────────────────────────────────────────
    imageField('heroImage', 'Background photo', 'Full-width hero photo (1440×760 slot).', G.hero),
    str('heroTitle', 'Headline', G.hero),
    paragraphs('heroParagraphs', 'Intro paragraphs', G.hero),
    buttons('heroActions', 'Buttons', G.hero),
    defineField({
      name: 'heroStats',
      title: 'Stats row',
      description: 'The three highlights under the hero text.',
      type: 'array',
      group: G.hero,
      of: [
        {
          type: 'object',
          name: 'heroStat',
          title: 'Stat',
          fields: [str('value', 'Big text', '', 'e.g. 2015, 2, Daily'), str('label', 'Caption', '')],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // ── 2 · Breakfast ──────────────────────────────────────────────────
    str('breakfastHeading', 'Heading', G.breakfast),
    paragraphs('breakfastParagraphs', 'Paragraphs', G.breakfast),
    linkField('breakfastCta', 'Button', G.breakfast),
    imageField('breakfastImage', 'Photo', 'Landscape 4:3.', G.breakfast),

    // ── 3 · Menu favorites ─────────────────────────────────────────────
    str('favoritesTitle', 'Heading', G.favorites),
    paragraphs('favoritesParagraphs', 'Intro paragraphs', G.favorites),
    linkField('favoritesCta', 'Button', G.favorites),
    defineField({
      name: 'favoritesDishes',
      title: 'Dish tiles',
      description: 'Each tile links to a menu page. Photos are portrait (416×552).',
      type: 'array',
      group: G.favorites,
      of: [
        {
          type: 'object',
          name: 'homeDish',
          title: 'Dish',
          fields: [
            str('title', 'Title', ''),
            imageField('image', 'Photo', 'Portrait 416×552.'),
            paragraphs('paragraphs', 'Description', ''),
            { ...hrefField, title: 'Tile links to' },
          ],
          preview: { select: { title: 'title', media: 'image' } },
        },
      ],
    }),

    // ── 4 · Weekly events ──────────────────────────────────────────────
    str('eventsHeading', 'Heading', G.events),
    txt('eventsBody', 'Intro text', G.events),
    defineField({
      name: 'eventsDays',
      title: 'Days',
      description: 'One card per day, shown in this order.',
      type: 'array',
      group: G.events,
      of: [
        {
          type: 'object',
          name: 'homeEventDay',
          title: 'Day',
          fields: [
            str('day', 'Day', '', 'e.g. Tuesday'),
            defineField({
              name: 'events',
              title: 'Events that day',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'homeEvent',
                  fields: [str('name', 'Event name', ''), txt('description', 'Description', '', undefined, 3)],
                  preview: { select: { title: 'name', subtitle: 'description' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'day' } },
        },
      ],
    }),
    str(
      'eventsFootnoteBefore',
      'Note — text before link',
      G.events,
      'The line under the cards is built as: text before + link + text after.'
    ),
    linkField('eventsFootnoteLink', 'Note — link', G.events),
    str('eventsFootnoteAfter', 'Note — text after link', G.events),
    linkField('eventsCta', 'Button', G.events),

    // ── 5 · Locations ──────────────────────────────────────────────────
    str('locationsTitle', 'Heading', G.locations),
    txt('locationsSubtitle', 'Intro text', G.locations),
    defineField({
      name: 'locationsList',
      title: 'Location cards',
      type: 'array',
      group: G.locations,
      of: [
        {
          type: 'object',
          name: 'homeLocation',
          title: 'Location',
          fields: [
            str('name', 'Name', '', 'e.g. Wahiawa'),
            imageField('image', 'Photo', 'Landscape 4:3.'),
            str('heading', 'Card heading', ''),
            str('shopName', 'Shopping center / venue', ''),
            str('address', 'Address', ''),
            paragraphs('paragraphs', 'Description', ''),
            defineField({
              name: 'hours',
              title: 'Hours lines',
              description: 'One line each, e.g. “Kitchen: 7 AM–10 PM daily”.',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            buttons('actions', 'Buttons', ''),
          ],
          preview: { select: { title: 'name', subtitle: 'address', media: 'image' } },
        },
      ],
    }),

    // ── 6 · Catering ───────────────────────────────────────────────────
    str('cateringHeading', 'Heading', G.catering),
    paragraphs('cateringParagraphs', 'Paragraphs', G.catering),
    linkField('cateringCta', 'Button', G.catering),
    imageField('cateringImage', 'Photo', 'Landscape 4:3.', G.catering),

    // ── 7 · Private events ─────────────────────────────────────────────
    str('privateEventsHeading', 'Heading', G.privateEvents),
    paragraphs('privateEventsParagraphs', 'Paragraphs', G.privateEvents),
    linkField('privateEventsCta', 'Button', G.privateEvents),
    imageField('privateEventsImage', 'Photo', 'Landscape 4:3.', G.privateEvents),

    // ── 8 · Reviews ────────────────────────────────────────────────────
    str('reviewsHeading', 'Heading', G.reviews, 'The review cards themselves are managed under Testimonials.'),

    // ── 9 · Closing banner ─────────────────────────────────────────────
    str('closingTitle', 'Heading', G.closing),
    txt('closingSubtitle', 'Text', G.closing),
    buttons('closingActions', 'Buttons', G.closing, 'Shown left to right.'),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare: ({ media }) => ({ title: 'Homepage', subtitle: 'Copy, links and photos', media }),
  },
});
