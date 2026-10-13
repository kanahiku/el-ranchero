import { ImageIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { imageField } from '../lib/imageField';

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
