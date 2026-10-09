export const prerender = false;

import type { APIRoute } from 'astro';
import { getPublicContentPaths } from '~/lib/content';
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
  if (!isIndexableHost(request.headers.get('host'))) {
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
  const paths = [...new Set(await getPublicContentPaths())];
  const urls = paths
    .map((path) => {
      const loc = `${origin}${path === '/' ? '/' : path}`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`;
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
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
};
