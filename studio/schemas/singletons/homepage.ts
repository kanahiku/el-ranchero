import { ImageIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { imageField } from '../lib/imageField';

export const homepageContent = defineType({
  name: 'homepageContent',
  title: 'Homepage',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('heroImage', 'Hero image', 'Full-width hero photo behind "Hawaii’s Original Taqueria" (1440×760 slot).'),
    imageField(
      'breakfastImage',
      'Breakfast image',
      'Image beside "Mexican Breakfast, Every Day From 7 AM" (4:3 landscape).'
    ),
    imageField(
      'molcajeteImage',
      'Menu favorite — Molcajete',
      'Portrait tile (416×552) for "Molcajete: Our Signature Dish".'
    ),
    imageField('tacosBirriaImage', 'Menu favorite — Tacos & Birria', 'Portrait tile (416×552) for "Tacos & Birria".'),
    imageField('burritosImage', 'Menu favorite — Burritos', 'Portrait tile (416×552) for "Burritos".'),
    imageField('wahiawaImage', 'Wahiawa location image', 'Photo on the Wahiawa card in the Locations section (4:3).'),
    imageField('kapoleiImage', 'Kapolei location image', 'Photo on the Kapolei card in the Locations section (4:3).'),
    imageField('cateringImage', 'Catering image', 'Image beside "Mexican Catering for Gatherings on Oʻahu" (4:3).'),
    imageField(
      'privateEventsImage',
      'Private events image',
      'Image beside "Host Your Private Event at El Ranchero Kapolei" (4:3).'
    ),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare({ media }) {
      return {
        title: 'Homepage',
        subtitle: 'Homepage images',
        media,
      };
    },
  },
});
