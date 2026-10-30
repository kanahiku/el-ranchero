/**
 * Creates the Sanity Navigation (singleton-navigation) and Footer (singleton-footer)
 * documents from src/data/navigation.ts, so the header and footer are edited in Studio.
 *
 *   npm run seed:navigation               # dry run
 *   npm run seed:navigation -- --commit   # write it
 *
 * A document that already exists is left untouched. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import { navigationData } from '../src/data/navigation';

const commit = process.argv.includes('--commit');
const token = process.env.SANITY_WRITE_TOKEN;
if (commit && !token) throw new Error('SANITY_WRITE_TOKEN is required with --commit.');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? 'jntapqhj',
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-09-15',
  useCdn: false,
  token,
});

let counter = 0;
const key = () => `k${Date.now().toString(36)}${counter++}`;
const typed = <T extends object>(type: string, item: T) => ({ _key: key(), _type: type, ...item });

const { header, footer } = navigationData;

const navDoc = {
  _id: 'singleton-navigation',
  _type: 'siteNavigation',
  links: header.links.map((link) => ({
    ...typed('navLink', { text: link.text, ...(link.href ? { href: link.href } : {}) }),
    ...(link.links?.length ? { subLinks: link.links.map((sub) => typed('navSubLink', { text: sub.text, href: sub.href })) } : {}),
  })),
  ...(header.phone ? { phone: header.phone } : {}),
  actions: header.actions.map((action) => ({ _key: key(), ...action })),
};

const footerDoc = {
  _id: 'singleton-footer',
  _type: 'siteFooter',
  columns: footer.links.map((column) =>
    typed('footerColumn', {
      title: column.title,
      links: column.links.map((link) => typed('footerLink', { text: link.text, href: link.href })),
    })
  ),
  secondaryLinks: footer.secondaryLinks.map((link) => typed('footerLink', { text: link.text, href: link.href })),
  socialLinks: footer.socialLinks.map((link) =>
    typed('socialLink', { ariaLabel: link.ariaLabel, icon: link.icon, href: link.href })
  ),
  footNote: footer.footNote,
};

for (const doc of [navDoc, footerDoc] as Array<{ _id: string; _type: string } & Record<string, unknown>>) {
  const existing = await client.getDocument(doc._id);
  console.log(`${existing ? 'skip (exists)' : 'create'} ${doc._id}`);
  if (commit && !existing) await client.create(doc);
}
console.log(commit ? '\nDone.' : '\nDry run. Re-run with --commit to write.');
