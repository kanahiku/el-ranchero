import { ImageIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { imageField } from '../lib/imageField';

const favorites = (prefix: 'wahiawa' | 'kapolei', group: string) => [
  imageField(`${prefix}TacosImage`, 'Favorites — Tacos', 'Card photo (4:3).', group),
  imageField(`${prefix}BurritoImage`, 'Favorites — California Burrito', 'Card photo (4:3).', group),
  imageField(`${prefix}BirriaImage`, 'Favorites — Birria', 'Card photo (4:3).', group),
  imageField(`${prefix}QuesadillasImage`, 'Favorites — Quesadillas', 'Card photo (4:3).', group),
  imageField(`${prefix}MexicanPlatesImage`, 'Favorites — Mexican Plates', 'Card photo (4:3).', group),
];

export const locationsContent = defineType({
  name: 'locationsContent',
  title: 'Locations',
  type: 'document',
  icon: ImageIcon,
  groups: [
    { name: 'hub', title: 'Locations hub' },
    { name: 'wahiawa', title: 'Wahiawa page' },
    { name: 'kapolei', title: 'Kapolei page' },
  ],
  fields: [
    imageField('hubHeroImage', 'Hero image', 'Hero photo for the main Locations page (portrait, 619×740).', 'hub'),
    imageField('hubWahiawaImage', 'Wahiawa card photo', 'Photo on the Wahiawa card (4:3).', 'hub'),
    imageField('hubKapoleiImage', 'Kapolei card photo', 'Photo on the Kapolei card (4:3).', 'hub'),

    imageField('wahiawaHeroImage', 'Hero image', 'Hero photo for the Wahiawa page (portrait, 619×740).', 'wahiawa'),
    ...favorites('wahiawa', 'wahiawa'),

    imageField('kapoleiHeroImage', 'Hero image', 'Hero photo for the Kapolei page (portrait, 619×740).', 'kapolei'),
    ...favorites('kapolei', 'kapolei'),
  ],
  preview: {
    select: { media: 'hubHeroImage' },
    prepare({ media }) {
      return {
        title: 'Locations',
        subtitle: 'Location page images',
        media,
      };
    },
  },
});
