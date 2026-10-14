export const prerender = false;

import type { APIRoute } from 'astro';
import { getSitemapEntries } from '~/lib/content';
import { canonicalSiteOrigin, isIndexableHost } from '~/lib/indexing';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>
`;

export const GET: APIRoute = async ({ request }) => {
  const isDev = import.meta.env.DEV;
  if (!isDev && !isIndexableHost(request.headers.get('host'))) {
    return new Response(emptySitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  const origin = canonicalSiteOrigin();
  const entries = await getSitemapEntries();
  const urls = entries
    .map((entry) => {
      const loc = `${origin}${entry.path === '/' ? '/' : entry.path}`;
      const lastmodTag = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodTag}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
