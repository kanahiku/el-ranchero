import { defineField, defineType } from 'sanity';
import { metaDescriptionLength, metaTitleLength, validJsonLd } from '../../lib/validation';

/** One SEO panel for every page: meta, canonical, noindex, social card, schema override. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'title', title: 'Meta title', type: 'string', validation: metaTitleLength }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: metaDescriptionLength,
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      description: 'Leave empty to use the page URL.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'shareTitle', title: 'Social share title', type: 'string' }),
    defineField({ name: 'shareDescription', title: 'Social share text', type: 'text', rows: 2 }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      description: '1200 × 630 recommended.',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'schemaMode',
      title: 'Structured data (JSON-LD)',
      type: 'string',
      options: {
        list: [
          { title: 'Use automatic schema', value: 'auto' },
          { title: 'Add custom schema to the automatic one', value: 'extend' },
          { title: 'Replace automatic schema with custom', value: 'replace' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'schemaOverride',
      title: 'Custom schema (JSON)',
      type: 'text',
      rows: 10,
      description: 'Paste valid JSON-LD. Checked for valid JSON before publishing.',
      hidden: ({ parent }) => !parent?.schemaMode || parent.schemaMode === 'auto',
      validation: validJsonLd,
    }),
  ],
});
