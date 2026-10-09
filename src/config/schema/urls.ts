import { siteOrigin as originFromConfig } from '~/config/site';

export function siteOrigin(): string {
  return originFromConfig();
}

export function absoluteUrl(path: string): string {
  const origin = siteOrigin();
  if (!path || path === '/') return `${origin}/`;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function businessId(idFragment: string): string {
  return `${siteOrigin()}/#${idFragment.replace(/^#/, '')}`;
}
