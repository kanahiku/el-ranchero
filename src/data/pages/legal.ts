/**
 * Legal page copy — the seed + fallback for the Sanity `legalPage` documents
 * (ids `legal-page-<slug>`): /privacy-policy, /terms, /accessibility.
 * Text may hold `[label](href)` links. `{{placeholders}}` are filled from the
 * site config (business name, address, phone numbers) when this file loads.
 */
import { CONTACT } from '~/config/contact';
import { siteHost } from '~/config/site';
import { findStore } from '../locations';

export interface LegalSection {
  heading: string;
  /** Paragraphs shown first (rich text on Sanity). */
  body: Array<string | Record<string, unknown>>;
  /** Optional bullet list under the paragraphs. */
  bullets?: string[];
  /** Paragraphs shown after the bullets. */
  closing?: Array<string | Record<string, unknown>>;
}

export interface LegalPageContent {
  slug: string;
  pageName: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroIntro: string;
  sections: LegalSection[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: { text: string; href: string };
}

const wahiawa = findStore('wahiawa');
const kapolei = findStore('kapolei');
if (!wahiawa || !kapolei) throw new Error('Missing store data');

const values: Record<string, string> = {
  host: siteHost(),
  business: CONTACT.businessName,
  street: CONTACT.address.street,
  cityLine: CONTACT.address.cityLine,
  email: CONTACT.email,
  phone: CONTACT.phone.display,
  phoneHref: CONTACT.phone.href,
  wahiawaPhone: wahiawa.phoneDisplay,
  wahiawaHref: wahiawa.phoneHref,
  kapoleiPhone: kapolei.phoneDisplay,
  kapoleiHref: kapolei.phoneHref,
};
const fill = (text: string) => text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? '');
const fillAll = (items: string[]) => items.map(fill);

const page = (
  slug: string,
  meta: Omit<LegalPageContent, 'slug' | 'sections' | 'ctaButton'> & { ctaText: string },
  sections: LegalSection[]
): LegalPageContent => ({
  slug,
  pageName: meta.pageName,
  seoTitle: fill(meta.seoTitle),
  seoDescription: fill(meta.seoDescription),
  heroTitle: meta.heroTitle,
  heroIntro: fill(meta.heroIntro),
  sections: sections.map((section) => ({
    heading: section.heading,
    body: fillAll(section.body as string[]),
    ...(section.bullets?.length ? { bullets: fillAll(section.bullets) } : {}),
    ...(section.closing?.length ? { closing: fillAll(section.closing as string[]) } : {}),
  })),
  ctaTitle: meta.ctaTitle,
  ctaSubtitle: fill(meta.ctaSubtitle),
  ctaButton: { text: meta.ctaText, href: '/contact' },
});

