import type { ReviewProviderConfig, ReviewSource } from './types';

function readEnv(name: string, fallback = '') {
  const fromProcess = typeof process !== 'undefined' ? process.env[name] : undefined;
  const fromMeta = import.meta.env[name] as string | undefined;
  return (fromProcess || fromMeta || fallback).trim();
}

export function getReviewProviderConfig(source: ReviewSource): ReviewProviderConfig {
  if (source === 'google') {
    return {
      apiKey: readEnv('GOOGLE_PLACES_API_KEY'),
      id: readEnv('GOOGLE_PLACE_ID'),
      viewAllUrl: readEnv('GOOGLE_REVIEWS_URL'),
    };
  }

  return {
    apiKey: readEnv('YELP_API_KEY'),
    id: readEnv('YELP_BUSINESS_ID'),
    viewAllUrl: readEnv('YELP_REVIEWS_URL'),
  };
}

export function getReviewCacheTtlMs() {
  const raw = Number(readEnv('REVIEW_CACHE_TTL_MS', String(24 * 60 * 60 * 1000)));
  return Number.isFinite(raw) && raw > 0 ? raw : 24 * 60 * 60 * 1000;
}
