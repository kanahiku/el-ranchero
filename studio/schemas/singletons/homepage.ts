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

export const homepageContent = defineType({
  name: 'homepageContent',
  title: 'Homepage',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('heroImage', 'Hero image', 'Homepage hero.'),
    imageField('breakfastImage', 'Breakfast image', 'Image beside "Mexican Breakfast, Every Day From 7 AM".'),
    imageField('cateringImage', 'Catering image', 'Image beside "Mexican Catering for Gatherings on Oʻahu".'),
    imageField('privateEventsImage', 'Private events image', 'Image beside "Host Your Private Event at El Ranchero Kapolei".'),
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
