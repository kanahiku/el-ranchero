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

export const locationsContent = defineType({
  name: 'locationsContent',
  title: 'Locations',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('directoryImage', 'Locations hub hero image', 'Hero image for the main Locations page.'),
    imageField('wahiawaImage', 'Wahiawa hero image', 'Hero image for the Wahiawa location page.'),
    imageField('kapoleiImage', 'Kapolei hero image', 'Hero image for the Kapolei location page.'),
  ],
  preview: {
    select: { media: 'directoryImage' },
    prepare({ media }) {
      return {
        title: 'Locations',
        subtitle: 'Location page images',
        media,
      };
    },
  },
});
