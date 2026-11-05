import { sanityClient } from '../../sanity/client';

export interface RedirectTarget {
  to: string;
  permanent: boolean;
}

const REDIRECT_QUERY = /* groq */ `
  *[_type == "redirect" && from == $from && !(_id in path("drafts.**"))][0]{ to, "permanent": coalesce(permanent, true) }
`;

/** Redirect configured in Studio -> Redirects for an old path, if any. */
export async function getSanityRedirect(path: string): Promise<RedirectTarget | null> {
  const doc = await sanityClient.fetch<RedirectTarget | null>(REDIRECT_QUERY, { from: path });
  return doc?.to ? doc : null;
}
