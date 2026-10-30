import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { buttons, linkField, paragraphs, str, txt } from '../lib/fields';
import { menuBlockTypes } from '../objects/menuBlocks';

/**
 * One document per /menu/<slug> page (created by `npm run seed:menu-pages`).
 * The page URL is fixed, so these cannot be created or deleted from the Studio.
 */
export const menuCategoryPage = defineType({
  name: 'menuCategoryPage',
  title: 'Menu category page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'sections', title: '2 · Page sections' },
    { name: 'order', title: '3 · Order block' },
    { name: 'more', title: '4 · Explore more' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'pageName',
      title: 'Page',
      type: 'string',
      readOnly: true,
      description: 'Fixed — identifies which page this document controls.',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'string',
      readOnly: true,
      description: 'Fixed — /menu/ plus this value.',
    }),

    imageField('heroImage', 'Hero photo', 'Split hero photo.', 'hero'),
    str('heroTagline', 'Small line above the headline (optional)', 'hero'),
    str('heroTitle', 'Headline', 'hero'),
    paragraphs('heroParagraphs', 'Intro paragraphs', 'hero'),
    buttons('heroActions', 'Buttons', 'hero'),

    defineField({
      name: 'blocks',
      title: 'Sections between the hero and the order block',
      description:
        'Add, remove and drag to reorder. Dishes themselves are edited under Menu → Items; this only controls headings, intros and layout.',
      type: 'array',
      group: 'sections',
      of: menuBlockTypes,
    }),

    str('orderTitle', 'Heading', 'order'),
    txt('orderSubtitle', 'Text', 'order', 'The restaurant cards and DoorDash buttons are shared — see Pages → Menu → Shared sections.', 3),

    str('moreTitle', 'Heading', 'more'),
    txt('moreSubtitle', 'Text', 'more', 'The category cards come from Menu → Categories.', 3),
    linkField('moreCta', 'Button', 'more'),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: {
    select: { title: 'pageName', slug: 'slug', media: 'heroImage' },
    prepare: ({ title, slug, media }) => ({ title: title || 'Menu page', subtitle: `/menu/${slug ?? ''}`, media }),
  },
});
