import { getReviewProviderConfig } from './config';
import { REVIEW_FETCH_LIMITS, type Review } from './types';

interface YelpReview {
  id?: string;
  url?: string;
  text?: string;
  rating?: number;
  time_created?: string;
  user?: { name?: string };
}

interface YelpReviewsResponse {
  reviews?: YelpReview[];
  error?: { description?: string };
}

export async function fetchYelpReviews(): Promise<{ reviews: Review[]; viewAllUrl?: string }> {
  const { apiKey, id, viewAllUrl } = getReviewProviderConfig('yelp');
  if (!apiKey || !id) return { reviews: [], viewAllUrl: viewAllUrl || undefined };

  const response = await fetch(
    `https://api.yelp.com/v3/businesses/${encodeURIComponent(id)}/reviews?limit=${REVIEW_FETCH_LIMITS.yelp}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  if (!response.ok) {
    console.error(`Yelp Fusion HTTP ${response.status}`);
    return { reviews: [], viewAllUrl: viewAllUrl || undefined };
  }

  const payload = (await response.json()) as YelpReviewsResponse;
  if (payload.error?.description) {
    console.error(`Yelp Fusion: ${payload.error.description}`);
  }

  const reviews = (payload.reviews ?? [])
    .filter((review) => review.text && review.user?.name)
    .slice(0, REVIEW_FETCH_LIMITS.yelp)
    .map((review, index) => ({
      id: `yelp-${review.id ?? index}`,
      authorName: review.user?.name || 'Yelp reviewer',
      text: review.text || '',
      rating: Math.min(5, Math.max(1, Math.round(review.rating ?? 5))),
      date: review.time_created ? new Date(review.time_created.replace(' ', 'T')).toISOString() : new Date().toISOString(),
      source: 'yelp' as const,
      sourceUrl: review.url || viewAllUrl || '',
    }));

  return { reviews, viewAllUrl: viewAllUrl || undefined };
}
