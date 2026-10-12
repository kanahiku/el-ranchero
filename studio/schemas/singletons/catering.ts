import { ImageIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

const imageField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        validation: (r) => r.required().warning('Describe the image for accessibility and SEO.'),
      }),
    ],
  });

export const cateringContent = defineType({
  name: 'cateringContent',
  title: 'Catering',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('menuImage', 'Catering page hero image', 'Hero image for the catering page.'),
  ],
  preview: {
    select: { media: 'menuImage' },
    prepare({ media }) {
      return {
        title: 'Catering',
        subtitle: 'Catering page images',
        media,
      };
    },
  },
});
