import { defineField, defineType } from 'sanity';
import { requiredAlt } from '../../lib/validation';

/** Reusable image with hotspot and alt text that blocks publish when missing. */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for accessibility and image search. Decorative images: enter a single space.',
      validation: requiredAlt,
    }),
  ],
});
