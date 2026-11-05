/**
 * Snapshot a deployed site into a local folder so seo:check and links:check
 * can run against SSR/ISR output (there is no static HTML in dist/).
 *
 * Usage: SITE_URL=https://example.vercel.app npm run snapshot:site
 * Then:  CHECK_DIR=.site-snapshot npm run seo:check && CHECK_DIR=.site-snapshot npm run links:check
 */
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const BASE = (process.env.SITE_URL || '').replace(/\/$/, '');
const OUT = process.env.CHECK_DIR || '.site-snapshot';
if (!BASE) {
  console.error('Set SITE_URL, e.g. SITE_URL=https://el-ranchero-drab.vercel.app');
  process.exit(1);
}

const seen = new Set<string>();
const queue: string[] = ['/'];

function save(route: string, body: string) {
  const file = route.endsWith('.xml') || route.endsWith('.txt') ? route : join(route, 'index.html');
  const target = join(OUT, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, body);
}

function toRoute(href: string): string | null {
  if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return null;
  let path = href;
  if (/^https?:\/\//i.test(href)) {
    if (!href.startsWith(BASE)) return null;
    path = href.slice(BASE.length) || '/';
  }
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  path = path.split('#')[0].split('?')[0];
  if (/\.[a-z0-9]+$/i.test(path)) return null; // assets
  return path === '/' ? '/' : path.replace(/\/$/, '');
}

async function fetchText(route: string) {
  const res = await fetch(BASE + route, { redirect: 'follow' });
  return { status: res.status, body: await res.text() };
}

rmSync(OUT, { recursive: true, force: true });

for (const extra of ['/sitemap.xml', '/robots.txt']) {
  const { status, body } = await fetchText(extra);
  console.log(`${status} ${extra}`);
  if (status === 200) {
    save(extra, body);
    if (extra === '/sitemap.xml') {
      for (const m of body.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        const r = toRoute(m[1].replace(/^https?:\/\/[^/]+/, BASE));
        if (r) queue.push(r);
      }
    }
  }
}

while (queue.length) {
  const route = queue.shift()!;
  if (seen.has(route)) continue;
  seen.add(route);
  const { status, body } = await fetchText(route);
  console.log(`${status} ${route}`);
  if (status >= 400) continue; // 404s are reported by links:check via missing pages
  save(route, body);
  for (const m of body.matchAll(/href=["']([^"']+)["']/gi)) {
    const r = toRoute(m[1]);
    if (r && !seen.has(r)) queue.push(r);
  }
}
console.log(`\nSnapshot: ${seen.size} routes -> ${OUT}`);
