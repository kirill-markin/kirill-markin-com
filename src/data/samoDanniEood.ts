import { SITE_URL } from './contacts';

export interface CompanyApp {
  schemaId: string;
  name: string;
  url: string;
  description: string;
}

export interface CompanyAddress {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  countryName: string;
  countryCode: string;
}

export interface Company {
  path: string;
  url: string;
  organizationId: string;
  name: string;
  cyrillicName: string;
  uic: string;
  vatId: string;
  foundingDate: string;
  email: string;
  logoPath: string;
  schemaLogoUrl: string;
  address: CompanyAddress;
  sameAs: string[];
  apps: CompanyApp[];
}

const COMPANY_PATH = '/samo-danni-eood/';

// The organization and app @id values are shared with nibomo.com and
// expense-budget-tracker.com, which reference these entities; keep them stable.
export const samoDanniEood: Company = {
  path: COMPANY_PATH,
  url: `${SITE_URL}${COMPANY_PATH}`,
  organizationId: `${SITE_URL}${COMPANY_PATH}#organization`,
  name: 'SAMO DANNI EOOD',
  cyrillicName: 'САМО ДАННИ ЕООД',
  uic: '207395566',
  vatId: 'BG207395566',
  foundingDate: '2023-05-26',
  email: 'kirill@kirill-markin.com',
  logoPath: `${COMPANY_PATH}logo.svg`,
  schemaLogoUrl: `${SITE_URL}${COMPANY_PATH}google-play-developer/logo.png`,
  address: {
    streetAddress: 'bul. Maritsa 154, entr. D, fl. 6, apt. 14',
    addressLocality: 'Plovdiv',
    postalCode: '4018',
    countryName: 'Bulgaria',
    countryCode: 'BG',
  },
  sameAs: [
    'https://apps.apple.com/us/developer/samo-danni-eood/id6780428455',
    'https://play.google.com/store/apps/dev?id=6698442103294061634',
  ],
  apps: [
    {
      schemaId: 'https://nibomo.com/#software',
      name: 'Nibomo',
      url: 'https://nibomo.com/',
      description: 'Open-source flashcards app with FSRS spaced repetition for web, iOS, and Android.',
    },
    {
      schemaId: 'https://expense-budget-tracker.com/#software',
      name: 'Expense Budget Tracker',
      url: 'https://expense-budget-tracker.com/',
      description: 'Open-source expense and budget tracker.',
    },
  ],
};

export const getCompanyApp = (url: string): CompanyApp => {
  const app = samoDanniEood.apps.find(companyApp => companyApp.url === url);
  if (!app) {
    throw new Error(`No ${samoDanniEood.name} app is registered for URL "${url}" in src/data/samoDanniEood.ts`);
  }
  return app;
};
