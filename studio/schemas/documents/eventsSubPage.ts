import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { linkField, paragraphs, str, txt } from '../lib/fields';
import { eventsBlockTypes } from '../objects/eventsBlocks';

/** One document per /events/<slug> page (created by `npm run seed:events`). */
export const eventsSubPage = defineType({
  name: 'eventsSubPage',
  title: 'Events sub-page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'sections', title: '2 · Page sections' },
    { name: 'more', title: '3 · More events' },
    { name: 'cta', title: '4 · Closing banner' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'pageName', title: 'Page', type: 'string', readOnly: true, description: 'Fixed.' }),
    defineField({ name: 'slug', title: 'URL', type: 'string', readOnly: true, description: 'Fixed — /events/ plus this value.' }),

    imageField('heroImage', 'Hero photo', 'Split hero photo.', 'hero'),
    str('heroTitle', 'Headline', 'hero'),
    paragraphs('heroParagraphs', 'Intro paragraphs', 'hero'),
    linkField('heroButton', 'Button', 'hero', 'Links starting with https:// open in a new tab.'),

    defineField({
      name: 'blocks',
      title: 'Sections between the hero and “More events”',
      description: 'Add, remove and drag to reorder.',
      type: 'array',
      group: 'sections',
      of: eventsBlockTypes,
    }),

    str('moreHeading', 'Heading', 'more'),
    txt('moreIntro', 'Text', 'more', 'The event table comes from Events hub → Event list.', 3),
    defineField({
      name: 'moreTone',
      title: 'Background',
      type: 'string',
      group: 'more',
      options: {
        list: [
          { title: 'Page cream', value: 'page' },
          { title: 'Tinted card', value: 'card' },
        ],
        layout: 'radio',
      },
      initialValue: 'page',
    }),
    linkField('moreButton', 'Button', 'more'),

    str('ctaTitle', 'Heading', 'cta'),
    txt('ctaSubtitle', 'Text', 'cta'),
    linkField('ctaButton', 'Button', 'cta', 'Links starting with https:// open in a new tab.'),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: {
    select: { title: 'pageName', slug: 'slug', media: 'heroImage' },
    prepare: ({ title, slug, media }) => ({ title: title || 'Events page', subtitle: `/events/${slug ?? ''}`, media }),
  },
});
