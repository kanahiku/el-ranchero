import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { menuSectionOptions } from '../documents/menuItem';

/**
 * Sections of a menu category page, in the order editors arrange them.
 * The page code renders each block with the shared widget for its type.
 */

const anchor = defineField({
  name: 'anchor',
  title: 'Section ID',
  description: 'Used for in-page links (e.g. #birria). Lowercase letters and dashes. Change only if you know it is linked.',
  type: 'string',
  validation: (r) => r.regex(/^[a-z0-9-]*$/, { name: 'lowercase-dashes' }).error('Use lowercase letters, numbers and dashes.'),
});

const tone = defineField({
  name: 'tone',
  title: 'Background',
  type: 'string',
  options: {
    list: [
      { title: 'Page cream', value: 'page' },
      { title: 'Tinted card', value: 'card' },
    ],
    layout: 'radio',
  },
  initialValue: 'page',
});

const sectionTitle = (title?: string) => title || 'Untitled section';

export const menuDishList = defineType({
  name: 'menuDishList',
  title: 'Dish list',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro text', type: 'text', rows: 3 }),
    defineField({
      name: 'menuSection',
      title: 'Which dishes to show',
      description:
        'Shows every Menu item on this page that is placed in this section (set on each item under “Menu placement”).',
      type: 'string',
      options: { list: menuSectionOptions, layout: 'dropdown' },
      initialValue: 'main',
    }),
    tone,
    anchor,
  ],
  preview: {
    select: { title: 'title', section: 'menuSection' },
    prepare: ({ title, section }) => ({ title: sectionTitle(title), subtitle: `Dish list · ${section ?? 'main'}` }),
  },
});

export const menuMeatTable = defineType({
  name: 'menuMeatTable',
  title: 'Choose your meat table',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro text', type: 'text', rows: 3 }),
    defineField({ name: 'note', title: 'Note under the table', type: 'text', rows: 3 }),
    tone,
    anchor,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({
      title: sectionTitle(title),
      subtitle: 'Meat table · rows come from Menu → Meat options',
    }),
  },
});

export const menuTextSplit = defineType({
  name: 'menuTextSplit',
  title: 'Text + photo',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
    }),
    defineField({
      name: 'bullets',
      title: 'Bullet list (optional)',
      description: 'Shown after the paragraphs.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'afterBullets',
      title: 'Paragraphs after the bullet list (optional)',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
    }),
    imageField('image', 'Photo', 'Landscape 4:3.'),
    defineField({
      name: 'motif',
      title: 'Decoration',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Plant illustration', value: 'plant' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    tone,
    anchor,
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare: ({ title, media }) => ({ title: sectionTitle(title), subtitle: 'Text + photo', media }),
  },
});

export const menuBlockTypes = [{ type: 'menuDishList' }, { type: 'menuMeatTable' }, { type: 'menuTextSplit' }];
