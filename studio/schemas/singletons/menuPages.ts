import { ImageIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { imageField } from '../lib/imageField';

export const menuPagesContent = defineType({
  name: 'menuPagesContent',
  title: 'Menu Pages',
  type: 'document',
  icon: ImageIcon,
  groups: [
    { name: 'hub', title: 'Menu hub' },
    { name: 'heroes', title: 'Category page heroes' },
    { name: 'sections', title: 'Category page sections' },
  ],
  fields: [
    imageField('menuHubHeroImage', 'Menu hub — Hero image', 'Hero image for the main Menu page.', 'hub'),
    imageField(
      'breakfastEveryDayImage',
      'Menu hub — Breakfast every day',
      'Image beside "Breakfast Every Day, Starting at 7 AM" (4:3).',
      'hub'
    ),
    imageField('featuredMolcajeteImage', 'Menu hub — Featured: Molcajete', 'Portrait tile (416×562).', 'hub'),
    imageField('featuredTacoImage', 'Menu hub — Featured: Taco', 'Portrait tile (416×562).', 'hub'),
    imageField(
      'featuredCaliforniaBurritoImage',
      'Menu hub — Featured: California Burrito',
      'Portrait tile (416×562).',
      'hub'
    ),

    imageField('breakfastHeroImage', 'Breakfast — Hero image', 'Hero image for the Breakfast page.', 'heroes'),
    imageField('burritosHeroImage', 'Burritos — Hero image', 'Hero image for the Burritos page.', 'heroes'),
    imageField('tacosHeroImage', 'Tacos & Birria — Hero image', 'Hero image for the Tacos & Birria page.', 'heroes'),
    imageField(
      'entreesHeroImage',
      'Entrees & Fajitas — Hero image',
      'Hero image for the Entrees & Fajitas page.',
      'heroes'
    ),
    imageField(
      'quesadillasNachosHeroImage',
      'Quesadillas & Nachos — Hero image',
      'Hero image for the Quesadillas & Nachos page.',
      'heroes'
    ),
    imageField('specialsHeroImage', 'Specials — Hero image', 'Hero image for the Specials page.', 'heroes'),
    imageField(
      'appetizersSidesHeroImage',
      'Appetizers & Sides — Hero image',
      'Hero image for the Appetizers & Sides page.',
      'heroes'
    ),
    imageField('kidsHeroImage', 'Kids Menu — Hero image', 'Hero image for the Kids Menu page.', 'heroes'),
    imageField(
      'drinksHeroImage',
      'Drinks & Margaritas — Hero image',
      'Hero image for the Drinks & Margaritas page.',
      'heroes'
    ),

    imageField(
      'breakfastTakeoutImage',
      'Breakfast — Takeout or sit-down',
      'Image beside "Breakfast for Takeout or a Sit-Down Meal" (4:3).',
      'sections'
    ),
    imageField(
      'entreesMolcajeteImage',
      'Entrees — Molcajete',
      'Image beside "Molcajete: Our Signature Dish" (4:3).',
      'sections'
    ),
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
