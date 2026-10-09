export const prerender = false;

import type { APIRoute } from 'astro';
import { getReviewFeed, limitReviewsForDisplay, type ReviewSource } from '~/lib/reviews';

function parseSources(value: string | null): ReviewSource[] {
  if (!value) return ['google', 'yelp'];
  const sources = value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is ReviewSource => item === 'google' || item === 'yelp');
  return sources.length ? sources : ['google', 'yelp'];
}

export const GET: APIRoute = async ({ url }) => {
  const sources = parseSources(url.searchParams.get('sources'));
  const feed = limitReviewsForDisplay(await getReviewFeed(sources), sources);

  return new Response(JSON.stringify(feed), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
};
