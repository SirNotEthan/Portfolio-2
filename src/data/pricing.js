export const serviceTiers = [
  {
    id: 'small',
    name: 'Small / Simple',
    priceRange: '£150–£350',
    scope: '1–3 pages',
    features: [
      'Mostly static content',
      'Fully responsive layout',
      'Simple, clean design',
      'Optional light data integration',
    ],
    commission: '10%',
  },
  {
    id: 'medium',
    name: 'Medium / Interactive',
    priceRange: '£350–£600',
    scope: '1–5 pages',
    features: [
      'Interactive functionality',
      'Light backend integration',
      'Small-scale dynamic features',
      'Responsive across all devices',
    ],
    commission: '15%',
  },
  {
    id: 'advanced',
    name: 'Advanced / Multi-User',
    priceRange: '£600–£1,200',
    scope: 'Multi-page',
    features: [
      'User logins & roles',
      'Database integration',
      'Content creation & management',
      'API connections',
    ],
    commission: '15%',
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium / Fully Custom',
    priceRange: '£350–£700',
    scope: 'Multi-section',
    features: [
      'Fully custom design',
      'Polished UI/UX',
      'Branding & identity focus',
      'Optional dynamic features',
    ],
    commission: '15–20%',
  },
];

export const addOns = [
  { name: 'Monthly maintenance / updates', price: '£30–£100/mo' },
  { name: 'Additional pages', price: '£20–£80 each' },
  { name: 'API integrations', price: '£40–£150' },
  { name: 'SEO / Analytics setup', price: '£40–£150' },
];
