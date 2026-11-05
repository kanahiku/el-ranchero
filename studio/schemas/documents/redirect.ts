import { defineField, defineType } from 'sanity';
import { ArrowRightIcon } from '@sanity/icons';

const path = (rule: import('sanity').StringRule) =>
  rule
    .required()
    .custom((value) =>
      typeof value === 'string' && /^\/[^\s?#]*$/.test(value)
        ? true
        : 'Start with / and no spaces (e.g. /blog/old-slug).'
    )
    .error();

/** Old URL -> new URL. The site honors these on blog URLs that no longer exist. */
export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'Old path',
      type: 'string',
      description: 'e.g. /blog/old-slug',
      validation: path,
    }),
    defineField({
      name: 'to',
      title: 'New path',
      type: 'string',
      description: 'e.g. /blog/new-slug',
      validation: path,
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      initialValue: true,
      description: 'Leave on unless this is a temporary move.',
    }),
  ],
  preview: { select: { title: 'from', subtitle: 'to' } },
});
