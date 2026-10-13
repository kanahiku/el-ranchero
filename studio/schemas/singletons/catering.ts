import { ImageIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { imageField } from '../lib/imageField';

export const cateringContent = defineType({
  name: 'cateringContent',
  title: 'Catering',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('heroImage', 'Hero image', 'Hero photo for the Catering page (portrait, 619×740).'),
    imageField('favoriteTacosImage', 'Catering Favorites — Tacos', 'Card photo (4:3).'),
    imageField('favoriteBurritosImage', 'Catering Favorites — Burritos', 'Card photo (4:3).'),
    imageField('favoriteMexicanImage', 'Catering Favorites — Mexican Favorites', 'Card photo (4:3).'),
    imageField('favoriteSidesImage', 'Catering Favorites — Sides & More', 'Card photo (4:3).'),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare({ media }) {
      return {
        title: 'Catering',
        subtitle: 'Catering page images',
        media,
      };
    },
  },
});
