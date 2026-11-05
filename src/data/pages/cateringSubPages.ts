/** Sub-page defaults for the catering pages (split from ./catering for file size). */
import { CATERING_REQUEST_HREF } from '~/data/catering';
import type { HomeLink } from './homepage';
import type { MenuTone } from './menu';
import { type CateringTextSplitBlock, type CateringMoreOptionsBlock, type CateringSubPageContent } from './catering';

const request = (text: string): HomeLink => ({ text, href: CATERING_REQUEST_HREF });
const viewAll: HomeLink = { text: 'View all catering options', href: '/catering' };

const split = (
  anchor: string,
  tone: MenuTone,
  imageSide: 'left' | 'right',
  heading: string,
  paragraphs: string[],
  button?: HomeLink
): CateringTextSplitBlock => ({
  _type: 'cateringTextSplit',
  anchor,
  tone,
  imageSide,
  heading,
  paragraphs,
  ...(button ? { button } : {}),
});

const more = (tone: MenuTone, imageSide: 'left' | 'right', intro: string): CateringMoreOptionsBlock => ({
  _type: 'cateringMoreOptions',
  anchor: 'more-catering',
  tone,
  imageSide,
  heading: 'More Catering Options at El Ranchero',
  intro,
  button: viewAll,
});

// ── Hub ─────────────────────────────────────────────────────────────────────
// ── Sub-pages ───────────────────────────────────────────────────────────────
export const cateringSubPageDefaults: CateringSubPageContent[] = [
  {
    slug: 'taco-bar',
    pageName: 'Taco Bar Catering',
    seoTitle: 'Taco Bar Catering on Oʻahu | Taqueria El Ranchero',
    seoDescription:
      "Bring our taqueria-style tacos to your next gathering. Ask about El Ranchero's taco bar catering packages, availability and options for your group.",
    heroTitle: 'Taco Bar Catering from Taqueria El Ranchero',
    heroParagraphs: [
      "When tacos are the main event, we've got a catering option built around them.",
      "Our taco bar catering packages are a signature part of what we offer at Taqueria El Ranchero. Whether you're feeding coworkers or bringing people together for a celebration, we'd love to hear what you're planning.",
      "Tell us about your event, and we'll help you find out which taco bar options are available for your group.",
    ],
    heroButton: request('Request Taco Bar Catering'),
    blocks: [
      split('packages', 'card', 'right', 'Our Taco Bar Catering', [
        'Our food takes inspiration from the taquerias of Northern California, where the tacos are the focus.',
        'At our restaurants, we grill our meats fresh every morning, prepare our vegetables daily, and make our own salsas.',
        "We also offer taco bar catering packages. Package selections and arrangements may differ from our regular restaurant menu, so we'll help you confirm what's currently available for your event.",
        "Want to see the tacos we serve at our restaurants? [Browse our Tacos & Birria menu](/menu/tacos). Regular-menu selections aren't necessarily part of a catering package.",
      ]),
      split('planning', 'page', 'left', 'Planning Your Taco Bar Catering', [
        "You don't need to have everything figured out before contacting us. It helps to know your event date, estimated guest count, where your gathering will take place, and any food preferences or dietary requests.",
        'Once we have those details, we can discuss available taco bar packages, timing, and fulfillment arrangements for your event.',
      ]),
      more(
        'card',
        'right',
        'Taco bar catering is one of the ways we help feed groups. You can also learn more about our other catering options:'
      ),
    ],
    faqsTitle: 'Taco Bar Catering FAQs',
    faqs: [
      {
        question: "What's included in your taco bar catering packages?",
        answer: [
          "We offer taco bar catering packages, and we'll help you review the current options and what's included when you submit your request.",
        ],
      },
      {
        question: 'Can I request specific meats or toppings for my taco bar?',
        answer: [
          "Let us know which meats, toppings or other selections you're interested in. We'll confirm which options are available with our current catering packages.",
        ],
      },
      {
        question: 'Do you offer taco bar catering for larger groups?',
        answer: [
          "We're experienced in catering gatherings of different sizes. Share your estimated guest count, and we'll help you determine which taco bar options may work for your event.",
        ],
      },
    ],
    ctaTitle: 'Ready to Plan Your Taco Bar?',
    ctaSubtitle:
      "Tell us how many people you're feeding and what you have in mind. We'll help you review the available taco bar catering options and discuss the next steps for your gathering.",
    ctaButton: request('Request Taco Bar Catering'),
  },

  {
    slug: 'corporate',
    pageName: 'Corporate & Office Catering',
    seoTitle: 'Corporate & Office Catering | Taqueria El Ranchero',
    seoDescription:
      'Planning an office lunch or workplace meeting? Ask about corporate catering from Taqueria El Ranchero and share your event details with our team.',
    heroTitle: 'Corporate & Office Catering from Taqueria El Ranchero',
    heroParagraphs: [
      'Planning lunch for your team or food for an upcoming workplace gathering?',
      "We cater office orders and group events, whether you're feeding a small team or bringing coworkers together for a larger company meal.",
      "Tell us what you're planning, and we'll help you review the catering options available for your group.",
    ],
    heroButton: request('Request Office Catering'),
    blocks: [
      split('office-lunch', 'card', 'right', 'Office Lunch Catering', [
        'A team lunch is a good opportunity to share a meal without leaving everyone to figure out their own food plans.',
        "Whether it's a regular staff lunch, an employee appreciation meal, or a team celebration, we can help you discuss available catering selections.",
        "Interested in tacos? Ask us about our [Taco Bar Catering](/catering/taco-bar) packages. We'll confirm the current package options and what's included.",
        "Let us know how many people you're feeding and when you'd like to have lunch. We'll help you review the options for your group.",
      ]),
      split('meetings', 'page', 'left', 'Catering for Meetings & Workplace Gatherings', [
        'Have a staff meeting, training session, or company gathering on the calendar? We can discuss catering options for your event and help you work through the food details.',
        "Let us know when your team plans to eat, how many people will attend, and whether you have any food preferences or dietary requests. We'll confirm the available selections and arrangements for your gathering.",
        "If you're also looking for a place to host a company event, you can ask about our [Kapolei Event Space Rental](/events/event-space-rental). Venue rental is a separate offering from catering.",
      ]),
      split('workday', 'card', 'right', 'Catering That Fits Your Workday', [
        "Office lunches and meetings don't always follow the same schedule. Your team might have a short lunch break, a meeting with a set agenda, or employees taking breaks at different times.",
        "Let us know how your workday is structured and when your team plans to eat. We'll help you review the catering options and arrangements available so you can choose what makes sense for your workplace.",
      ]),
      more('page', 'left', 'Planning something outside the usual workday? Take a look at our other catering options:'),
    ],
    faqsTitle: 'Corporate & Office Catering FAQs',
    faqs: [
      {
        question: 'Can we order catering for a small office lunch?',
        answer: [
          "Yes. We handle smaller office orders as well as larger group gatherings. Let us know how many people you're feeding so we can discuss the options available for your team.",
        ],
      },
      {
        question: 'Can we request a taco bar for a company event?',
        answer: [
          "We offer taco bar catering packages. Tell us about your event and estimated guest count, and we'll help you confirm the available packages and what's included.",
        ],
      },
      {
        question: 'Is pickup or delivery available for office catering?',
        answer: [
          "Let us know where your workplace event is taking place and whether you'd prefer pickup or delivery. We'll confirm which fulfillment arrangements are available for your request.",
        ],
      },
    ],
    ctaTitle: 'Ready to Plan Your Office Catering?',
    ctaSubtitle:
      "Have a team lunch or workplace gathering coming up? Tell us when you're planning to eat, how many people you're feeding, and what you have in mind. We'll help you review the catering options and next steps.",
    ctaButton: request('Request Office Catering'),
  },

  {
    slug: 'parties',
    pageName: 'Party Catering',
    seoTitle: 'Party Catering on Oʻahu | Taqueria El Ranchero',
    seoDescription:
      "Planning a birthday, graduation, baby shower or team party? Ask us about El Ranchero party catering and tell us what you're planning for your group.",
    heroTitle: 'Party Catering for Birthdays, Graduations & More',
    heroParagraphs: [
      "Good food is part of a good celebration. Whether you're hosting a birthday party, graduation, baby shower, or family gathering, bring the flavors of our taqueria to your next event.",
      'We offer catering for groups and can help you explore the options available for your celebration.',
    ],
    heroButton: request('Request Party Catering'),
    blocks: [
      split('birthday', 'page', 'right', 'Birthday Party Catering', [
        "Celebrating another year with family and friends? Whether it's a casual birthday get-together or a party with guests of different ages, we'd love to help you plan the food.",
        "If tacos are on your birthday menu, ask us about our [Taco Bar Catering](/catering/taco-bar) packages. We'll help you confirm the available selections and arrangements for your celebration.",
      ]),
      split('graduation', 'card', 'left', 'Graduation Party Catering', [
        'Graduation parties bring together family, friends, and classmates to celebrate a big milestone. Some celebrations have everyone sitting down for a meal, while others are open houses with guests arriving throughout the day.',
        "Tell us how your graduation party is planned, and we'll help you review the catering options available for your guest count and schedule.",
      ]),
      split('baby-shower', 'page', 'right', 'Baby Shower Catering', [
        'Between games, opening gifts, and spending time with guests, a baby shower has its own rhythm.',
        "If you're planning to serve a meal, let us know when your guests will be eating and whether there are any food preferences we should know about. We'll help you discuss the catering selections available for your celebration.",
        "If you're also looking for a venue, we offer [Event Space Rental at our Kapolei location](/events/event-space-rental), which is arranged separately from catering.",
      ]),
      split('family', 'card', 'left', 'Family Party Catering', [
        'Family reunions, anniversary celebrations, and weekend get-togethers are all good reasons to share a meal.',
        "If you're bringing together relatives of different ages, let us know what kinds of food your group enjoys. You can browse [our restaurant menu](/menu) for inspiration. Catering selections may differ, so we'll help you confirm what's currently available for your gathering.",
      ]),
      split('sports', 'page', 'right', 'Sports Team Catering', [
        "Celebrating a win, wrapping up the season, or planning a team appreciation meal? Whether you're feeding just the players or inviting coaches and families too, the size of your group can make a difference when planning the food.",
        "Let us know who's attending and when your team plans to eat. We'll help you review the available catering options for your gathering.",
      ]),
      more('card', 'left', 'Looking for another way to feed your group? Take a look at our catering options:'),
    ],
    faqsTitle: 'Party Catering FAQs',
    faqs: [
      {
        question: 'Can we request a taco bar for a birthday or graduation party?',
        answer: [
          "Yes. We offer taco bar catering packages that you can ask about for your celebration. We'll confirm the available packages and what's included when you contact us.",
        ],
      },
      {
        question: 'Do you have catering options for parties with kids?',
        answer: [
          "Our regular restaurant menu includes a Kids Menu, but catering selections may differ. Tell us if children will be attending, and we'll help you confirm which food options are available.",
        ],
      },
      {
        question: 'Can we host our party at El Ranchero too?',
        answer: [
          'We also offer [Event Space Rental](/events/event-space-rental) at our Kapolei location. Venue rental is separate from catering, so contact us to discuss the arrangements for each.',
        ],
      },
    ],
    ctaTitle: 'Ready to Plan Your Party Catering?',
    ctaSubtitle:
      "Have a celebration coming up? Tell us what you're celebrating, approximately how many guests you're expecting, and what you have in mind for the food. We'll help you explore the catering options available for your gathering.",
    ctaButton: request('Request Party Catering'),
  },

  {
    slug: 'large-groups',
    pageName: 'Large Group Catering',
    seoTitle: 'Large Group Catering on Oʻahu | Taqueria El Ranchero',
    seoDescription:
      "Planning food for a large gathering? We've catered events of about 250 guests. Ask Taqueria El Ranchero about our group catering options.",
    heroTitle: 'Large Group Catering from Taqueria El Ranchero',
    heroParagraphs: [
      "Feeding a large crowd? We've catered gatherings of about 250 guests, and we'd love to hear what you're planning.",
      "Whether you're organizing a community celebration, a company event, or a big family reunion, we can help you explore our available catering options.",
      "Tell us about your gathering, and we'll help you determine what arrangements may be possible.",
    ],
    heroButton: request('Request Large Group Catering'),
    blocks: [
      split('crowd', 'page', 'right', 'Feeding a Bigger Crowd', [
        "When you're planning food for a large gathering, the number of guests is only part of the picture. Will everyone be sitting down to eat at the same time? Or will people be arriving and eating throughout the event?",
        "These details can make a difference when choosing a catering arrangement. Tell us how your gathering is planned, and we'll help you review the options available for your group.",
      ]),
      split('food', 'card', 'left', 'Choosing Food for a Large Group', [
        'From tacos to other Ranchero-style Mexican favorites, our food brings the flavors of our taqueria to group gatherings.',
        "We offer [Taco Bar Catering](/catering/taco-bar) packages, which may be worth considering for your event. Let us know what you have in mind, and we'll help you confirm the available catering selections, package details, and arrangements.",
        'You can also browse [our restaurant menu](/menu) for inspiration. Catering options may differ from what we serve at our restaurants.',
      ]),
      split(
        'space',
        'page',
        'right',
        'Need a Space for Your Gathering?',
        [
          'Still looking for a place to host your event?',
          "We also offer [Event Space Rental at our Kapolei location](/events/event-space-rental) for private gatherings. If you're considering both catering and venue rental, let us know. We'll help you find out how to inquire about each offering.",
          'Venue availability, guest capacity, and rental arrangements need to be confirmed separately from your catering order.',
        ],
        { text: 'Explore Event Space Rental', href: '/events/event-space-rental' }
      ),
      more('card', 'left', 'Have a different type of gathering in mind? Take a look at our catering options:'),
    ],
    faqsTitle: 'Large Group Catering FAQs',
    faqs: [
      {
        question: 'Is 250 guests your maximum catering capacity?',
        answer: [
          "About 250 guests is the largest group we've catered to date, but we haven't established a fixed maximum. Share your estimated guest count, and we'll help you determine whether we can accommodate your event.",
        ],
      },
      {
        question: 'Can we request taco bar catering for a large group?',
        answer: [
          "We offer taco bar catering packages. Tell us how many people you're feeding, and we'll confirm the package options and arrangements available for your gathering.",
        ],
      },
      {
        question: 'Does large group catering include an event venue?',
        answer: [
          "Catering and venue rental are separate offerings. We have [event space available for rental at our Kapolei location](/events/event-space-rental), but the venue's capacity, availability, and rental arrangements must be confirmed independently.",
        ],
      },
    ],
    ctaTitle: 'Ready to Plan Your Large Group Catering?',
    ctaSubtitle:
      "Planning a meal for a big gathering? Tell us about your event, approximately how many people you're expecting, and how you envision serving the food. We'll help you review the available catering options and next steps.",
    ctaButton: request('Request Large Group Catering'),
  },
];
