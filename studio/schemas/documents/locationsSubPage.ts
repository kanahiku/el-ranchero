import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { buttons, faqList, linkField, paragraphs, str, txt } from '../lib/fields';
import { locationsBlockTypes } from '../objects/locationsBlocks';

/** One document per restaurant page /locations/<slug> (created by `npm run seed:locations`). */
export const locationsSubPage = defineType({
  name: 'locationsSubPage',
  title: 'Restaurant page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'visit', title: '2 · Visit panel' },
    { name: 'sections', title: '3 · Page sections' },
    { name: 'faqs', title: '4 · FAQs' },
    { name: 'cta', title: '5 · Closing banner' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'pageName', title: 'Page', type: 'string', readOnly: true, description: 'Fixed.' }),
    defineField({ name: 'slug', title: 'URL', type: 'string', readOnly: true, description: 'Fixed — /locations/ plus this value.' }),

    imageField('heroImage', 'Hero photo', 'Split hero photo (portrait, 619×740).', 'hero'),
    str('heroTitle', 'Headline', 'hero'),
    paragraphs('heroParagraphs', 'Intro paragraphs', 'hero'),
    buttons('heroButtons', 'Buttons', 'hero', 'Links starting with https:// open in a new tab.'),

    str(
      'visitTitle',
      'Heading',
      'visit',
      'Address, phone, hours, directions and map under this heading come from the site settings in the code.'
    ),

    defineField({
      name: 'blocks',
      title: 'Sections between the visit panel and the FAQs',
      description: 'Add, remove and drag to reorder.',
      type: 'array',
      group: 'sections',
      of: locationsBlockTypes,
    }),

    str('faqsTitle', 'Heading', 'faqs'),
    faqList('faqs', 'Questions', 'faqs'),

    str('ctaTitle', 'Heading', 'cta'),
    txt('ctaSubtitle', 'Text', 'cta'),
    linkField('ctaButton', 'Button', 'cta', 'Links starting with https:// open in a new tab.'),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: {
    select: { title: 'pageName', slug: 'slug', media: 'heroImage' },
    prepare: ({ title, slug, media }) => ({ title: title || 'Restaurant page', subtitle: `/locations/${slug ?? ''}`, media }),
  },
});
