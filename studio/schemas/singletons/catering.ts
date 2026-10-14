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
    imageField(
      'tacoBarHeroImage',
      'Taco Bar — hero',
      'Hero photo for the Taco Bar Catering page (portrait, 619×740).'
    ),
    imageField(
      'tacoBarPackagesImage',
      'Taco Bar — packages',
      'Photo in the Our Taco Bar Catering section (4:3).'
    ),
    imageField(
      'corporateHeroImage',
      'Corporate — hero',
      'Hero photo for the Corporate & Office Catering page (portrait, 619×740).'
    ),
    imageField(
      'corporateLunchImage',
      'Corporate — office lunch',
      'Photo in the Office Lunch Catering section (4:3).'
    ),
    imageField(
      'partyHeroImage',
      'Parties — hero',
      'Hero photo for the Party Catering page (portrait, 619×740).'
    ),
    imageField(
      'partyFamilyImage',
      'Parties — family party',
      'Photo in the Family Party Catering section (4:3).'
    ),
    imageField(
      'largeGroupHeroImage',
      'Large groups — hero',
      'Hero photo for the Large Group Catering page (portrait, 619×740).'
    ),
    imageField(
      'largeGroupFoodImage',
      'Large groups — food',
      'Photo in the Choosing Food for a Large Group section (4:3).'
    ),
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
