import { defineField, defineType } from 'sanity';
import { CommentIcon } from '@sanity/icons';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'name',
      title: 'Reviewer Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Attribution / Location',
      type: 'string',
      description: 'Shown under the name, e.g. "Google Review" or "Kailua".',
    }),
    defineField({
      name: 'platform',
      title: 'Review Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'Yelp', value: 'yelp' },
        ],
        layout: 'radio',
      },
      initialValue: 'google',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the carousel.',
      initialValue: 0,
      validation: (r) => r.required().integer(),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      platform: 'platform',
      quote: 'quote',
    },
    prepare({ title, platform, quote }) {
      return {
        title: title || 'Untitled',
        subtitle: `${platform ?? 'google'} · ${quote?.slice(0, 60)}…`,
      };
    },
  },
});
