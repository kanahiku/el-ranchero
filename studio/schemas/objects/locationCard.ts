import { defineField, defineType } from 'sanity';
import { imageField } from '../lib/imageField';
import { buttons, stringList } from '../lib/fields';

/** A restaurant card — used on the Locations hub and the Order Online page. */
export const locationCard = defineType({
  name: 'locationCard',
  title: 'Restaurant card',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    imageField('image', 'Photo', 'Card photo (4:3).'),
    defineField({ name: 'tagline', title: 'Tagline (optional)', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'shopName', title: 'Shopping center (optional)', type: 'string' }),
    defineField({ name: 'addressLine1', title: 'Address line 1', type: 'string' }),
    defineField({ name: 'addressLine2', title: 'Address line 2', type: 'string' }),
    defineField({ name: 'paragraphs', title: 'Description', type: 'array', of: [{ type: 'text', rows: 3 }] }),
    stringList('hours', 'Hours lines (optional)', '', 'Each line is shown on its own row.'),
    buttons('actions', 'Buttons', ''),
  ],
  preview: { select: { title: 'name', subtitle: 'tagline', media: 'image' } },
});
