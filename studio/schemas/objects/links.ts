import { defineField, defineType } from 'sanity';

/** href accepts an internal path (/menu), a full URL, tel: or mailto:. */
export const hrefField = defineField({
  name: 'href',
  title: 'Link',
  description: 'Page on this site (e.g. /menu) or a full URL (https://…).',
  type: 'string',
  validation: (r) =>
    r.custom((value) => {
      if (!value) return true;
      return /^(\/|#|https?:\/\/|tel:|mailto:)/.test(value) || 'Start with /, https://, tel: or mailto:';
    }),
});

/** Text link / single button — label + destination. */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [defineField({ name: 'text', title: 'Label', type: 'string' }), hrefField],
  preview: { select: { title: 'text', subtitle: 'href' } },
});

/** Button in a list — label + destination + style. */
export const buttonLink = defineType({
  name: 'buttonLink',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Label', type: 'string' }),
    hrefField,
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Solid (primary)', value: 'primary' },
          { title: 'Outline (secondary)', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: { select: { title: 'text', subtitle: 'href' } },
});
