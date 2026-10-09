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

export const ingredientsContent = defineType({
  name: 'ingredientsContent',
  title: 'Ingredients',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('heroImage', 'Hero image', 'Hero image for the ingredients page.'),
    imageField(
      'freshLocalProduceImage',
      'Fresh Local Produce image',
      'Image beside the Fresh Local Produce sourcing section.'
    ),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare({ media }) {
      return {
        title: 'Ingredients',
        subtitle: 'Ingredients page images',
        media,
      };
    },
  },
});
