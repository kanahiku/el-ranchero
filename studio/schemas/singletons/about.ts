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
    imageField('heroImage', 'Hero image', 'About page hero image.'),
    imageField('storyImage', 'Our Story image', 'Image beside the Our Story section.'),
    imageField('sustainabilityImage', 'Sustainability image', 'Image beside the Sustainability section.'),
    imageField('vendorsImage', 'Our Vendors image', 'Image beside the Our Vendors section.'),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare({ media }) {
      return {
        title: 'About',
        subtitle: 'About page images',
        media,
      };
    },
  },
});
