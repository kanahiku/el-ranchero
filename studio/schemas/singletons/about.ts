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

export const aboutContent = defineType({
  name: 'aboutContent',
  title: 'About',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('heroImage', 'Hero image', 'Our Story page hero.'),
    imageField('madeFreshDailyImage', 'Made Fresh Daily image', 'Image beside the "Made Fresh Daily" section.'),
    imageField('muralsImage', 'The Murals image', 'Image beside the "The Murals" section.'),
    imageField('givingBackImage', 'Giving Back image', 'Image beside the "Giving Back" section.'),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare({ media }) {
      return {
        title: 'About',
        subtitle: 'Our Story page images',
        media,
      };
    },
  },
});
