import { defineArrayMember, defineField, defineType } from 'sanity';
import { ComposeIcon } from '@sanity/icons';

/**
 * Groups a category page can split its dishes into. The page code decides which
 * of these it renders — keep the values in sync with `src/lib/content/menuSections.ts`.
 */
export const menuSectionOptions = [
  { title: 'Main list', value: 'main' },
  { title: 'Birria (Tacos & Birria)', value: 'birria' },
  { title: 'Daily specials', value: 'daily' },
  { title: 'Weekend specials', value: 'weekend' },
  { title: 'Appetizers', value: 'appetizers' },
  { title: 'Sides', value: 'sides' },
  { title: 'Signature margaritas', value: 'margaritas' },
  { title: 'Other drinks', value: 'other-drinks' },
  { title: 'Quesadillas', value: 'quesadillas' },
  { title: 'Nachos', value: 'nachos' },
];

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu item',
  type: 'document',
  icon: ComposeIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'menu', title: 'Menu placement' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'Separate paragraphs with a blank line.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required().warning('Describe the menu item photo for accessibility and SEO.'),
        }),
      ],
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      group: 'content',
      description: 'Optional small label on the photo, e.g. "New" or "Weekends only".',
    }),
    defineField({
      name: 'note',
      title: 'Short note',
      type: 'string',
      group: 'content',
      description: 'Optional small note beside the title, e.g. "Kapolei only".',
    }),
    defineField({
      name: 'categoryPlacements',
      title: 'Categories',
      type: 'array',
      group: 'menu',
      description: 'Add every category page where this item should appear. Use order to sort within each section.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'categoryPlacement',
          title: 'Category placement',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'reference',
              to: [{ type: 'menuCategory' }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'section',
              title: 'Section on the page',
              type: 'string',
              description:
                'Some category pages split their dishes into groups (e.g. Tacos & Birria). Leave on "Main list" unless the page has more than one group.',
              options: { list: menuSectionOptions, layout: 'dropdown' },
              initialValue: 'main',
            }),
            defineField({
              name: 'order',
              title: 'Order in this section',
              type: 'number',
              initialValue: 0,
            }),
          ],
          preview: {
            select: { title: 'category.title', order: 'order', section: 'section' },
            prepare({ title, order, section }) {
              return {
                title: title || 'Choose category',
                subtitle: [section && section !== 'main' ? section : null, typeof order === 'number' ? `Order ${order}` : null]
                  .filter(Boolean)
                  .join(' · '),
              };
            },
          },
        }),
      ],
      validation: (r) => r.min(1).unique(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'menu',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Vegetarian', value: 'vegetarian' },
              { title: 'Vegan', value: 'vegan' },
              { title: 'Healthy option', value: 'healthy' },
              { title: 'Keiki / kids', value: 'kids' },
              { title: 'Drink', value: 'drink' },
              { title: 'Catering', value: 'catering' },
            ],
          },
        },
      ],
      validation: (r) => r.unique(),
    }),
    defineField({
      name: 'isAvailable',
      title: 'Currently available',
      type: 'boolean',
      group: 'menu',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', media: 'photo', category0: 'categoryPlacements.0.category.title' },
    prepare({ title, media, category0 }) {
      return {
        title: title || 'Untitled menu item',
        subtitle: category0 || 'No category',
        media,
      };
    },
  },
});
