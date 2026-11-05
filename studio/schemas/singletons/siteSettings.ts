import { defineField, defineType } from 'sanity';

/** Business facts that feed LocalBusiness / Organization schema. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Business name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'region', title: 'State / region', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Postal code', type: 'string' }),
        defineField({ name: 'country', title: 'Country', type: 'string', initialValue: 'US' }),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'days', title: 'Days', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'opens', title: 'Opens (HH:MM)', type: 'string' }),
            defineField({ name: 'closes', title: 'Closes (HH:MM)', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({ name: 'serviceArea', title: 'Service area', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'imageWithAlt' }),
    defineField({
      name: 'geo',
      title: 'Map location',
      type: 'geopoint',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social profile URLs',
      type: 'array',
      of: [{ type: 'url' }],
    }),
    defineField({ name: 'seo', title: 'Default SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'name' }, prepare: ({ title }) => ({ title: title ?? 'Site settings' }) },
});
