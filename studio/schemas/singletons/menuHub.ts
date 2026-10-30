import { ThListIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { buttons, paragraphs, str, txt } from '../lib/fields';
import { hrefField } from '../objects/links';

const G = {
  hero: 'hero',
  categories: 'categories',
  breakfast: 'breakfast',
  featured: 'featured',
  meat: 'meat',
  order: 'order',
  seo: 'seo',
} as const;

/** The /menu page. Tabs follow the page top to bottom. */
export const menuHubContent = defineType({
  name: 'menuHubContent',
  title: 'Menu hub',
  type: 'document',
  icon: ThListIcon,
  groups: [
    { name: G.hero, title: '1 · Hero', default: true },
    { name: G.categories, title: '2 · Categories' },
    { name: G.breakfast, title: '3 · Breakfast' },
    { name: G.featured, title: '4 · Featured dishes' },
    { name: G.meat, title: '5 · Choose your meat' },
    { name: G.order, title: '6 · Order block' },
    { name: G.seo, title: 'SEO' },
  ],
  fields: [
    imageField('heroImage', 'Hero photo', 'Split hero photo.', G.hero),
    str('heroTitle', 'Headline', G.hero),
    paragraphs('heroParagraphs', 'Intro paragraphs', G.hero),
    buttons('heroActions', 'Buttons', G.hero),

    str('categoriesTitle', 'Heading', G.categories),
    txt('categoriesSubtitle', 'Text', G.categories, 'The category cards themselves come from Menu → Categories.', 3),

    str('breakfastHeading', 'Heading', G.breakfast),
    paragraphs('breakfastParagraphs', 'Paragraphs', G.breakfast),
    imageField('breakfastImage', 'Photo', 'Landscape 4:3.', G.breakfast),

    str('featuredTitle', 'Heading', G.featured),
    defineField({
      name: 'featuredDishes',
      title: 'Dish tiles',
      description: 'Each tile links to a menu page. Photos are portrait (416×562).',
      type: 'array',
      group: G.featured,
      of: [
        {
          type: 'object',
          name: 'menuHubDish',
          title: 'Dish',
          fields: [
            str('title', 'Title', ''),
            imageField('image', 'Photo', 'Portrait 416×562.'),
            paragraphs('paragraphs', 'Description', ''),
            { ...hrefField, title: 'Tile links to' },
          ],
          preview: { select: { title: 'title', media: 'image' } },
        },
      ],
    }),

    str('meatHeading', 'Heading', G.meat),
    txt('meatIntro', 'Intro text', G.meat, 'The meat rows come from Menu → Meat options.', 3),
    txt('meatNote', 'Note under the table', G.meat, undefined, 3),

    str('orderTitle', 'Heading', G.order),
    txt('orderSubtitle', 'Text', G.order, 'The restaurant cards and DoorDash buttons are shared — see Pages → Menu → Shared sections.', 3),

    str('seoTitle', 'Page title', G.seo, 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', G.seo, '~155 characters.', 3),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare: ({ media }) => ({ title: 'Menu hub', subtitle: '/menu', media }),
  },
});
