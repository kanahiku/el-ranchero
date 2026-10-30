/**
 * Rich paragraphs: Studio edits them as Portable Text blocks (bold, italic, links);
 * built-in defaults are plain strings that may contain `[label](href)` links.
 * Both render to the same safe HTML.
 */

export const RICH_LINK_CLASS = 'text-accent underline underline-offset-4 transition-opacity hover:opacity-80';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Only allow site paths, anchors and common safe schemes in editor-supplied links. */
const safeHref = (href: string) => (/^(\/|#|https?:\/\/|tel:|mailto:)/.test(href) ? href : '#');

const MD_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** "Text with [a link](/page)" → HTML. */
export function mdToHtml(source: string): string {
  let html = '';
  let last = 0;
  for (const match of source.matchAll(MD_LINK)) {
    html += escapeHtml(source.slice(last, match.index));
    html += `<a href="${escapeHtml(safeHref(match[2]))}" class="${RICH_LINK_CLASS}">${escapeHtml(match[1])}</a>`;
    last = (match.index ?? 0) + match[0].length;
  }
  return html + escapeHtml(source.slice(last));
}

type Span = { _type: 'span'; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
export type PortableBlock = { _type: 'block'; children?: Span[]; markDefs?: MarkDef[] };

function blockToHtml(block: PortableBlock): string {
  const defs = new Map((block.markDefs ?? []).map((def) => [def._key, def]));
  return (block.children ?? [])
    .map((span) => {
      let html = escapeHtml(span.text ?? '');
      for (const mark of span.marks ?? []) {
        const def = defs.get(mark);
        if (def?.href) html = `<a href="${escapeHtml(safeHref(def.href))}" class="${RICH_LINK_CLASS}">${html}</a>`;
        else if (mark === 'strong') html = `<strong>${html}</strong>`;
        else if (mark === 'em') html = `<em>${html}</em>`;
      }
      return html;
    })
    .join('');
}

/** One HTML string per paragraph, from Portable Text blocks and/or markdown-link strings. */
export function richToHtml(value: unknown): string[] {
  if (!Array.isArray(value)) return typeof value === 'string' && value ? [mdToHtml(value)] : [];
  return value
    .map((item) => (typeof item === 'string' ? mdToHtml(item) : blockToHtml(item as PortableBlock)))
    .filter(Boolean);
}

/** Several paragraphs as one HTML string (for widgets that take a single `description`). */
export const richToHtmlString = (value: unknown): string => richToHtml(value).join('<br /><br />');

let keyCounter = 0;
const key = () => `r${Date.now().toString(36)}${keyCounter++}`;

/** Markdown-link string → Portable Text block (used by the seed scripts). */
export function mdToBlock(source: string): Record<string, unknown> {
  const markDefs: MarkDef[] = [];
  const children: Array<Record<string, unknown>> = [];
  let last = 0;
  for (const match of source.matchAll(MD_LINK)) {
    if (match.index! > last) children.push({ _type: 'span', _key: key(), text: source.slice(last, match.index), marks: [] });
    const defKey = key();
    markDefs.push({ _key: defKey, _type: 'link', href: match[2] });
    children.push({ _type: 'span', _key: key(), text: match[1], marks: [defKey] });
    last = match.index! + match[0].length;
  }
  if (last < source.length) children.push({ _type: 'span', _key: key(), text: source.slice(last), marks: [] });
  if (!children.length) children.push({ _type: 'span', _key: key(), text: '', marks: [] });
  return { _type: 'block', _key: key(), style: 'normal', markDefs, children };
}
