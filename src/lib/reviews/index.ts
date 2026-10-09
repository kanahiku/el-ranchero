import { readReviewCache, writeReviewCache } from './cache';
import { getReviewProviderConfig } from './config';
import { getFallbackReviews } from './fallback';
import { fetchGoogleReviews } from './google';
import { REVIEW_DISPLAY_LIMITS, type Review, type ReviewFeed, type ReviewSource } from './types';
import { fetchYelpReviews } from './yelp';

export type { Review, ReviewFeed, ReviewSource } from './types';
export { REVIEW_DISPLAY_LIMITS, REVIEW_FETCH_LIMITS } from './types';

function sortByDate(feed: ReviewFeed): ReviewFeed {
  return {
    ...feed,
    reviews: [...feed.reviews].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
  };
}

async function loadFullFeed(): Promise<ReviewFeed> {
  const cached = await readReviewCache();
  if (cached) return cached;

  const [google, yelp] = await Promise.all([fetchGoogleReviews(), fetchYelpReviews()]);
  const googleView = google.viewAllUrl || getReviewProviderConfig('google').viewAllUrl;
  const yelpView = yelp.viewAllUrl || getReviewProviderConfig('yelp').viewAllUrl;
  const feed = sortByDate({
    reviews: [...google.reviews, ...yelp.reviews],
    viewAll: {
      ...(googleView ? { google: googleView } : {}),
      ...(yelpView ? { yelp: yelpView } : {}),
    },
  });

  const fetchedWithKeys =
    Boolean(getReviewProviderConfig('google').apiKey) || Boolean(getReviewProviderConfig('yelp').apiKey);
  if (fetchedWithKeys) await writeReviewCache(feed);

  return feed;
}

export async function getReviewFeed(sources: ReviewSource[] = ['google', 'yelp']): Promise<ReviewFeed> {
  const wanted = new Set(sources);
  const feed = await loadFullFeed();
  const viewAll: ReviewFeed['viewAll'] = {};

  if (wanted.has('google')) {
    const href = feed.viewAll.google || getReviewProviderConfig('google').viewAllUrl;
    if (href) viewAll.google = href;
  }
  if (wanted.has('yelp')) {
    const href = feed.viewAll.yelp || getReviewProviderConfig('yelp').viewAllUrl;
    if (href) viewAll.yelp = href;
  }

  const reviews = fillMissingSources(
    feed.reviews.filter((review) => wanted.has(review.source)),
    sources
  );

  return { reviews, viewAll };
}

function fillMissingSources(reviews: Review[], sources: ReviewSource[]): Review[] {
  const fallbacks = getFallbackReviews();
  const next = [...reviews];

  for (const source of sources) {
    if (!next.some((review) => review.source === source)) {
      next.push(...fallbacks.filter((review) => review.source === source));
    }
  }

  return next;
}

export function limitReviewsForDisplay(feed: ReviewFeed, sources: ReviewSource[]): ReviewFeed {
  const used = { google: 0, yelp: 0 };
  const reviews = feed.reviews.filter((review) => {
    if (!sources.includes(review.source)) return false;
    if (used[review.source] >= REVIEW_DISPLAY_LIMITS[review.source]) return false;
    used[review.source] += 1;
    return true;
  });

  return { ...feed, reviews };
}
