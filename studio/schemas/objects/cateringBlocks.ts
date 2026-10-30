import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { richParagraphs } from '../lib/fields';

const anchor = defineField({
  name: 'anchor',
  title: 'Section ID',
  description: 'Used for in-page links (e.g. #planning). Lowercase letters and dashes.',
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

const imageSide = defineField({
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
});

const buttonFields = (title: string) =>
  defineField({
    name: 'button',
    title,
    type: 'link',
  });

export const cateringTextSplit = defineType({
  name: 'cateringTextSplit',
  title: 'Text + photo',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    richParagraphs('paragraphs', 'Paragraphs', '', 'Select text to add a link or bold.'),
    buttonFields('Button (optional)'),
    imageField('image', 'Photo', 'Landscape 4:3.'),
    imageSide,
    tone,
    anchor,
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Untitled section', subtitle: 'Text + photo', media }),
  },
});

export const cateringMoreOptions = defineType({
  name: 'cateringMoreOptions',
  title: '“More catering options” list',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      description: 'The list of the other catering pages is added automatically under this text.',
      type: 'text',
      rows: 3,
    }),
    buttonFields('Button'),
    imageField('image', 'Photo', 'Landscape 4:3.'),
    imageSide,
    tone,
    anchor,
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare: ({ title, media }) => ({
      title: title || 'More catering options',
      subtitle: 'Links to the other catering pages',
      media,
    }),
  },
});

export const cateringBlockTypes = [{ type: 'cateringTextSplit' }, { type: 'cateringMoreOptions' }];
