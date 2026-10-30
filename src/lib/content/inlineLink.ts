const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escape editor text and join paragraphs into one HTML string with blank-line breaks. */
export const paragraphsToHtml = (paragraphs: string[]): string => paragraphs.map(escapeHtml).join('<br /><br />');

/**
 * Builds "before <a>link</a> after" from three editor fields. Punctuation in
 * `after` (e.g. a full stop) sticks to the link instead of floating after a space.
 */
export function inlineLinkHtml(
  before: string,
  link: { text: string; href: string },
  after: string,
  linkClass: string
): string {
  const anchor = link.text
    ? `<a href="${escapeHtml(link.href)}" class="${linkClass}">${escapeHtml(link.text)}</a>`
    : '';
  const tail = escapeHtml(after);
  const tailJoin = /^[.,;:!?)]/.test(after) ? '' : ' ';
  return [escapeHtml(before), anchor].filter(Boolean).join(' ') + (tail ? (anchor ? tailJoin : ' ') + tail : '');
}
