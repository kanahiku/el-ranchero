import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { richParagraphs } from '../lib/fields';

const anchor = defineField({
  name: 'anchor',
  title: 'Section ID',
  description: 'Used for in-page links (e.g. #inquiry). Lowercase letters and dashes. Change only if you know it is linked.',
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

export const eventsTextSplit = defineType({
  name: 'eventsTextSplit',
  title: 'Text + photo',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    richParagraphs('paragraphs', 'Paragraphs', '', 'Select text to add a link or bold.'),
    defineField({ name: 'smallPrint', title: 'Small print (optional)', type: 'text', rows: 2 }),
    defineField({
      name: 'links',
      title: 'Row of links (optional)',
      description: 'Shown under the paragraphs, separated by “|”.',
      type: 'array',
      of: [{ type: 'link' }],
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons (optional)',
      type: 'array',
      of: [{ type: 'buttonLink' }],
    }),
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

export const eventsDetailsTable = defineType({
  name: 'eventsDetailsTable',
  title: 'Details table',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'eventDetailRow',
          title: 'Row',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. When' }),
            defineField({ name: 'info', title: 'Info', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'label', subtitle: 'info' } },
        },
      ],
    }),
    defineField({ name: 'note', title: 'Note under the table (optional)', type: 'text', rows: 2 }),
    defineField({
      name: 'links',
      title: 'Links under the table (optional)',
      type: 'array',
      of: [{ type: 'link' }],
    }),
    tone,
    anchor,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Details table', subtitle: 'Details table' }),
  },
});

export const eventsInquiryForm = defineType({
  name: 'eventsInquiryForm',
  title: 'Inquiry form',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Text above the form', type: 'text', rows: 4 }),
    defineField({ name: 'messageLabel', title: 'Message box label', type: 'string' }),
    defineField({ name: 'buttonLabel', title: 'Submit button label', type: 'string' }),
    richParagraphs('footnote', 'Small text under the form', '', 'Links allowed.'),
    anchor,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({
      title: title || 'Inquiry form',
      subtitle: 'Form fields are fixed; labels are editable',
    }),
  },
});

export const eventsBlockTypes = [{ type: 'eventsTextSplit' }, { type: 'eventsDetailsTable' }, { type: 'eventsInquiryForm' }];