export const legalPageDefaults: LegalPageContent[] = [
  page(
    'privacy-policy',
    {
      pageName: 'Privacy Policy',
      seoTitle: 'Privacy Policy | Taqueria El Ranchero',
      seoDescription:
        'Learn about website forms, analytics, external ordering services, and privacy questions at Taqueria El Ranchero.',
      heroTitle: 'Privacy Policy',
      heroIntro:
        'Taqueria El Ranchero provides this notice to explain the website features through which visitors may share information or interact with third-party services.',
      ctaTitle: 'Privacy Questions',
      ctaSubtitle:
        'For questions about privacy and the information you share through this website, please use our Contact page to reach us.',
      ctaText: 'Contact Us',
    },
    [
      {
        heading: 'Information You Provide Through Forms',
        body: [
          'Our website includes ways to send general inquiries and may offer a form to sign up for updates. When you complete a form, you provide the information requested by that form, such as contact details or a message. These features are intended to let us receive inquiries or subscription requests.',
          'Please do not submit payment card details or other sensitive personal information through a general contact form.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: 'Website Analytics',
        body: [
          'Our website uses Google Analytics 4 and Google Tag Manager. Depending on the configuration, these tools can process website activity and technical information, such as page interactions, browser details and device information.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: 'Online Ordering and External Services',
        body: [
          "Our online ordering links direct you to DoorDash. Information you enter while using DoorDash is handled through that service and is subject to its own privacy practices. Please review DoorDash's privacy information when ordering.",
          'Our website may also link to services such as Google Maps for directions. External websites and services have their own privacy practices.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: 'Privacy Questions',
        body: [
          'For questions about privacy and the information you share through this website, please use our [Contact page](/contact) to reach us.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: 'Changes to This Notice',
        body: [
          'This notice may be updated as our website features and practices change. The latest version will be available on this page.',
        ],
        bullets: [],
        closing: [],
      },
    ]
  ),
  page(
    'terms',
    {
      pageName: 'Terms of Service',
      seoTitle: 'Terms | {{business}}',
      seoDescription: 'Terms of Service for {{host}}, operated by {{business}}.',
      heroTitle: 'Terms',
      heroIntro: 'Last updated: September 8, 2026',
      ctaTitle: 'Questions?',
      ctaSubtitle: 'If you have questions about these terms or about working with {{business}}, contact us.',
      ctaText: 'Contact Us',
    },
    [
      {
        heading: '1. Acceptance of these terms',
        body: [
          'These Terms of Service govern your use of {{host}}, operated by {{business}}, referred to here as "we," "us," or "our." By accessing or using this website, you agree to these terms. If you do not agree, please do not use the site.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '2. About this website',
        body: [
          'This website provides general information about our services and allows visitors to contact us. Using this website, submitting a form, or communicating with us through the site does not by itself create a service agreement. A relationship begins only when we and you sign a written agreement.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '3. Use of this website',
        body: ['You may use this website for lawful purposes. You agree not to:'],
        bullets: [
          'Use the site in a way that violates any applicable law or regulation',
          'Attempt to gain unauthorized access to the site, its servers, or any connected systems',
          'Introduce malware, or interfere with the normal operation or security of the site',
          'Copy, scrape, or republish site content for commercial purposes without our written permission',
          'Submit false, misleading, or fraudulent information through any form on the site',
        ],
        closing: [
          'We may restrict or suspend access to the site at any time if we reasonably believe use of the site breaches these terms.',
        ],
      },
      {
        heading: '4. Service information, pricing, and estimates',
        body: [
          'We try to keep the information on this website accurate, but content may become out of date and may contain errors. Descriptions of services, availability, timelines, and any pricing shown on this site are for general information only and are not binding offers. Any estimate or quote becomes binding only when provided in writing and signed by both parties.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '5. Contact forms and submissions',
        body: [
          'When you submit a form on this website, you are asking us to contact you about our services, and you agree that we may respond by email, phone, or text using the details you provide. Please do not submit sensitive personal information, payment details, or confidential documents through the site. Information you send us is handled as described in our [Privacy Policy](/privacy-policy).',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '6. Text messages',
        body: [
          'If you provide a mobile number and opt in, we may send text messages about your inquiry, appointment, or project. Message and data rates may apply, and message frequency varies. Reply STOP to any message to opt out, or HELP for assistance. Consent to receive text messages is not a condition of purchasing any service.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '7. Third-party links and embedded content',
        body: [
          'This website may link to, or embed content from, third-party services such as maps, analytics, and review platforms. We do not control those services and are not responsible for their content, availability, or privacy practices. Your use of a third-party service is governed by that providers own terms.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '8. Cookies',
        body: [
          'This website may use cookies and similar technologies to operate the site, remember your preferences, and understand how the site is used. You can control cookies through your browser settings. See our [Privacy Policy](/privacy-policy) for more detail.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '9. Intellectual property',
        body: [
          'Unless stated otherwise, the content on this website is owned by {{business}} or used with permission. You may view and print pages for your own personal or internal business use. You may not reproduce, distribute, or create derivative works from site content without our written permission.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '10. Disclaimer of warranties',
        body: [
          'To the maximum extent permitted by applicable law, this website and its content are provided on an "as is" and "as available" basis, without warranties of any kind. Nothing in this section limits any warranty given in a signed agreement for services we perform for you.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '11. Limitation of liability',
        body: [
          'To the maximum extent permitted by applicable law, {{business}} and its owners, employees, and contractors will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of this website. Where liability cannot be excluded, our total liability relating to this website is limited to one hundred United States dollars (USD 100).',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '12. Changes to these terms',
        body: [
          'We may update these terms from time to time. The current version is always posted on this page. Continued use of the site after an update means you accept the revised terms.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: '13. Contact',
        body: [
          'Questions about these terms can be sent to:',
          '{{business}}',
          '{{street}}',
          '{{cityLine}}',
          'Email: [{{email}}](mailto:{{email}})',
          'Phone: [{{phone}}]({{phoneHref}})',
        ],
        bullets: [],
        closing: [],
      },
    ]
  ),
  page(
    'accessibility',
    {
      pageName: 'Accessibility Statement',
      seoTitle: 'Accessibility Statement | Taqueria El Ranchero',
      seoDescription:
        'Learn how to report an accessibility issue on the Taqueria El Ranchero website and contact our Wahiawa or Kapolei restaurants.',
      heroTitle: 'Accessibility Statement',
      heroIntro:
        "At Taqueria El Ranchero, we want visitors to be able to find the information they need about our restaurants and use our website's main features.",
      ctaTitle: 'Report an Accessibility Issue',
      ctaSubtitle:
        'If a page or feature is difficult to use, contact us and include the page address and a short description of what happened.',
      ctaText: 'Contact Us',
    },
    [
      {
        heading: 'Report an Accessibility Issue',
        body: [
          'If you have difficulty accessing a page, reading information or using a website feature, please let us know through our [Contact page](/contact). Sharing the page address and a brief description of what happened can help us understand the issue.',
          'You may also call either restaurant if you need help with information that is difficult to access online.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: 'Contact Our Locations',
        body: [
          'Wahiawa: [{{wahiawaPhone}}]({{wahiawaHref}})',
          'Kapolei: [{{kapoleiPhone}}]({{kapoleiHref}})',
          'Both restaurants also accept orders by phone.',
        ],
        bullets: [],
        closing: [],
      },
      {
        heading: 'Third-Party Websites',
        body: [
          'Some links on our website lead to third-party services, including DoorDash for online ordering. Accessibility features and limitations on those services are managed by their respective providers.',
        ],
        bullets: [],
        closing: [],
      },
    ]
  ),
];
