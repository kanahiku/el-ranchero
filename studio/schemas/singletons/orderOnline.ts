import { defineType } from 'sanity';
import { BasketIcon } from '@sanity/icons';
import { buttons, linkField, paragraphs, str, txt } from '../lib/fields';
import { defineField } from 'sanity';

/** /order-online. */
export const orderOnlineContent = defineType({
  name: 'orderOnlineContent',
  title: 'Order Online page',
  type: 'document',
  icon: BasketIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'cards', title: '2 · Choose a restaurant' },
    { name: 'phone', title: '3 · Order by phone' },
    { name: 'cta', title: '4 · Closing banner' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    str('heroTitle', 'Headline', 'hero'),
    paragraphs('heroParagraphs', 'Intro paragraphs', 'hero'),

    str('chooseTitle', 'Heading', 'cards'),
    defineField({
      name: 'cards',
      title: 'Restaurants',
      description: 'One card per restaurant, with its storefront photo and ordering buttons.',
      type: 'array',
      group: 'cards',
      of: [{ type: 'locationCard' }],
    }),
    txt('note', 'Note under the cards', 'cards', undefined, 2),

    str('phoneHeading', 'Heading', 'phone'),
    txt('phoneText', 'Text', 'phone', undefined, 3),
    buttons('phoneButtons', 'Call buttons', 'phone'),

    str('ctaTitle', 'Heading', 'cta'),
    txt('ctaSubtitle', 'Text', 'cta'),
    linkField('ctaButton', 'Button', 'cta'),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: { prepare: () => ({ title: 'Order Online page', subtitle: '/order-online' }) },
});
