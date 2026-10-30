import { PinIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { paragraphs, str, txt } from '../lib/fields';
import { locationsBlockTypes } from '../objects/locationsBlocks';

/**
 * /locations hub page. Address, phone, hours, map and DoorDash links of each
 * restaurant live in the code (src/data/locations.ts) because the footer and
 * contact page share them.
 */
export const locationsContent = defineType({
  name: 'locationsContent',
  title: 'Locations hub',
  type: 'document',
  icon: PinIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'cards', title: '2 · Location cards' },
    { name: 'sections', title: '3 · Page sections' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    imageField('heroImage', 'Hero photo', 'Split hero photo (portrait, 619×740).', 'hero'),
    str('heroTitle', 'Headline', 'hero'),
    paragraphs('heroParagraphs', 'Intro paragraphs', 'hero'),

    defineField({
      name: 'cards',
      title: 'Restaurants',
      description: 'One card per restaurant. Drag to reorder.',
      type: 'array',
      group: 'cards',
      of: [{ type: 'locationCard' }],
    }),

    defineField({
      name: 'blocks',
      title: 'Sections under the cards',
      description: 'Add, remove and drag to reorder.',
      type: 'array',
      group: 'sections',
      of: locationsBlockTypes,
    }),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare: ({ media }) => ({ title: 'Locations hub', subtitle: '/locations', media }),
  },
});
