import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ReviewFeed } from './types';
import { getReviewCacheTtlMs } from './config';

const CACHE_DIR = typeof process !== 'undefined' && process.env.TMPDIR ? process.env.TMPDIR : '/tmp';
const CACHE_FILE = path.join(CACHE_DIR, 'rc-reviews-cache.json');

type CacheRecord = {
  savedAt: number;
  feed: ReviewFeed;
};

let memoryCache: CacheRecord | null = null;

function isFresh(record: CacheRecord) {
  return Date.now() - record.savedAt < getReviewCacheTtlMs();
}

export async function readReviewCache(): Promise<ReviewFeed | null> {
  if (memoryCache && isFresh(memoryCache)) return memoryCache.feed;

  try {
    const raw = await readFile(CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as CacheRecord;
    if (parsed?.feed && isFresh(parsed)) {
      memoryCache = parsed;
      return parsed.feed;
    }
  } catch {
    // No cache yet, or unreadable — fetch live.
  }

  return null;
}

export async function writeReviewCache(feed: ReviewFeed) {
  const record: CacheRecord = { savedAt: Date.now(), feed };
  memoryCache = record;

  try {
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(record));
  } catch {
    // Memory cache still covers this instance.
  }
}
