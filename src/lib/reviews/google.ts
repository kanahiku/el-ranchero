import { getReviewProviderConfig } from './config';
import { REVIEW_FETCH_LIMITS, type Review } from './types';

interface GooglePlaceReview {
  author_name?: string;
  author_url?: string;
  rating?: number;
  text?: string;
  time?: number;
}

interface GooglePlaceDetailsResponse {
  status?: string;
  result?: {
    url?: string;
    reviews?: GooglePlaceReview[];
  };
  error_message?: string;
}

export async function fetchGoogleReviews(): Promise<{ reviews: Review[]; viewAllUrl?: string }> {
  const { apiKey, id, viewAllUrl } = getReviewProviderConfig('google');
  if (!apiKey || !id) return { reviews: [], viewAllUrl: viewAllUrl || undefined };

  const params = new URLSearchParams({
    place_id: id,
    fields: 'url,reviews',
    reviews_sort: 'newest',
    key: apiKey,
  });

  const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`);
  if (!response.ok) {
    console.error(`Google Places HTTP ${response.status}`);
    return { reviews: [], viewAllUrl: viewAllUrl || undefined };
  }

  const payload = (await response.json()) as GooglePlaceDetailsResponse;
  if (payload.status && payload.status !== 'OK' && payload.status !== 'ZERO_RESULTS') {
    console.error(`Google Places ${payload.status}${payload.error_message ? `: ${payload.error_message}` : ''}`);
    return { reviews: [], viewAllUrl: payload.result?.url || viewAllUrl || undefined };
  }

  const reviews = (payload.result?.reviews ?? [])
    .filter((review) => review.text && review.author_name)
    .slice(0, REVIEW_FETCH_LIMITS.google)
    .map((review, index) => ({
      id: `google-${review.time ?? index}`,
      authorName: review.author_name || 'Google reviewer',
      text: review.text || '',
      rating: Math.min(5, Math.max(1, Math.round(review.rating ?? 5))),
      date: review.time ? new Date(review.time * 1000).toISOString() : new Date().toISOString(),
      source: 'google' as const,
      sourceUrl: payload.result?.url || viewAllUrl || '',
    }));

  return {
    reviews,
    viewAllUrl: payload.result?.url || viewAllUrl || undefined,
  };
}
