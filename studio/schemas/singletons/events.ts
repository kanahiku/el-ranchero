import { ImageIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { imageField } from '../lib/imageField';

export const eventsContent = defineType({
  name: 'eventsContent',
  title: 'Events',
  type: 'document',
  icon: ImageIcon,
  fields: [
    imageField('hubHeroImage', 'Events hub — Hero image', 'Hero photo for the main Events page (portrait).'),
    imageField('tacoTuesdayHeroImage', 'Taco Tuesday — Hero image', 'Hero photo for the Taco Tuesday page.'),
    imageField('karaokeHeroImage', 'Karaoke Wednesday — Hero image', 'Hero photo for the Karaoke Wednesday page.'),
    imageField('latinNightHeroImage', 'Latin Night — Hero image', 'Hero photo for the Saturday Latin Night page.'),
    imageField('concertsHeroImage', 'Live Concerts — Hero image', 'Hero photo for the Live Concerts page.'),
    imageField(
      'spaceRentalHeroImage',
      'Event Space Rental — Hero image',
      'Hero photo for the Event Space Rental page (Kapolei).'
    ),
  ],
  preview: {
    select: { media: 'hubHeroImage' },
    prepare({ media }) {
      return {
        title: 'Events',
        subtitle: 'Events page images',
        media,
      };
    },
  },
});
