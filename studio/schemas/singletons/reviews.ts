import { StarIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { buttons, linkField, paragraphs, str, txt } from '../lib/fields';

/**
 * /reviews page. The review cards themselves are the "Testimonials" documents
 * (sidebar → Testimonials) — add, edit and reorder them there.
 */
export const reviewsContent = defineType({
  name: 'reviewsContent',
  title: 'Reviews page',
  type: 'document',
  icon: StarIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'reviews', title: '2 · Reviews' },
    { name: 'cta', title: '3 · Closing banner' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    imageField('heroImage', 'Hero photo', 'Split hero photo (portrait, 619×740).', 'hero'),
    str('heroTitle', 'Headline', 'hero'),
    paragraphs('heroParagraphs', 'Intro paragraphs', 'hero'),
    buttons('heroButtons', 'Buttons', 'hero', 'Links starting with https:// open in a new tab.'),

    str('reviewsEyebrow', 'Small label', 'reviews'),
    str('reviewsHeading', 'Heading', 'reviews'),
    txt('reviewsIntro', 'Text under the heading', 'reviews', undefined, 3),
    txt('reviewsFootnote', 'Small note under the reviews (optional)', 'reviews', undefined, 2),
    buttons('reviewsButtons', 'Buttons under the reviews (optional)', 'reviews', 'e.g. “Read more on Google”.'),

    str('ctaTitle', 'Heading', 'cta'),
    txt('ctaSubtitle', 'Text', 'cta'),
    linkField('ctaButton', 'Button', 'cta', 'Links starting with https:// open in a new tab.'),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare: ({ media }) => ({ title: 'Reviews page', subtitle: '/reviews', media }),
  },
});
