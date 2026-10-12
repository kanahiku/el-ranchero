import { defineField, defineType } from 'sanity';
import { TagIcon } from '@sanity/icons';

/** One row of the "Choose Your Meat" table shown on the menu pages. */
export const meatOption = defineType({
  name: 'meatOption',
  title: 'Meat option',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. Carne Asada',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Short plain-English explanation, e.g. "Grilled steak".',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (r) => r.required().integer(),
    }),
    defineField({
      name: 'isAvailable',
      title: 'Currently available',
      type: 'boolean',
      description: 'Turn off to hide this option from every menu page without deleting it.',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'description' },
  },
});
