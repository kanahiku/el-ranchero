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

export const menuPagesContent = defineType({
  name: 'menuPagesContent',
  title: 'Menu Pages',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('menuHubHeroImage', 'Menu hub — Hero image', 'Hero image for the main Menu page.'),
    imageField('breakfastHeroImage', 'Breakfast — Hero image', 'Hero image for the Breakfast page.'),
    imageField('burritosHeroImage', 'Burritos — Hero image', 'Hero image for the Burritos page.'),
    imageField('tacosHeroImage', 'Tacos & Birria — Hero image', 'Hero image for the Tacos & Birria page.'),
    imageField('entreesHeroImage', 'Entrees & Fajitas — Hero image', 'Hero image for the Entrees & Fajitas page.'),
    imageField('quesadillasNachosHeroImage', 'Quesadillas & Nachos — Hero image', 'Hero image for the Quesadillas & Nachos page.'),
    imageField('specialsHeroImage', 'Specials — Hero image', 'Hero image for the Specials page.'),
    imageField('appetizersSidesHeroImage', 'Appetizers & Sides — Hero image', 'Hero image for the Appetizers & Sides page.'),
    imageField('kidsHeroImage', 'Kids Menu — Hero image', 'Hero image for the Kids Menu page.'),
    imageField('drinksHeroImage', 'Drinks & Margaritas — Hero image', 'Hero image for the Drinks & Margaritas page.'),
  ],
  preview: {
    select: { media: 'menuHubHeroImage' },
    prepare({ media }) {
      return {
        title: 'Menu Pages',
        subtitle: 'Menu page images',
        media,
      };
    },
  },
});
