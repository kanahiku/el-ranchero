import type { Rule, SlugRule, StringRule, TextRule, ValidationContext } from 'sanity';

/**
 * Shared publish-blocking validators. `.error()` blocks publishing in Studio;
 * `.warning()` only nags. Use these instead of ad-hoc rules so every document
 * type enforces the same minimum (title, slug, image alt text).
 */
export const requiredTitle = (rule: StringRule) => rule.required().error('A title is required to publish.');

/** Works for `slug` fields and for the fixed read-only string slugs on page documents. */
export const requiredSlug = (rule: SlugRule | StringRule) =>
  (rule as StringRule).required().error('A slug is required to publish.');

/**
 * Flags a slug edit on an already-published document. Changing the slug breaks the old URL,
 * so editors must add a Redirect (Studio -> Redirects) from the old path to the new one.
 */
export const slugChangeWarning = (basePath: string) => (rule: SlugRule) =>
  rule.custom(async (value, context: ValidationContext) => {
    const current = value?.current;
    const publishedId = context.document?._id?.replace(/^drafts\./, '');
    if (!current || !publishedId) return true;
    const published = await context
      .getClient({ apiVersion: '2024-01-01' })
      .fetch<string | null>('*[_id == $id][0].slug.current', { id: publishedId });
    if (published && published !== current) {
      return {
        message: `Slug changed from "${published}". Add a Redirect from ${basePath}/${published} to ${basePath}/${current} (Studio -> Redirects) so old links keep working.`,
        level: 'warning',
      };
    }
    return true;
  });

export const requiredAlt = (rule: StringRule) =>
  rule.custom((alt, context) => {
    const parent = context.parent as { asset?: unknown } | undefined;
    // Only demand alt text once an image is actually chosen.
    if (parent?.asset && !alt)
      return 'Alt text is required (use a short description; for decorative images enter a single space).';
    return true;
  });

export const metaTitleLength = (rule: StringRule) => rule.max(70).warning('Keep titles under about 60 characters.');

export const metaDescriptionLength = (rule: TextRule) =>
  rule.min(70).max(160).warning('Descriptions read best at 120–160 characters.');

/** Custom JSON-LD must be valid JSON before it can be published. */
export const validJsonLd = (rule: TextRule) =>
  rule
    .custom((value) => {
      if (typeof value !== 'string' || !value.trim()) return true;
      try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' ? true : 'Schema must be a JSON object or array.';
      } catch {
        return 'Schema is not valid JSON.';
      }
    })
    .error();
