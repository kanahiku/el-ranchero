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
    imageField('heroImage', 'Hero image', 'Homepage hero background image.'),
    imageField('localSourcingImage', 'Our Local Sourcing image', 'Image beside the local sourcing section.'),
    imageField('locationsImage', 'Visit a Store Near You image', 'Image beside the homepage locations section.'),
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
