import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { linkField, richParagraphs, str, stringList, txt } from '../lib/fields';

/** One document per legal page (/privacy-policy, /terms, /accessibility). Created by `npm run seed:legal`. */
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'sections', title: '2 · Sections' },
    { name: 'cta', title: '3 · Closing banner' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'pageName', title: 'Page', type: 'string', readOnly: true, description: 'Fixed.' }),
    defineField({ name: 'slug', title: 'URL', type: 'string', readOnly: true, description: 'Fixed — the page address.' }),

    str('heroTitle', 'Headline', 'hero'),
    txt('heroIntro', 'Intro / last-updated line', 'hero', undefined, 3),

    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Add, remove and drag to reorder. Numbering in headings (e.g. “1.”) is typed by hand.',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          name: 'legalSection',
          title: 'Section',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            richParagraphs('body', 'Paragraphs', '', 'Select text to add a link or bold.'),
            stringList('bullets', 'Bullet list (optional)', '', 'Shown under the paragraphs.'),
            richParagraphs('closing', 'Paragraphs after the bullets (optional)', ''),
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    }),

    str('ctaTitle', 'Heading', 'cta'),
    txt('ctaSubtitle', 'Text', 'cta'),
    linkField('ctaButton', 'Button', 'cta'),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: {
    select: { title: 'pageName', slug: 'slug' },
    prepare: ({ title, slug }) => ({ title: title || 'Legal page', subtitle: `/${slug ?? ''}` }),
  },
});
