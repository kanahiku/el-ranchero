import { defineField, defineType } from 'sanity';

export const siteNavigation = defineType({
  name: 'siteNavigation',
  title: 'Navigation',
  type: 'document',
  // Prevent creating multiple navigation documents
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'links',
      title: 'Navigation Links',
      description: 'Top-level nav items. Each can have sub-links for dropdown menus.',
      type: 'array',
      of: [{ type: 'navLink' }],
    }),
    defineField({
      name: 'phone',
      title: 'Header phone',
      description: 'Phone number shown in the header.',
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Display number', type: 'string' }),
        defineField({ name: 'href', title: 'tel: URL', type: 'string' }),
      ],
    }),
    defineField({
      name: 'actions',
      title: 'CTA Buttons (optional)',
      description: 'Buttons shown in the nav bar (e.g. "Get a Quote").',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'text', title: 'Button Label', type: 'string' }),
            defineField({ name: 'href', title: 'URL', type: 'string' }),
            defineField({
              name: 'variant',
              title: 'Style',
              type: 'string',
              options: { list: ['primary', 'secondary', 'ghost-light', 'ghost-dark'] },
              initialValue: 'primary',
            }),
          ],
          preview: { select: { title: 'text' } },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' };
    },
  },
});
