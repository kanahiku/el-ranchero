import { defineField } from 'sanity';
import { requiredAlt } from '../../lib/validation';

/** Image with hotspot + required alt text. Shared by every page-image singleton. */
export const imageField = (name: string, title: string, description?: string, group?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'image',
    options: { hotspot: true },
    ...(group ? { group } : {}),
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        validation: requiredAlt,
      }),
    ],
  });
