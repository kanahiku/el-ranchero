import { InfoOutlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { paragraphs, str, txt } from '../lib/fields';
import { locationsBlockTypes } from '../objects/locationsBlocks';

/** /about — "Our Story" page. */
export const aboutContent = defineType({
  name: 'aboutContent',
  title: 'About',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'sections', title: '2 · Page sections' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    imageField('heroImage', 'Hero photo', 'Split hero photo (portrait, 619×740).', 'hero'),
    str('heroTitle', 'Headline', 'hero'),
    paragraphs('heroParagraphs', 'Intro paragraphs', 'hero'),

    defineField({
      name: 'blocks',
      title: 'Sections',
      description: 'Add, remove and drag to reorder.',
      type: 'array',
      group: 'sections',
      of: locationsBlockTypes.filter((block) => block.type === 'locationsTextSplit'),
    }),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare: ({ media }) => ({ title: 'About', subtitle: '/about', media }),
  },
});
