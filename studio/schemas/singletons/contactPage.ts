import { defineField, defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';
import { richParagraphs, str, txt } from '../lib/fields';

/** /contact. The form fields are fixed (the message goes to the contact worker); the words around it are editable. */
export const contactPageContent = defineType({
  name: 'contactPageContent',
  title: 'Contact page',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'form', title: '2 · Form' },
    { name: 'locations', title: '3 · Restaurants' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    str('heroTitle', 'Headline', 'hero'),
    txt('heroIntro', 'Intro', 'hero', undefined, 4),

    str('formTitle', 'Heading', 'form'),
    richParagraphs('formIntro', 'Text above the form', 'form', 'Links allowed.'),
    str('formButton', 'Submit button label', 'form', 'The form fields themselves are fixed.'),

    str('asideHeading', 'Heading', 'locations'),
    defineField({
      name: 'locations',
      title: 'Restaurants',
      description: 'Phone number and links come from the site settings in the code.',
      type: 'array',
      group: 'locations',
      of: [
        {
          type: 'object',
          name: 'contactLocation',
          title: 'Restaurant',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
            defineField({ name: 'address', title: 'Address', type: 'string' }),
            defineField({ name: 'kitchenHours', title: 'Kitchen hours', type: 'string' }),
            defineField({ name: 'barHours', title: 'Bar hours', type: 'string' }),
            defineField({ name: 'directionsLabel', title: 'Directions button — screen-reader label', type: 'string' }),
            defineField({ name: 'visitLabel', title: 'View-location button — screen-reader label', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'address' } },
        },
      ],
    }),

    str('seoTitle', 'Page title', 'seo', 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', 'seo', '~155 characters.', 3),
  ],
  preview: { prepare: () => ({ title: 'Contact page', subtitle: '/contact' }) },
});
