import { DocumentsIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { faqList, linkField, paragraphs, richParagraphs, str, stringList, txt } from '../lib/fields';

const G = {
  hero: 'hero',
  form: 'form',
  favorites: 'favorites',
  occasions: 'occasions',
  why: 'why',
  reviews: 'reviews',
  steps: 'steps',
  planning: 'planning',
  explore: 'explore',
  locations: 'locations',
  faqs: 'faqs',
  cta: 'cta',
  seo: 'seo',
} as const;

/** The /catering page. Tabs follow the page top to bottom. */
export const cateringContent = defineType({
  name: 'cateringContent',
  title: 'Catering hub',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    { name: G.hero, title: '1 · Hero', default: true },
    { name: G.form, title: '2 · Request form' },
    { name: G.favorites, title: '3 · Favorites' },
    { name: G.occasions, title: '4 · Occasions' },
    { name: G.why, title: '5 · Why cater' },
    { name: G.reviews, title: '6 · Reviews' },
    { name: G.steps, title: '7 · How it works' },
    { name: G.planning, title: '8 · Planning' },
    { name: G.explore, title: '9 · Explore menu' },
    { name: G.locations, title: '10 · Locations' },
    { name: G.faqs, title: '11 · FAQs' },
    { name: G.cta, title: '12 · Closing banner' },
    { name: G.seo, title: 'SEO' },
  ],
  fields: [
    imageField('heroImage', 'Hero photo', 'Portrait 619×740.', G.hero),
    str('heroTitle', 'Headline', G.hero),
    paragraphs('heroParagraphs', 'Intro paragraphs', G.hero),
    linkField('heroButton', 'Button', G.hero, 'Defaults to scrolling to the form: #catering-form'),

    str('formHeading', 'Heading', G.form),
    paragraphs('formParagraphs', 'Paragraphs', G.form),
    str('formMessageLabel', 'Message box label', G.form),
    str('formButtonLabel', 'Submit button label', G.form),
    str('callPrompt', 'Phone prompt', G.form, 'e.g. “Prefer to speak with us directly?”'),
    str('phoneDisplay', 'Phone number (as shown)', G.form, 'e.g. (808) 621-9000. The button reads “Call …”.'),
    str('phoneHref', 'Phone link', G.form, 'e.g. tel:+18086219000'),

    str('favoritesTitle', 'Heading', G.favorites),
    paragraphs('favoritesIntro', 'Intro paragraphs', G.favorites),
    defineField({
      name: 'favoritesItems',
      title: 'Cards',
      type: 'array',
      group: G.favorites,
      of: [
        {
          type: 'object',
          name: 'cateringFavorite',
          title: 'Card',
          fields: [
            str('title', 'Title', ''),
            imageField('image', 'Photo', 'Landscape 4:3.'),
            txt('description', 'Description', '', undefined, 3),
          ],
          preview: { select: { title: 'title', media: 'image' } },
        },
      ],
    }),
    txt('favoritesFootnote', 'Note under the cards', G.favorites, undefined, 3),

    str('occasionsHeading', 'Heading', G.occasions),
    paragraphs('occasionsIntro', 'Text before the list', G.occasions),
    stringList('occasionsBullets', 'Bullet list', G.occasions),
    paragraphs('occasionsOutro', 'Text after the list', G.occasions),
    imageField('occasionsImage', 'Photo', 'Landscape 4:3.', G.occasions),

    str('whyHeading', 'Heading', G.why),
    paragraphs('whyParagraphs', 'Paragraphs', G.why),
    imageField('whyImage', 'Photo', 'Landscape 4:3.', G.why),

    str('reviewsHeading', 'Heading', G.reviews),
    txt('reviewsSubtitle', 'Text', G.reviews, undefined, 2),
    txt('reviewsFootnote', 'Note under the reviews', G.reviews, undefined, 2),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      group: G.reviews,
      of: [
        {
          type: 'object',
          name: 'cateringReview',
          title: 'Review',
          fields: [txt('quote', 'Quote', '', undefined, 3), str('name', 'Name', ''), str('location', 'Location', '')],
          preview: { select: { title: 'name', subtitle: 'quote' } },
        },
      ],
    }),
    defineField({
      name: 'reviewLinks',
      title: 'Review buttons',
      type: 'array',
      group: G.reviews,
      of: [{ type: 'link' }],
    }),

    str('stepsTitle', 'Heading', G.steps),
    defineField({
      name: 'steps',
      title: 'Steps',
      description: 'Numbered automatically.',
      type: 'array',
      group: G.steps,
      of: [
        {
          type: 'object',
          name: 'cateringStep',
          title: 'Step',
          fields: [str('title', 'Title', ''), txt('description', 'Description', '', undefined, 3)],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
    }),

    str('planningHeading', 'Heading', G.planning),
    paragraphs('planningIntro', 'Text before the checklist', G.planning),
    stringList('planningChecklist', 'Checklist', G.planning),
    paragraphs('planningOutro', 'Text after the checklist', G.planning),
    imageField('planningImage', 'Photo', 'Landscape 4:3.', G.planning),

    str('exploreHeading', 'Heading', G.explore),
    richParagraphs('exploreParagraphs', 'Paragraphs', G.explore, 'Select text to add a link.'),
    str(
      'exploreOptionsLead',
      'Lead-in to the catering page links',
      G.explore,
      'The four catering pages are listed after this text automatically.'
    ),
    linkField('exploreButton', 'Button', G.explore),
    imageField('exploreImage', 'Photo', 'Landscape 4:3.', G.explore),

    str('locationsTitle', 'Heading', G.locations),
    txt('locationsSubtitle', 'Text', G.locations, 'The two location cards come from the Locations page data.', 3),
    txt('locationsFootnote', 'Note under the cards', G.locations, undefined, 3),

    str('faqsTitle', 'Heading', G.faqs),
    faqList('faqs', 'Questions', G.faqs),

    str('ctaTitle', 'Heading', G.cta),
    txt('ctaSubtitle', 'Text', G.cta),
    linkField('ctaButton', 'Button', G.cta),

    str('seoTitle', 'Page title', G.seo, 'Shown in the browser tab and Google results. ~60 characters.'),
    txt('seoDescription', 'Meta description', G.seo, '~155 characters.', 3),
  ],
  preview: {
    select: { media: 'heroImage' },
    prepare: ({ media }) => ({ title: 'Catering hub', subtitle: '/catering', media }),
  },
});
