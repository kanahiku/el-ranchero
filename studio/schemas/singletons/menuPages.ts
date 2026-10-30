import { BasketIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { linkField, str, txt } from '../lib/fields';
import { hrefField } from '../objects/links';

/**
 * Menu — shared sections. Content that appears at the bottom of /menu and every
 * /menu/* page: the "Order from your nearest El Ranchero" cards and the allergy notice.
 * (Id `singleton-menu-pages` — page photos used to live here and now sit on each page.)
 */
export const menuPagesContent = defineType({
  name: 'menuPagesContent',
  title: 'Menu — shared sections',
  type: 'document',
  icon: BasketIcon,
  groups: [
    { name: 'order', title: 'Order cards', default: true },
    { name: 'allergy', title: 'Allergy notice' },
  ],
  fields: [
    defineField({
      name: 'orderLocations',
      title: 'Restaurant cards',
      description: 'One card per restaurant, with its DoorDash button.',
      type: 'array',
      group: 'order',
      of: [
        {
          type: 'object',
          name: 'menuOrderLocation',
          title: 'Restaurant',
          fields: [
            str('name', 'Name', '', 'e.g. Wahiawa'),
            str('address', 'Address', ''),
            str('buttonText', 'Button label', ''),
            { ...hrefField, name: 'buttonHref', title: 'Button link' },
          ],
          preview: { select: { title: 'name', subtitle: 'address' } },
        },
      ],
    }),
    str(
      'footnoteBefore',
      'Line below cards — text before link',
      'order',
      'Built as: text before + link + text after.'
    ),
    linkField('footnoteLink', 'Line below cards — link', 'order'),
    str('footnoteAfter', 'Line below cards — text after link', 'order', 'e.g. a full stop.'),

    str('allergyTitle', 'Title', 'allergy'),
    txt('allergyDescription', 'Text', 'allergy'),
  ],
  preview: {
    prepare: () => ({ title: 'Menu — shared sections', subtitle: 'Order cards & allergy notice' }),
  },
});
