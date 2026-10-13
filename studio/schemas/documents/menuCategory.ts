import { defineField, defineType } from 'sanity';
import { TagIcon } from '@sanity/icons';
import { imageField } from '../lib/imageField';

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menu category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in URLs like /menu/tacos. Must match an existing menu page route — changing it breaks the link.',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    imageField('image', 'Card photo', 'Photo on the category card on the Menu page. Wide cards are 16:9, regular cards 4:3.'),
    imageField(
      'exploreMoreImage',
      'Card photo — "Explore More" (4:3)',
      'Photo on the category card in the "Explore More of Our Menu" grid at the bottom of other menu pages. Falls back to the card photo.'
    ),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first on the full menu.',
      initialValue: 0,
    }),
    defineField({
      name: 'hubSpan',
      title: 'Card width on the Menu page',
      type: 'number',
      description: 'Wide cards take half of the row, regular cards a third.',
      options: {
        list: [
          { title: 'Regular (1/3 width)', value: 4 },
          { title: 'Wide (1/2 width)', value: 6 },
        ],
        layout: 'radio',
      },
      initialValue: 4,
    }),
    defineField({
      name: 'showOnFullMenu',
      title: 'Show on full menu page',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', order: 'order' },
    prepare({ title, slug, order }) {
      return {
        title: title || 'Untitled category',
        subtitle: [`/${slug ?? ''}`, typeof order === 'number' ? `Order ${order}` : undefined]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
});
