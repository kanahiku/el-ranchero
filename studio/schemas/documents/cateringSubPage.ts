import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { faqList, linkField, paragraphs, str, txt } from '../lib/fields';
import { cateringBlockTypes } from '../objects/cateringBlocks';

/** One document per /catering/<slug> page (created by `npm run seed:catering`). */
export const cateringSubPage = defineType({
  name: 'cateringSubPage',
  title: 'Catering sub-page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'sections', title: '2 · Page sections' },
    { name: 'faqs', title: '3 · FAQs' },
    { name: 'cta', title: '4 · Closing banner' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'pageName', title: 'Page', type: 'string', readOnly: true, description: 'Fixed.' }),
    defineField({ name: 'slug', title: 'URL', type: 'string', readOnly: true, description: 'Fixed — /catering/ plus this value.' }),

    imageField('heroImage', 'Hero photo', 'Portrait 619×740.', 'hero'),
    str('heroTitle', 'Headline', 'hero'),
    paragraphs('heroParagraphs', 'Intro paragraphs', 'hero'),
    linkField('heroButton', 'Button', 'hero', 'Usually points to the request form: /catering#catering-form'),

    defineField({
      name: 'blocks',
      title: 'Sections between the hero and the FAQs',
      description: 'Add, remove and drag to reorder.',
      type: 'array',
      group: 'sections',
      of: cateringBlockTypes,
    }),

    str('faqsTitle', 'Heading', 'faqs'),
    faqList('faqs', 'Questions', 'faqs'),

    str('ctaTitle', 'Heading', 'cta'),
    txt('ctaSubtitle', 'Text', 'cta'),
    linkField('ctaButton', 'Button', 'cta'),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: {
    select: { title: 'pageName', slug: 'slug', media: 'heroImage' },
    prepare: ({ title, slug, media }) => ({ title: title || 'Catering page', subtitle: `/catering/${slug ?? ''}`, media }),
  },
});
