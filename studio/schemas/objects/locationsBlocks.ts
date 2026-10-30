import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { richParagraphs } from '../lib/fields';

const anchor = defineField({
  name: 'anchor',
  title: 'Section ID',
  description: 'Used for in-page links (e.g. #breakfast). Lowercase letters and dashes. Change only if you know it is linked.',
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

export const locationsTextSplit = defineType({
  name: 'locationsTextSplit',
  title: 'Text + photo',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    richParagraphs('paragraphs', 'Paragraphs', '', 'Select text to add a link or bold.'),
    defineField({ name: 'smallPrint', title: 'Small print (optional)', type: 'text', rows: 2 }),
    defineField({
      name: 'address',
      title: 'Street address (optional)',
      description: 'Shown in bold under the paragraphs. One line per row.',
      type: 'text',
      rows: 2,
    }),
    defineField({ name: 'buttons', title: 'Buttons (optional)', type: 'array', of: [{ type: 'buttonLink' }] }),
    imageField('image', 'Photo', 'Landscape 4:3.'),
    defineField({
      name: 'imageSide',
      title: 'Photo side',
      type: 'string',
      options: {
        list: [
          { title: 'Right', value: 'right' },
          { title: 'Left', value: 'left' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    tone,
    anchor,
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Untitled section', subtitle: 'Text + photo', media }),
  },
});

export const locationsFavorites = defineType({
  name: 'locationsFavorites',
  title: 'Favorites grid',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'items',
      title: 'Dishes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'locationFavorite',
          title: 'Dish',
          fields: [
            defineField({ name: 'title', title: 'Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            imageField('image', 'Photo', 'Card photo (4:3).'),
          ],
          preview: { select: { title: 'title', subtitle: 'description', media: 'image' } },
        },
      ],
    }),
    defineField({ name: 'footnote', title: 'Note under the grid', type: 'string' }),
    defineField({ name: 'button', title: 'Button', type: 'link' }),
    tone,
    anchor,
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Favorites', subtitle: 'Favorites grid' }),
  },
});

export const locationsBlockTypes = [{ type: 'locationsTextSplit' }, { type: 'locationsFavorites' }];
