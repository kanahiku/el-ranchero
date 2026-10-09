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
    imageField('directoryImage', 'Locations directory hero image', 'Hero image for the main locations page.'),
    imageField('kailuaImage', 'Kailua hero image', 'Hero image for the Kailua location page.'),
    imageField('kahalaImage', 'Kahala hero image', 'Hero image for the Kahala location page.'),
    imageField('kaneoheImage', 'Kaneohe hero image', 'Hero image for the Kaneohe location page.'),
    imageField('kapoleiImage', 'Kapolei hero image', 'Hero image for the Kapolei location page.'),
    imageField('mililaniImage', 'Mililani hero image', 'Hero image for the Mililani location page.'),
    imageField('pearlridgeImage', 'Pearlridge hero image', 'Hero image for the Pearlridge location page.'),
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
