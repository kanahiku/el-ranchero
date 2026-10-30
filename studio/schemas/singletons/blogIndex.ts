import { defineType } from 'sanity';
import { BookIcon } from '@sanity/icons';
import { linkField, str, txt } from '../lib/fields';

/** /blog — the page that lists posts. Posts themselves are in Blog → Blog posts. */
export const blogIndexContent = defineType({
  name: 'blogIndexContent',
  title: 'Blog page',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'page', title: '1 · Page', default: true },
    { name: 'cta', title: '2 · Closing banner' },
    { name: 'post', title: '3 · Article pages' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    str('heading', 'Heading', 'page'),
    str('emptyText', 'Text when there are no posts', 'page'),

    str('ctaTitle', 'Heading', 'cta'),
    txt('ctaSubtitle', 'Text', 'cta'),
    linkField('ctaButton', 'Button', 'cta'),

    str('backLabel', 'Back link above each article', 'post'),
    str('relatedHeading', 'Heading of the related articles', 'post'),
    str('postCtaTitle', 'Closing banner — heading (all articles)', 'post'),
    txt('postCtaSubtitle', 'Closing banner — text (all articles)', 'post'),
    linkField('postCtaButton', 'Closing banner — button (all articles)', 'post'),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: { prepare: () => ({ title: 'Blog page', subtitle: '/blog' }) },
});
