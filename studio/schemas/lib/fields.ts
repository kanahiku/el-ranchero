import { defineField } from 'sanity';

/** Single-line text. */
export const str = (name: string, title: string, group: string, description?: string) =>
  defineField({ name, title, description, type: 'string', ...(group ? { group } : {}) });

/** Multi-line text. */
export const txt = (name: string, title: string, group: string, description?: string, rows = 4) =>
  defineField({ name, title, description, type: 'text', rows, ...(group ? { group } : {}) });

/** Ordered list of paragraphs — editors add / reorder / delete each one. */
export const paragraphs = (name: string, title: string, group: string, description?: string) =>
  defineField({
    name,
    title,
    description: description ?? 'One entry per paragraph. Drag to reorder.',
    type: 'array',
    ...(group ? { group } : {}),
    of: [{ type: 'text', rows: 3 }],
  });

/** Single link / button. */
export const linkField = (name: string, title: string, group: string, description?: string) =>
  defineField({ name, title, description, type: 'link', ...(group ? { group } : {}) });

/** List of buttons. */
export const buttons = (name: string, title: string, group: string, description?: string) =>
  defineField({ name, title, description, type: 'array', ...(group ? { group } : {}), of: [{ type: 'buttonLink' }] });

/**
 * Paragraphs with inline links, bold and italic. Each block is one paragraph;
 * press Enter for the next one. No headings or lists (layout is fixed).
 */
export const richParagraphs = (name: string, title: string, group: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    ...(group ? { group } : {}),
    of: [
      {
        type: 'block',
        styles: [{ title: 'Normal', value: 'normal' }],
        lists: [],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [
                defineField({
                  name: 'href',
                  title: 'Link',
                  description: 'Page on this site (e.g. /menu) or a full URL (https://…).',
                  type: 'string',
                  validation: (r) =>
                    r.required().custom((value) =>
                      !value || /^(\/|#|https?:\/\/|tel:|mailto:)/.test(value) || 'Start with /, https://, tel: or mailto:'
                    ),
                }),
              ],
            },
          ],
        },
      },
    ],
  });

/** Plain list of short strings (bullets). */
export const stringList = (name: string, title: string, group: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    ...(group ? { group } : {}),
    of: [{ type: 'string' }],
  });

/** Question + rich answer list. */
export const faqList = (name: string, title: string, group: string) =>
  defineField({
    name,
    title,
    type: 'array',
    ...(group ? { group } : {}),
    of: [
      {
        type: 'object',
        name: 'faqItem',
        title: 'Question',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string' }),
          richParagraphs('answer', 'Answer', '', 'Links allowed.'),
        ],
        preview: { select: { title: 'question' } },
      },
    ],
  });
