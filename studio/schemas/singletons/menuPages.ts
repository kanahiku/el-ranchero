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
    // ── Menu Hub ───────────────────────────────────────────────
    imageField('menuHubHeroImage', 'Menu Hub — Hero image', 'Hero image for the main Menu page.'),

    // ── Salads ─────────────────────────────────────────────────
    imageField('saladsHeroImage', 'Salads — Hero image', 'Hero image for the Signature Salads page.'),
    imageField('saladsIngredientsImage', 'Salads — Ingredients image', 'Photo for the "Sourced with Care" panel on the Salads page.'),

    // ── Wraps & Subs ───────────────────────────────────────────
    imageField('wrapsHeroImage', 'Wraps & Subs — Hero image', 'Hero image for the Wraps & Subs page.'),
    imageField('wrapsIngredientsImage', 'Wraps & Subs — Ingredients image', 'Photo for the "Quality Ingredients" panel on the Wraps page.'),

    // ── Soups ──────────────────────────────────────────────────
    imageField('soupsHeroImage', 'Soups — Hero image', 'Hero image for the Soups page.'),
    imageField('soupsIngredientsImage', 'Soups — Ingredients image', 'Photo for the sourcing panel on the Soups page.'),

    // ── Drinks ─────────────────────────────────────────────────
    imageField('drinksHeroImage', 'Drinks — Hero image', 'Hero image for the Drinks page.'),
    imageField('drinksIngredientsImage', 'Drinks — Ingredients image', 'Photo for the sourcing panel on the Drinks page.'),

    // ── Vegan ──────────────────────────────────────────────────
    imageField('veganIngredientsImage', 'Vegan — Ingredients image', 'Photo for the sourcing panel on the Vegan Options page.'),

    // ── Vegetarian ─────────────────────────────────────────────
    imageField('vegetarianHeroImage', 'Vegetarian — Hero image', 'Hero image for the Vegetarian Options page.'),
    imageField('vegetarianIngredientsImage', 'Vegetarian — Ingredients image', 'Photo for the sourcing panel on the Vegetarian page.'),

    // ── Healthy Options ────────────────────────────────────────
    imageField('healthyOptionsHeroImage', 'Healthy Options — Hero image', 'Hero image for the Healthy Options page.'),
    imageField('healthyOptionsIngredientsImage', 'Healthy Options — Ingredients image', 'Photo for the sourcing panel on the Healthy Options page.'),

    // ── Kids ───────────────────────────────────────────────────
    imageField('kidsIngredientsImage', 'Kids — Ingredients image', 'Photo for the sourcing panel on the Keiki / Kids page.'),

    // ── Design Your Own Salad ──────────────────────────────────
    imageField('designYourOwnHeroImage', 'Design Your Own — Hero image', 'Hero image for the Design Your Own Salad page.'),
    imageField('designYourOwnBuildImage', 'Design Your Own — Build steps image', 'Right-column image in the "How to Build Your Own Salad" section.'),
    imageField('designYourOwnQualityImage', 'Design Your Own — Quality Ingredients image', 'Photo for the "Quality Ingredients" sourcing panel.'),
  ],
  preview: {
    select: { media: 'saladsHeroImage' },
    prepare({ media }) {
      return {
        title: 'Menu Pages',
        subtitle: 'Menu sub-page images',
        media,
      };
    },
  },
});
