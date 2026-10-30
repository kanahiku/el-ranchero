import { CalendarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { linkField, paragraphs, str, txt } from '../lib/fields';
import { eventsBlockTypes } from '../objects/eventsBlocks';

const G = {
  hero: 'hero',
  weekly: 'weekly',
  instagram: 'instagram',
  sections: 'sections',
  list: 'list',
  seo: 'seo',
} as const;

/** The /events page. Tabs follow the page top to bottom. */
export const eventsContent = defineType({
  name: 'eventsContent',
  title: 'Events hub',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: G.hero, title: '1 · Hero', default: true },
    { name: G.weekly, title: '2 · Weekly events' },
    { name: G.instagram, title: '3 · Instagram band' },
    { name: G.sections, title: '4 · Page sections' },
    { name: G.list, title: 'Event list (shared)' },
    { name: G.seo, title: 'SEO' },
  ],
  fields: [
    imageField('heroImage', 'Hero photo', 'Split hero photo.', G.hero),
    str('heroTitle', 'Headline', G.hero),
    paragraphs('heroParagraphs', 'Intro paragraphs', G.hero),
    linkField('heroButton', 'Button', G.hero, 'Links starting with https:// open in a new tab.'),

    str('weeklyHeading', 'Heading', G.weekly),
    defineField({
      name: 'weeklyRows',
      title: 'Weekly table rows',
      type: 'array',
      group: G.weekly,
      of: [
        {
          type: 'object',
          name: 'weeklyRow',
          title: 'Row',
          fields: [
            str('day', 'Day', ''),
            str('event', 'Event', ''),
            str('location', 'Location', ''),
            str('detailsText', 'Details link label', ''),
            str('detailsHref', 'Details link', '', 'Page on this site (/events/…) or a full URL.'),
          ],
          preview: { select: { title: 'day', subtitle: 'event' } },
        },
      ],
    }),
    txt('weeklyNote', 'Note under the table', G.weekly, undefined, 3),
    str('moreOptionsLabel', 'Links row 1 — label', G.weekly),
    defineField({ name: 'moreOptionLinks', title: 'Links row 1', type: 'array', group: G.weekly, of: [{ type: 'link' }] }),
    str('locationInfoLabel', 'Links row 2 — label', G.weekly),
    defineField({ name: 'locationLinks', title: 'Links row 2', type: 'array', group: G.weekly, of: [{ type: 'link' }] }),

    str('instagramHeading', 'Heading', G.instagram),
    txt('instagramText', 'Text', G.instagram),
    linkField('instagramButton', 'Button', G.instagram),
    str('instagramFeedLabel', 'Feed label (for screen readers)', G.instagram),
    defineField({
      name: 'instagramTiles',
      title: 'Photo tiles',
      description: 'Up to 6 square photos, shown until a live Instagram feed is connected.',
      type: 'array',
      group: G.instagram,
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        },
      ],
      validation: (r) => r.max(6),
    }),

    defineField({
      name: 'blocks',
      title: 'Sections under the Instagram band',
      description: 'Add, remove and drag to reorder.',
      type: 'array',
      group: G.sections,
      of: eventsBlockTypes,
    }),

    defineField({
      name: 'eventsList',
      title: 'Events',
      description: 'Feeds the “More Events at El Ranchero” table on every events page. The page you are on shows “You’re here”.',
      type: 'array',
      group: G.list,
      of: [
        {
          type: 'object',
          name: 'eventListItem',
          title: 'Event',
          fields: [
            str('label', 'Name', ''),
            str('href', 'Page link', '', 'e.g. /events/taco-tuesday'),
            str('when', 'When', '', 'e.g. Tuesdays'),
            str('details', 'Short details', ''),
          ],
          preview: { select: { title: 'label', subtitle: 'when' } },
        },
      ],
    }),

    str('seoTitle', 'Page title', G.seo, 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', G.seo, '~155 characters.', 3),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare: ({ media }) => ({ title: 'Events hub', subtitle: '/events', media }),
  },
});
