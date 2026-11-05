import { resolveContentImage, type SanityImageFields } from '../../sanity/image';
import type { ContentImage } from '../types';

export type FetchedImage = ContentImage & SanityImageFields;

export const IMAGE_PROJECTION = (field: string, fallbackAlt: string) => /* groq */ `
  "${field}": select(defined(${field}.asset) => {
    "src": ${field}.asset->url,
    "alt": coalesce(${field}.alt, "${fallbackAlt}"),
    "crop": ${field}.crop,
    "hotspot": ${field}.hotspot,
    "asset": ${field}.asset
  }, null)
`;

export const COPY_REPLACEMENTS: Array<[string, string]> = [
  ["We're", 'We are'],
  ["we're", 'we are'],
  ["We've", 'We have'],
  ["we've", 'we have'],
  ["that's", 'that is'],
  ["That's", 'That is'],
  ["what's", 'what is'],
  ["What's", 'What is'],
  ["doesn't", 'does not'],
  ["Doesn't", 'Does not'],
  ["you'll", 'you will'],
  ["You'll", 'You will'],
  ["we'll", 'we will'],
  ["We'll", 'We will'],
  ["family's", 'family'],
  ["Family's", 'Family'],
  ['site’s', 'site'],
  ['Site’s', 'Site'],
];

export function normalizeWebsiteCopy(value: string): string {
  let text = value;
  for (const [from, to] of COPY_REPLACEMENTS) {
    text = text.replaceAll(from, to);
  }

  return text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[ʻ‘’]/g, '')
    .replace(/(?<=[A-Za-z])'(?=[A-Za-z])/g, '')
    .normalize('NFC');
}

export const withResolvedImage = <T extends Record<string, unknown>>(item: T) => ({
  ...item,
  image: resolveContentImage(item.image as FetchedImage | null),
});
